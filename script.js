const width = 800;
const height = 500;
const padding = 60;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

function createHeatMap(data) {
  const baseTemp = data["baseTemperature"];
  const values = data["monthlyVariance"];

  d3.select("body").append("h2").attr("id", "title").text("Heat Map By Gstam");
  d3.select("body")
    .append("p")
    .attr("id", "description")
    .text("Monthly Global Land-Surface Temperature from 1753 to 2015");

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3.select("#tooltip");

  const minYear = d3.min(values, (d) => d["year"]);
  const maxYear = d3.max(values, (d) => d["year"]);

  const xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([padding, width - padding]);
  const yScale = d3
    .scaleTime()
    .range([padding, height - padding])
    .domain([new Date(0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0)]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,  ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d) => {
      vari = d["variance"];
      if (vari <= -1) {
        return "Blue";
      } else if (vari <= 0) {
        return "LightBlue";
      } else if (vari <= 1) {
        return "Yellow";
      } else {
        return "Red";
      }
    })
    .attr("data-month", (d) => d["month"] - 1)
    .attr("data-year", (d) => d["year"])
    .attr("data-temp", (d) => {
      return baseTemp + d["variance"];
    })
    .attr("height", (height - 2 * padding) / 12)
    .attr("y", (d) => {
      return yScale(new Date(0, d["month"] - 1, 0, 0, 0, 0));
    })
    .attr("width", (d) => {
      const numOfYears = maxYear - minYear;
      return (width - 2 * padding) / numOfYears;
    })
    .attr("x", (d) => xScale(d["year"]))
    .on("mouseover", (d) =>
      tooltip
        .transition()
        .duration(300)
        .text(
          `Year: ${d["year"]}
          Variance:${d["variance"]}
          Temp:${(baseTemp + d["variance"]).toFixed(2)}
        `
        )
        .style("left", `${d3.event.x}px`)
        .style("top", `${d3.event.y}px`)
        .duration(200)
        .style("visibility", "visible")
        .attr("data-year", d["year"])
    )
    .on("mouseout", (d) =>
      tooltip.transition().duration(300).style("visibility", "hidden")
    );

  d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("class", "legend")
    .attr("width", 160)
    .attr("height", 30);

  const dataSet = [1, 2, 3, 4];
  const legend = d3.select("#legend");
  legend
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", 40)
    .attr("y", 30)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", (d) => {
      if (d == 1) {
        return "Blue";
      } else if (d == 2) {
        return "LightBlue";
      } else if (d == 3) {
        return "Yellow";
      } else {
        return "Red";
      }
    });
}
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createHeatMap(data);
  });

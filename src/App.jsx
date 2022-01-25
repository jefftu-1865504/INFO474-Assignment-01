import { scaleLinear, scaleBand, extent, line } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import census from "./census";

var ages = []
for (var i = 0; i < 19; i++) ages[i] = i * 5;
console.log(ages)

var lineName = { 1900: '1900 Male', 3800: '___________1900 Female', 2000: '2000 Male', 4000: '2000 Female' }
var lineColor = { 1900: 'red', 3800: 'blue', 2000: 'green', 4000: 'purple' }
var peopleByYear = { 1900: [], 3800: [], 2000: [], 4000: [] }
var data = { 1900: [], 2000: [] }

Object.keys(data).forEach((year) => {
  for (var i = 0; i < census.length; i++) {
    if (year == census[i].Year)
      data[year].push(census[i]);
  }

  var temp = [{}, {}]
  ages.forEach((age) => {
    temp[0][age] = temp[1][age] = 0
  })

  for (var i = 0; i < data[year].length; i++) {
    temp[data[year][i].Sex - 1][data[year][i].Age] += data[year][i].People / 1000000
  }
  temp.forEach((x, i) => {
    ages.forEach((age) => {
      peopleByYear[year * (i + 1)].push(temp[i][age])
    })
  })
  console.log(peopleByYear[year]);
  console.log(peopleByYear[year * 2]);
})

function App() {
  const chartSize = 500;
  const margin = 100;
  const legendPadding = 200;
  const _extent = Math.max(extent(peopleByYear[1900])[1], extent(peopleByYear[2000])[1])
  console.log(_extent)

  const _scaleY = scaleLinear()
    .domain([0, _extent])
    .range([chartSize - margin, margin]);
    
  const _scaleLine = scaleLinear()
    .domain([0, ages.length - 1])
    .range([margin, chartSize - margin]);

  const _scaleDate = scaleBand()
    .domain(ages)
    .range([0, chartSize - margin - margin]);

  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });

  return (
    <div style={{ margin: 20 }}>
      <h1>How has the population of people in different age groups changed from 1900 to 2000?</h1>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize}
        >
          <AxisLeft
            strokeWidth={0.5}
            left={margin}
            scale={_scaleY}
            label="Number of people (in millions)"
          />

          <AxisBottom
            strokeWidth={0.5}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={ages}
            label="Age Group"
          />

          {Object.keys(peopleByYear).map((year, i) => {
            return (
              <path
                stroke={lineColor[year]}
                strokeWidth={4}
                fill="none"
                key={year}
                d={_lineMaker(peopleByYear[year])}
              />
            );
          })}

          {Object.keys(peopleByYear).map((year, i) => {
            return (
              <text
                fill={lineColor[year]}
                style={{
                  fontSize: 10,
                  fontWeight: 300,
                }}
                key={`legend--${lineName[year]}`}
                x={chartSize - margin + 5}
                y={_scaleY(peopleByYear[year][ages.length - 1])}
              >
                {lineName[year]}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
export default App;

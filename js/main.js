import { initIntro } from './intro.js';
import { initMap } from './map.js';

initIntro();
initMap();

// reservoir levels graph
const margin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 65
};

const container = d3.select('#reservoir-chart');

const width = 850;
const height = 400;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const reservoirs = [
    "Ashokan",
    "Cannonsville",
    "Neversink",
    "Pepacton",
    "Rondout",
    "Schoharie"
];

const parseDate = d3.timeParse("%-m/%-d/%y");


d3.csv("data/reservoir_vols.csv", d => {
    return {
        date: parseDate(d["Point time"]),

        // Combine the two Ashokan reservoirs for each day.
        Ashokan: +d["Ashokan East"] + +d["Ashokan West"],

        Cannonsville: +d["Cannonsville"],
        Neversink: +d["Neversink"],
        Pepacton: +d["Pepacton"],
        Rondout: +d["Rondout"],
        Schoharie: +d["Schoharie"]
    };
}).then(data => {

    // Remove invalid rows and sort chronologically.
    data = data.filter(d =>
        d.date !== null &&
        [
            d.Ashokan,
            d.Cannonsville,
            d.Neversink,
            d.Pepacton,
            d.Rondout,
            d.Schoharie
        ].every(Number.isFinite)
    );

    data.sort((a, b) => a.date - b.date);

    // Group daily observations by calendar month
    const monthly = Array.from(
        d3.rollup(
            data,
            rows => {
                const result = {
                    date: d3.timeMonth.floor(rows[0].date)
                };

                const keys = [
                    "Ashokan",
                    "Cannonsville",
                    "Neversink",
                    "Pepacton",
                    "Rondout",
                    "Schoharie"
                ];

                keys.forEach(key => {
                    result[key] = d3.mean(rows, d => d[key]);
                });

                return result;
            },
            d => d3.timeMonth.floor(d.date)
        ).values()
    ).sort((a, b) => a.date - b.date);

    // Use monthly data for the graph below

    const series = reservoirs.map(name => ({
        name: name,
        values: monthly.map(d => ({
            date: d.date,
            volume: d[name]
        }))
    }));

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "90%");

    // This group accounts for the margins
    const chart = svg.append("g")
        .attr("transform",
            `translate(${margin.left},${margin.top})`
        );

    const x = d3.scaleTime()
        .domain(d3.extent(monthly, d => d.date))
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(monthly, d =>
                d3.max(reservoirs, name => d[name])
            )
        ])
        .nice()
        .range([innerHeight, 0]);

    // X-axis title
    svg.append("text")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Date");

    // Y-axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Average reservoir volume (billion gallons)");

    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x));

    chart.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.volume));

    const color = d3.scaleOrdinal()
        .domain(reservoirs)
        .range(d3.schemeTableau10);

    chart.selectAll(".reservoir-line")
        .data(series)
        .join("path")
        .attr("class", "reservoir-line")
        .attr("fill", "none")
        .attr("stroke", d => color(d.name))
        .attr("stroke-width", 2)
        .attr("d", d => line(d.values));

    const legend = svg.append("g")
        .attr("transform", "translate(85, 15)");

    const legendItem = legend.selectAll(".legend-item")
        .data(reservoirs)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) =>
             `translate(${(i % 3) * 180}, ${Math.floor(i / 3) * 28})`
        );

    legendItem.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", d => color(d))
        .attr("stroke-width", 3);

    legendItem.append("text")
        .attr("x", 27)
        .attr("y", 4)
        .text(d => d);

});
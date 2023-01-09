import { csv, d3, LineChart } from "../d3.client/client.js";

const dates = csv.map(d => new Date(d.Event_Date))
    .sort((a, b) => a.getTime() - b.getTime());


const data = Array.from(
    d3.rollup(
        dates,
        v => v.length,
        d => d.getFullYear()
    ), ([year, total]) => ({ year: new Date().setFullYear(year), total })
);

const node = LineChart(data, {
    x: d => d.year,
    y: d => d.total,
    yLabel: "Aircraft Incidents",
    color: "skyblue",
});

const title = document.createElement('h1');
title.innerHTML = "Total Aircraft Incidents by Year";
title.style.fontFamily = "sans-serif";

document.body.appendChild(title);
document.body.appendChild(node);
import { LineChart } from "../d3.client/client.js";
import { rollup } from 'd3';

import { csv } from '../../data/index.js';

const dates = csv.map(d => new Date(d.Event_Date))
    .sort((a, b) => a.getTime() - b.getTime());


const data = Array.from(
    rollup(
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
title.style.margin = "10px 0px";

const caption = document.createElement('a');
caption.href = "https://www.ntsb.gov/Pages/AviationQuery.aspx";
caption.innerHTML = "NTSB Aviation Accident Database";
caption.style.margin = "10px 0px";
caption.style.display = "inline-block";
caption.style.textDecoration = "none";
caption.style.color = "black";

document.body.appendChild(title);
document.body.appendChild(caption);
document.body.appendChild(node);
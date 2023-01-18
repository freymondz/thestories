import { GroupedBarChart, Legend } from '../d3.client/client.js';
import { sum, groupSort } from 'd3';

import { csv } from '../../data/index.js';

const types = ['Total_Fatal_Injuries', 'Total_Serious_Injuries', 'Total_Uninjured'];

const data = types.flatMap(
    type => csv.map(
        d => ({
            Make: d.Make,
            type,
            Passengers: d[type] 
        })
    )
).filter(d => {
    for (const key of Object.keys(d)) {
        if (d[key] === null) {
            return false;
        }
    }
    return true;
});

const node = GroupedBarChart(data, {
    x: d => d.Make,
    y: d => d.Passengers,
    z: d => d.type,
    zDomain: types,
    yLabel: "Passengers",
    xLabel: "Aircraft Manufacturer",
    xDomain: groupSort(
        data,
        D => sum(D, d => -d.Passengers),
        d => d.Make)
});

const legend = Legend(node.scales.color, {
    tickValues: types,
    title: "Injury Severity",
    width: 320,
    tickFormat: d => d === 'Total_Fatal_Injuries' ? 'Fatal' : d === 'Total_Serious_Injuries' ? 'Serious' : 'Uninjured',
    tickSize: 0,
});

const title = document.createElement('h1');
title.innerHTML = "Injury Severity of Aircraft Incidents Per Aircraft Manufacturer";
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
document.body.appendChild(legend);
document.body.appendChild(node);

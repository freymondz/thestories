import { csv } from "../../data/index.js";
import { Treemap, Legend } from '../d3.client/client.js';
import { rollup, treemapSquarify, schemeSet1, schemeSet2, schemeSet3, schemeAccent, schemeCategory10, schemeDark2} from 'd3';

const data = csv.filter(d => d.Country === "United States" && d.Location !== null)
    .map(d => {
        return {
            state: d.Location.split(' ').pop(),
            model: ` ${d.Make}\n${d.Model}` 
        }
    });

const group = rollup(data, v => v.length, d => d.state, d=> d.model);

const json = {name: "state", children: []};
for (const [state, models] of group) {
    const child = {name: state, children: []};
    for (const [model, count] of models) {
        child.children.push({name: model, size: count});
    }
    json.children.push(child);
}


const node = Treemap(json, {
    value: d => d.size,
    group: (d, n) => n.ancestors().slice()[1].data.name,
    label: (d, n) => `${n.ancestors().reverse().map(d => d.data.name)[2]}\n${n.value.toLocaleString("en")}`,
    width: 1310,
    height: 830,
    colors: schemeSet1.concat(schemeSet2).concat(schemeSet3).concat(schemeAccent).concat(schemeCategory10).concat(schemeDark2),
    tile: treemapSquarify,
});

const legend = Legend(node.scales.color, {
    title: 'State',
    width: 1310,
});

const title = document.createElement('h1');
title.innerHTML = "Aircraft Incidents Per State";
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
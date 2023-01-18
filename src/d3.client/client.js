import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/grouped-bar-chart
export function GroupedBarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [xmin, xmax]
    xPadding = 0.1, // amount of x-range to reserve to separate groups
    yType = d3.scaleLinear, // type of y-scale
    yRange = [height - marginBottom, marginTop], // [ymin, ymax]
    zDomain, // array of z-values
    zPadding = 0.05, // amount of x-range to reserve to separate bars
    yLabel = "", // a label for the y-axis
    xLabel = "", // a label for the x-axis
    colors = d3.schemeTableau10, // array of colors
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default domains, and unique the x- and z-domains.
    if (xDomain === undefined) xDomain = X;
    const yDomain = [0, d3.max(Y)];
    if (zDomain === undefined) zDomain = Z;
    xDomain = new d3.InternSet(xDomain);
    zDomain = new d3.InternSet(zDomain);

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
    const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
    const yScale = yType(yDomain, yRange);
    const zScale = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-style", "italic")
            .text(yLabel));

    svg.append("g")
        .selectAll("rect")
        .data(d3.range(X.length))
        .join("rect")
            .attr("x", i => xScale(X[i]) + xzScale(Z[i]))
            .attr("y", i => yScale(Y[i]))
            .attr("width", xzScale.bandwidth())
            .attr("height", i => yScale(0) - yScale(Y[i]))
            .attr("fill", i => zScale(Z[i]));

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width / 2 + marginLeft / 2)
            .attr("y", marginBottom)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .attr("font-style", "italic")
            .text(xLabel));

    return Object.assign(svg.node(), { scales: { color: zScale } });
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/line-chart
export function LineChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleUtc, // the x-scale type
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // the y-scale type
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yLabel = "", // a label for the y-axis
    color = "currentColor", // stroke color of line
    strokeLinecap = "round", // stroke line cap of the line
    strokeLinejoin = "round", // stroke line join of the line
    strokeWidth = 1.5, // stroke width of line, in pixels
    strokeOpacity = 1, // stroke opacity of line
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
    const D = d3.map(data, (d, i) => !isNaN(X[i]) && !isNaN(Y[i]));
    // Compute default domains.
    const xDomain = d3.extent(X);
    const yDomain = [0, d3.max(Y)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange).nice(15);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 40).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40);

    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width / 2 - marginLeft / 2)
            .attr("y", marginBottom)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-style", "italic")
            .text('Year'));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-style", "italic")
            .text(yLabel));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I));

    return svg.node();
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
export function Legend(color, {
    title,
    tickSize = 6,
    width = 320,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    tickValues
} = {}) {

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

    // Ordinal
    const x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => { };

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title));

    return svg.node();
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/treemap
export function Treemap(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
    value, // given a node d, returns a quantitative value (for area encoding; null for count)
    label, // given a leaf node d, returns the name to display on the rectangle
    group, // given a leaf node d, returns a categorical value (for color encoding)
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    paddingInner = 1, // to separate a node from its adjacent siblings
    paddingTop = 1, // to separate a node’s top edge from its children
    paddingRight = 1, // to separate a node’s right edge from its children
    paddingBottom = 1, // to separate a node’s bottom edge from its children
    paddingLeft = 1, // to separate a node’s left edge from its children
    colors = d3.schemeTableau10, // array of colors
} = {}) {

    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
    const root = d3.hierarchy(data);

    // Compute the values of internal nodes by aggregating from the leaves.
    root.sum(d => Math.max(0, value(d)));

    // Prior to sorting, if a group channel is specified, construct an ordinal color scale.
    const leaves = root.leaves();
    const G = leaves.map(d => group(d.data, d));
    let zDomain = G;
    zDomain = new d3.InternSet(zDomain);
    const color = d3.scaleOrdinal(zDomain, colors);

    // Compute labels and titles.
    const L = label == null ? null : leaves.map(d => label(d.data, d));

    // Compute the treemap layout.
    d3.treemap()
        .tile(d3.treemapBinary)
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .paddingInner(paddingInner)
        .paddingTop(paddingTop)
        .paddingRight(paddingRight)
        .paddingBottom(paddingBottom)
        .paddingLeft(paddingLeft)
        .round(true)
        (root);

    const svg = d3.create("svg")
        .attr("viewBox", [-marginLeft, -marginTop, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

    const node = svg.selectAll("a")
        .data(leaves)
        .join("a")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    node.append("rect")
        .attr("fill", (d, i) => color(G[i]))
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    node.append("clipPath")
        .attr("id", (d, i) => `${uid}-clip-${i}`)
        .append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    node.append("text")
        .attr("clip-path", (d, i) => `url(${new URL(`#${uid}-clip-${i}`, location)})`)
        .selectAll("tspan")
        .data((d, i) => `${L[i]}`.split(/\n/g))
        .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, D) => `${(i === D.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
            .text(d => d);

    return Object.assign(svg.node(), { scales: { color } });
}

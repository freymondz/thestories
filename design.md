# Design Document

Zachary Zhang

INFO 474 - Winter 2023

## Visualizations

I used the NTSB Aircraft incidents dataset `aircraft_incidents.csv` as the data source for my visualizations. The visualizations were created with `D3.js`. The main visualizations and legends were created with proivded code snippets from the [D3 observablehq page](https://observablehq.com/@d3/). The code I wrote to output the visualizations and process the data set can be found [here](https://github.com/freymondz/thestories).

### Vis 1

For the first visualization I wondered how each aircraft manufacturer differed in the severity of injuries that occured in an inccident. I used a grouped bar chart because the data is nominal and the grouping of the bars allows for easy comparison between the different manufacturers and the different injury categories. I choose to organize by the "Fatal" category to see which manufacturer had the most fatal accidents. I also added a legend to the chart to show the different injury categories.

### Vis 2

In the second visualization I wanted to see the overall trend of aircraft incidents over the years. I used a line chart because the data is a ordinal time series and line charts are good for showing trends and plotting over time. I grouped the data by year so that there's less visual noise and the trend from year to year would be easier to see.

### Vis 3

For the final visualization I wanted to see how the amount of incidents in each state was different. I used a Treemap because it's a good way to show the relative size of different categories. I grouped the data by state and aircraft model to show the different models that were involved in incidents in each state. I also added a legend to the chart to show the different states, each state gets a unique color for easier identifaction. Each node in the Treemap shows the number of incidents that occured in that state and the model of the aircraft involved.

import { csvParse, autoType } from 'd3';

const request = await fetch('http://localhost:8081/data/aircraft_incidents.csv');
const text = await request.text();

/**
 * @type {import("d3").DSVParsedArray<import("./").AircraftIncident>}
 */
export const csv = csvParse(text, autoType);
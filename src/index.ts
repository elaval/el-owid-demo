import { OWIDTrendChart } from "./OWIDTrendChart";

export const hello = (name: string): string => "Hello, " + name + "!";

export function OWIDPlot(data:[], options: {}) {
    const chart = new OWIDTrendChart(data, options);
    return chart.render();
}
import { OWIDTrendChart } from "./OWIDTrendChart";
import { Add } from "./add";
export const hello = (name) => "Hello, " + name + "!";
export const test = (a, b) => Add(a, b);
export function OWIDPlot(data, options) {
    const type = options && options.type || "trendChart";
    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    }
    else {
        return null;
    }
}

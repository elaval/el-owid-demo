import { OWIDTrendChart } from "./OWIDTrendChart";
export const hello = (name) => "Hello, " + name + "!";
export function OWIDPlot({ data, options }) {
    const type = options && options.type || "trendChart";
    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    }
    else {
        return null;
    }
}

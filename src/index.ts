import { OWIDTrendChart } from "./OWIDTrendChart";

export function OWIDPlot(data: any, options: { type: any; }): any {
    const type = options && options.type || "trendChart"

    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    } else {
        return null;
    }

}

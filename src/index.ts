import { OWIDTrendChart } from "./OWIDTrendChart";

import { Add } from "./add";

export const hello = (name: string): string => "Hello, " + name + "!";

export const test = (a: any,b: any) => Add(a,b);


export function OWIDPlot(data: any, options: { type: any; }): any {
    const type = options && options.type || "trendChart"

    if (type == "trendChart") {
        let chart = new OWIDTrendChart(data, options);
        return chart.render();
    } else {
        return null;
    }

}

import * as d3 from 'd3';

export class OWIDTrendChart {
    data: [] = [];
    container: d3.Selection<any, any, any, any>;

    constructor(data: any, options: any) {
        this.data = data;
        this.container = d3.create("svg");
    }

    render() {
        return this.container.node();
    }
}


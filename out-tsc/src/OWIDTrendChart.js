import * as d3 from 'd3';
export class OWIDTrendChart {
    data = [];
    container;
    constructor(data, options) {
        this.data = data;
        this.container = d3.create("svg");
    }
    render() {
        return this.container.node();
    }
}

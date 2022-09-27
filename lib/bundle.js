(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3'), require('lodash'), require('OWIDTrendChartLines')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3', 'lodash', 'OWIDTrendChartLines'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["owid-demo"] = {}, global.d3, global._, global.OWIDTrendChartLines));
})(this, (function (exports, d3, _, OWIDTrendChartLines) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespace(d3);
    var ___namespace = /*#__PURE__*/_interopNamespace(_);

    class OWIDTooltipTrend {
        colorScale;
        tooltipContainer;
        toolTip;
        constructor(options) {
            this.colorScale =
                (options && options.colorScale) || d3__namespace.scaleOrdinal(d3__namespace.schemeCategory10);
            this.tooltipContainer = d3__namespace.create("div").attr("class", "tooltip-container");
            this.toolTip = this.tooltipContainer
                .attr("class", "Tooltip")
                .style("display", "none")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("left", `${0}px`)
                .style("top", `${0}px`)
                .style("white-space", "nowrap")
                .style("background-color", "rgba(255, 255, 255, 0.95)")
                .style("box-shadow", "rgba(0, 0, 0, 0.12) 0px 2px 2px, rgba(0, 0, 0, 0.35) 0px 0px 1px")
                .style("border-radius", "2px")
                .style("text-align", "left")
                .style("font-size", "0.9em")
                .style("padding", "0.3em").html(`
      <table>
        <thead>
          <tr><td colspan="3">DUMMY YEAR<td><tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      `);
            this.toolTip
                .append("table")
                .style("font-size", "0.9em")
                .style("line-height", "1.4em")
                .style("white-space", "normal")
                .call((table) => table.append("thead"))
                .call((table) => table.append("tbody"));
        }
        render() {
            return this.tooltipContainer;
        }
        show(pos, options) {
            const year = options && options.year;
            const data = options && options.data;
            this.tooltipContainer
                .style("display", "block")
                .style("top", `${pos[1]}px`)
                .style("left", `${pos[0]}px`);
            // Add year information on table header
            this.toolTip.select("thead").select("td").text(year);
            // Add rows with entityName, value data
            this.toolTip
                .select("tbody")
                .selectAll("tr")
                .data(data)
                .join((enter) => {
                enter
                    .append("tr")
                    .call((tr) => tr
                    .append("td")
                    .attr("class", "symbol")
                    .append("div")
                    .attr("style", "width: 10px; height: 10px; border-radius: 5px; background-color: grey; display: inline-block; margin-right: 2px;"))
                    .call((tr) => tr.append("td").attr("class", "entityName"))
                    .call((tr) => tr.append("td").attr("class", "value"));
            }, (update) => {
                update
                    .selectAll("td")
                    .style("color", (d) => this.colorScale(d.entityName));
                update
                    .select("td.symbol")
                    .select("div")
                    .style("background-color", (d) => this.colorScale(d.entityName));
                update.select("td.entityName").text((d) => d.entityName);
                update.select("td.value").text((d) => d.value);
            });
        }
        hide() {
            this.tooltipContainer.style("display", "none");
        }
    }

    class OWIDTrendChart {
        data = [];
        container;
        height = 400;
        width;
        marginTop;
        marginBottom;
        y;
        x;
        chartType;
        unit;
        className;
        filter;
        filteredData;
        valuesRange;
        dimensions;
        scaleX;
        scaleY;
        scaleColor;
        axisX;
        axisY;
        marginLeft;
        marginRight;
        seriesData;
        chartContainer;
        chartSVG;
        toolTip;
        colorScale;
        chartContent;
        markEL;
        ariaLabel;
        ariaDescription;
        constructor(data, options) {
            this.data = data;
            this.container = d3__namespace.create("svg");
            this.height = (options && options.height) || 400;
            this.width = (options && options.width) || 800;
            this.marginTop = (options && options.marginTop) || 50;
            this.marginBottom = (options && options.marginBottom) || 50;
            this.y = (options && options.y) || {};
            this.x = (options && options.x) || {};
            this.chartType = (options && options.chartType) || "lineChart";
            this.unit = (options && options.unit) || "";
            this.className = "owidChart";
            this.unit = (options && options.unit) || "";
            this.filter = (options && options.filter) || ((d) => true);
            this.filteredData = data.filter((d) => this.filter(d));
            this.valuesRange = d3__namespace.extent(this.filteredData, (d) => d.value);
            this.dimensions = {
                years: (options && options.years) || this.getDimensionValues("year"),
                entities: (options && options.enitites) || this.getDimensionValues("entityName")
            };
            this.scaleX = d3__namespace.scaleLinear().range([0, this.width]);
            this.scaleY = d3__namespace
                .scaleLinear()
                .range([this.height, 0])
                .domain(this.valuesRange);
            this.scaleColor = d3__namespace.scaleOrdinal(d3__namespace.schemeTableau10);
            this.axisX = d3__namespace.axisBottom(this.scaleX).ticks(10, "d");
            this.axisY = d3__namespace
                .axisLeft(this.scaleY)
                .ticks(10)
                .tickFormat((d) => `${d} ${this.unit}`);
            this.marginLeft =
                (options && options.marginLeft) || this.calculateMarginLeft() * 1.5;
            this.marginRight =
                (options && options.marginRight) || this.calculateMarginRight() * 1.5;
            this.seriesData = ___namespace.chain(this.filteredData)
                .groupBy((d) => d.entityName)
                .map((items, entityName) => ({ name: entityName, data: items }))
                .value();
            this.chartContainer = d3__namespace
                .create("div")
                .attr("class", "chartContainer")
                .attr("style", "position: relative; clear: both;");
            this.chartSVG = this.setupSVGElements();
            this.chartContainer.node().appendChild(this.chartSVG.node());
            this.toolTip = new OWIDTooltipTrend({ colorScale: this.colorScale });
            this.chartContainer.node().appendChild(this.toolTip.render().node());
            if (this.y && this.y.grid) {
                this.showGridY();
            }
            if (this.x && this.x.grid) {
                this.showGridX();
            }
        }
        setupSVGElements() {
            const svg = d3__namespace
                .create("svg")
                .attr("class", this.className)
                .attr("fill", "currentColor")
                .attr("font-family", "system-ui, sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("width", this.width + this.marginLeft + this.marginRight)
                .attr("height", this.height + this.marginTop + this.marginBottom)
                .attr("viewBox", `0 0 ${this.width + this.marginLeft + this.marginRight} ${this.height + this.marginTop + this.marginBottom}`)
                .attr("aria-label", this.ariaLabel)
                .attr("aria-description", this.ariaDescription)
                .call((svg) => svg.append("style").text(this.css()))
                .call((svg) => svg
                .append("rect")
                .attr("width", this.width + this.marginLeft + this.marginRight)
                .attr("height", this.height + this.marginTop + this.marginBottom)
                .attr("fill", "white"));
            const mainContainer = svg
                .append("g")
                .attr("class", "container")
                .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`)
                .call((g) => g
                .append("rect")
                .attr("class", "backgroundLayer")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("fill", "white"))
                .call((g) => g
                .append("g")
                .attr("class", "axis x")
                .attr("transform", `translate(${0}, ${this.height})`))
                .call((g) => g
                .append("g")
                .attr("class", "axis y")
                .attr("transform", `translate(0,0)`));
            mainContainer
                .select("rect.backgroundLayer")
                .on("mousemove", (e) => this.handleMouseMove(e))
                .on("mouseleave", () => this.handleMouseLeave());
            if (this.chartType == "lineChart") {
                this.chartContent = new OWIDTrendChartLines.OWIDTrendChartLines(this.filteredData, {
                    scaleColor: this.scaleColor
                });
                this.markEL = this.chartContent.render({
                    x: this.scaleX,
                    y: this.scaleY
                });
            }
            mainContainer.select("g.axis.x").call(this.axisX);
            mainContainer.select("g.axis.y").call(this.axisY);
            const newLocal = mainContainer.node();
            newLocal && newLocal.append(this.markEL);
            return svg;
        }
        css() {
            throw new Error('Method not implemented.');
        }
        handleMouseMove(e) {
            throw new Error('Method not implemented.');
        }
        handleMouseLeave() {
            this.chartContent && this.chartContent.hideMarker();
            this.toolTip.hide();
        }
        getDimensionValues(dimension) {
            return ___namespace.chain(this.data)
                .map((d) => d[dimension])
                .uniq()
                .value();
        }
        calculateMarginLeft() {
            const axisScale = this.axisY.scale();
            const values = axisScale.ticks();
            const tickContent = values.map((d) => `${d} ${this.unit}`);
            const tickSizes = tickContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
            const maxSize = ___namespace.max(tickSizes);
            return maxSize;
        }
        calculateMarginRight() {
            const entityNames = this.dimensions.entities;
            const legendContent = entityNames.map((d) => `${d}`);
            const legendSized = legendContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
            const maxSize = ___namespace.max(legendSized);
            return maxSize;
        }
        getTextWidth(text, fontSize, fontFace) {
            const canvas = document.createElement("canvas"), context = canvas.getContext("2d");
            let textWidth = null;
            if (context) {
                context.font = fontSize + "px " + fontFace;
                textWidth = context.measureText(text).width;
            }
            return textWidth;
        }
        showGridY() {
            const axisScale = this.axisX.scale();
            const gridValues = axisScale.ticks();
            this.chartSVG
                .select("g.container")
                .append("g")
                .attr("class", "grid x")
                .selectAll("line")
                .data(gridValues)
                .join("line")
                .attr("class", "grid x")
                .attr("x1", (d) => this.scaleX(d))
                .attr("x2", (d) => this.scaleX(d))
                .attr("y1", 0)
                .attr("y2", this.height)
                .attr("stroke-dasharray", "3,2")
                .attr("stroke-width", 1)
                .attr("stroke", "lightgrey");
        }
        showGridX() {
            const axisScale = this.axisY.scale();
            const gridValues = axisScale.ticks();
            this.chartSVG
                .select("g.container")
                .append("g")
                .attr("class", "grid y")
                .selectAll("line")
                .data(gridValues)
                .join("line")
                .attr("class", "grid y")
                .attr("x1", 0)
                .attr("x2", this.width)
                .attr("y1", (d) => this.scaleY(d))
                .attr("y2", (d) => this.scaleY(d))
                .attr("stroke-dasharray", "3,2")
                .attr("stroke-width", 1)
                .attr("stroke", "lightgrey");
        }
        getClosestYear(posX) {
            const closestYear = this.dimensions.years.find((d) => d == Math.floor(this.scaleX.invert(posX)));
            return closestYear;
        }
        render() {
            return this.container.node();
        }
    }

    const hello = (name) => "Hello, " + name + "!";
    function OWIDPlot({ data, options }) {
        const type = options && options.type || "trendChart";
        if (type == "trendChart") {
            let chart = new OWIDTrendChart(data, options);
            return chart.render();
        }
        else {
            return null;
        }
    }

    exports.OWIDPlot = OWIDPlot;
    exports.hello = hello;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

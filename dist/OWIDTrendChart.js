import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDTrendChartLines } from "./OWIDTrendChartLines";
import { OWIDTrendChartTooltip } from "./OWIDTrendChartTooltip";
export class OWIDTrendChart {
    data = [];
    container;
    height;
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
        this.container = d3.create("svg");
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
        this.filter = (options && options.filter) || null;
        this.filteredData = this.filter ? data.filter((d) => this.filter(d)) : data;
        this.valuesRange = d3.extent(this.filteredData, (d) => d.value);
        this.dimensions = {
            years: (options && options.years) || this.getDimensionValues("year"),
            entities: (options && options.enitites) || this.getDimensionValues("entityName")
        };
        this.scaleX = d3.scaleLinear().range([0, this.width]);
        this.scaleY = d3
            .scaleLinear()
            .range([this.height, 0])
            .domain(this.valuesRange);
        this.scaleColor = d3.scaleOrdinal(d3.schemeTableau10);
        this.axisX = d3.axisBottom(this.scaleX).ticks(10, "d");
        this.axisY = d3
            .axisLeft(this.scaleY)
            .ticks(10)
            .tickFormat((d) => `${d} ${this.unit}`);
        this.marginLeft =
            (options && options.marginLeft) || this.calculateMarginLeft() * 1.5;
        this.marginRight =
            (options && options.marginRight) || this.calculateMarginRight() * 1.5;
        this.seriesData = _.chain(this.filteredData)
            .groupBy((d) => d.entityName)
            .map((items, entityName) => ({ name: entityName, data: items }))
            .value();
        this.chartContainer = d3
            .create("div")
            .attr("class", "chartContainer")
            .attr("style", "position: relative; clear: both;");
        this.chartSVG = this.setupSVGElements();
        this.chartContainer.node().appendChild(this.chartSVG.node());
        this.toolTip = new OWIDTrendChartTooltip({ colorScale: this.colorScale });
        this.chartContainer.node().appendChild(this.toolTip.render().node());
        if (this.y && this.y.grid) {
            this.showGridY();
        }
        if (this.x && this.x.grid) {
            this.showGridX();
        }
    }
    setupSVGElements() {
        const svg = d3
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
            this.chartContent = new OWIDTrendChartLines(this.filteredData, {
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
    handleMouseMove(e) {
        const pos = d3.pointer(e);
        const selectedYear = this.getClosestYear(pos[0]);
        this.chartContent && this.chartContent.showMarker(selectedYear);
        const tooltipData = _.chain(this.seriesData)
            .map((d) => {
            const yearRecord = d.data.find((d) => d.year == selectedYear);
            return {
                entityName: d.name,
                value: (yearRecord && yearRecord.value) || "NA"
            };
        })
            .sortBy((d) => -d.value)
            .value();
        this.toolTip.show([pos[0] + this.marginLeft, this.height * 0.25], {
            year: selectedYear,
            data: tooltipData
        });
    }
    handleMouseLeave() {
        this.chartContent && this.chartContent.hideMarker();
        this.toolTip.hide();
    }
    getDimensionValues(dimension) {
        return _.chain(this.data)
            .map((d) => d[dimension])
            .uniq()
            .value();
    }
    calculateMarginLeft() {
        const axisScale = this.axisY.scale();
        const values = axisScale.ticks();
        const tickContent = values.map((d) => `${d} ${this.unit}`);
        const tickSizes = tickContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(tickSizes);
        return maxSize || 10;
    }
    calculateMarginRight() {
        const entityNames = this.dimensions.entities;
        const legendContent = entityNames.map((d) => `${d}`);
        const legendSized = legendContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(legendSized);
        return maxSize || 10;
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
    showGridX() {
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
    showGridY() {
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
        return this.chartContainer.node();
    }
    css() {
        const inlineCss = `
        .${this.className} {
            display: block;
            background: white;
            height: auto;
            height: intrinsic;
            max-width: 100%;
        }
        .${this.className} text,
        .${this.className} tspan {
            white-space: pre;
        }
        .${this.className} .axis text {
            white-space: pre;    font-size: 16.2px;
            fill: rgb(102, 102, 102);        
        }

        .${this.className} .axis path {
            display: none
        }
        .${this.className} .axis.y line {
            display: none
        }

        .GrapherComponent {
            display: inline-block;
            border-bottom: none;
            border-radius: 2px;
            text-align: left;

            line-height: 1em;

            background: white;
            color: #333;

            position: relative;

            /* Hidden overflow x so that tooltips don't cause scrollbars 
            overflow: hidden;

            border-radius: 2px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 0px,
                rgba(0, 0, 0, 0.25) 0px 2px 2px 0px;
            z-index: $zindex-chart;

            * {
                box-sizing: border-box;
            }

            button {
                background: none;
                border: none;
            }

            .btn {
                font-size: 0.8em;
                white-space: normal;
            }

            .flash {
                margin: 10px;
            }

            .clickable {
                cursor: pointer;

                a {
                    text-decoration: none;
                    &:visited {
                        color: initial;
                    }
                }
            }
            input[type="checkbox"] {
                cursor: pointer;
            }

            /* Make World line slightly thicker 
            svg .key-World_0 polyline {
                stroke-width: 2 !important;
            }

            .projection .nv-line {
                stroke-dasharray: 3, 3;
            }

            .projection .nv-point {
                fill: #fff;
                stroke-width: 1;
                opacity: 0.5;
            }

            .projection .nv-point.hover {
                stroke-width: 4;
            }

            a {
                cursor: pointer;
                color: #0645ad;
                fill: #0645ad;
                border-bottom: none;
            }

            h2 {
                font-size: 2em;
                margin-top: 0;
                margin-bottom: 0.8em;
                font-weight: 500;
                line-height: 1.1;
            }

            .unstroked {
                display: none;
            }

            .DownloadTab,
            .tableTab,
            .sourcesTab {
                z-index: $zindex-tab;
            }
        }


        `;
        return inlineCss;
    }
}

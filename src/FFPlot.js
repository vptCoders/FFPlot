let FFPlot = (function() {
	"use strict";
	let AUTO = true,
		DEFAULT_OPTIONS = {
			chartArea: {
				borderColor: "rgb(217,217,217)",
				fillColor: "rgb(255,255,255)",
				height: AUTO,
				paddingBottom: 50,
				paddingLeft: 20,
				paddingRight: 20,
				paddingTop: 50,
				width: AUTO,
			},
			chartTitle: {
				title: "Chart Title",
				fillColor: "rgba(255,255,255,0)",
				fontFamily: "Calibri",
				fontSize: "14px",
				fontColor: "rgb(89,89,89)",
				height: AUTO,
				horizontalAlignment: "center",
				marginLeft: AUTO,
				marginRight: AUTO,
				marginTop: 20,
				position: {
					x: AUTO,
					y: AUTO,
				},
				width: "100%",
			},
			plot: {
				type: "scatter",
				options: {
					
				},
			},
			plotArea: {
				borderColor: "rgba(217,217,217,0)",
				fillColor: "rgba(255,255,255,0)",
			},
			xAxis: {
				lineColor: "rgba(0,0,0,1)",
				lineThickness: 1,
				maxValue: AUTO,
				minValue: AUTO,
			},
			yAxis: {
				lineColor: "rgba(0,0,0,1)",
				lineThickness: 1,
				maxValue: AUTO,
				minValue: AUTO,
			},
		},
		ERROR_MSG_EN = {
			em1001: "No HTML element was specified as a container for the plot.",
			em1002: "The container specified is not valid.",
			em1003: "No styling was specified.",
			em1004: "The styling specified is not valid.",
		},
		ERROR_MSG = ERROR_MSG_EN;

	function existsInDOM(element) {
		return document.body.contains(element);
	}

	function FFPlot(container, dataObj, optionsObj) {
		let CANVAS = null;
		let CHART_TITLE = new FFLabel();
		let DATA = null;
		let IS_PLOTTING = false;
		let PLOT = new FFScatterPlot();
		let USER_OPTIONS = [];
		let XAXIS = new FFXAxis();
		let YAXIS = new FFYAxis();

		function getAxisStyling() {
			let STYLE = {};
			STYLE.marginBottom = (USER_OPTIONS && USER_OPTIONS.marginBottom) ? USER_OPTIONS.marginBottom : DEFAULT_OPTIONS.marginBottom;
			STYLE.marginLeft = (USER_OPTIONS && USER_OPTIONS.marginLeft) ? USER_OPTIONS.marginLeft : DEFAULT_OPTIONS.marginLeft;
			STYLE.marginRight = (USER_OPTIONS && USER_OPTIONS.marginRight) ? USER_OPTIONS.marginRight : DEFAULT_OPTIONS.marginRight;
			STYLE.marginTop = (USER_OPTIONS && USER_OPTIONS.marginTop) ? USER_OPTIONS.marginTop : DEFAULT_OPTIONS.marginTop;

			return STYLE;
		}

		function getXAxisStyling() {
			let STYLE = getAxisStyling();
			STYLE.lineColor = (USER_OPTIONS && USER_OPTIONS.xAxisLineColor) ? USER_OPTIONS.xAxisLineColor : DEFAULT_OPTIONS.xAxisLineColor;
			STYLE.lineThickness = (USER_OPTIONS && USER_OPTIONS.xAxisLineThickness) ? USER_OPTIONS.xAxisLineThickness : DEFAULT_OPTIONS.xAxisLineThickness;

			return STYLE;
		}

		function getYAxisStyling() {
			let STYLE = getAxisStyling();
			STYLE.lineColor = (USER_OPTIONS && USER_OPTIONS.yAxisLineColor) ? USER_OPTIONS.yAxisLineColor : DEFAULT_OPTIONS.yAxisLineColor;
			STYLE.lineThickness = (USER_OPTIONS && USER_OPTIONS.yAxisLineThickness) ? USER_OPTIONS.yAxisLineThickness : DEFAULT_OPTIONS.yAxisLineThickness;

			return STYLE;
		}

		function getChartAreaStyling() {
			let STYLE = {};
			STYLE.borderColor = DEFAULT_OPTIONS.chartArea.borderColor;
			STYLE.fillColor = DEFAULT_OPTIONS.chartArea.fillColor;

			let numberOfUserOptions = USER_OPTIONS.length;
			for(let _curUserOption = 0; _curUserOption < numberOfUserOptions; _curUserOption++) {
				if("chartArea" in USER_OPTIONS[_curUserOption]) {
					if("borderColor" in USER_OPTIONS[_curUserOption].chartArea) {
						STYLE.borderColor = USER_OPTIONS[_curUserOption].chartArea.borderColor;
					}

					if("fillColor" in USER_OPTIONS[_curUserOption].chartArea) {
						STYLE.fillColor = USER_OPTIONS[_curUserOption].chartArea.fillColor;
					}
				}
			}

			return STYLE;
		}

		function resetChart() {
			let ctx = CANVAS.getContext("2d");
			let STYLE = getChartAreaStyling();
			ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
			ctx.fillStyle = STYLE.fillColor;
			ctx.strokeStyle = STYLE.borderColor;
			ctx.rect(0, 0, CANVAS.width, CANVAS.height);
			ctx.fill();
			ctx.stroke();
		}

		function FFPlot(container, dataObj, optionsObj) {
			if(container) this.setContainer(container);
			if(dataObj) DATA = dataObj;
			if(optionsObj) this.setOptions(optionsObj);
		}
		/***********************************************************************************************
		/*	The next line makes sure that:
		/*		let obj1 = new FFPlot();
		/*		obj1 instanceof FFPlot;
		/*	returns true.
		/***********************************************************************************************/
		FFPlot.prototype = Object.create(this.constructor.prototype);
		FFPlot.prototype.constructor = FFPlot;


		FFPlot.prototype.plot = function(dataObj, optionsObj) {
			if(optionsObj) this.setOptions(optionsObj);
			if(dataObj) DATA = dataObj;
			if(DATA) {
				resetChart();
				XAXIS.plot(CANVAS, getXAxisStyling());
				YAXIS.plot(CANVAS, getYAxisStyling());
				CHART_TITLE.plot(CANVAS);
				PLOT.plot(CANVAS, DATA);
				IS_PLOTTING = true;
			}
		}


		FFPlot.prototype.setContainer = function(container) {
			if(!container) throw new Error(ERROR_MSG.em1001);
			if(!existsInDOM(container)) throw new Error(ERROR_MSG.em1002);

			if(container.tagName && container.tagName.toLowerCase() === "canvas") {
				CANVAS = container;
			} else {
				try {
					CANVAS = document.createElement("canvas");
					container.appendChild(CANVAS);
				} catch(err) {
					throw new Error(ERROR_MSG.em1002);
				}
			}

			let CANVAS_BCR = CANVAS.getBoundingClientRect();
			CANVAS.width = CANVAS_BCR.width;
			CANVAS.height = CANVAS_BCR.height;
		};


		FFPlot.prototype.setOptions = function(optionsObj) {
			if(!optionsObj) throw new Error(ERROR_MSG.em1003);

			if(optionsObj.constructor === Object) {
				USER_OPTIONS.push(optionsObj);
			} else {
				throw new Error(ERROR_MSG.em1004);
			}

			if(IS_PLOTTING) this.plot();
		};


		FFPlot.prototype.clearOptions = function() {
			USER_OPTIONS = [];
			if(IS_PLOTTING) this.plot();
		}

		/***********************************************************************************************
		/*	The next line makes sure that children of FFPlot can actually use its prototype's methods.
		/***********************************************************************************************/
		this.constructor.prototype = FFPlot.prototype;
		return new FFPlot(container, dataObj, optionsObj);
	}

	return FFPlot;
})();













let FFScatterPlot = (function() {
	"use strict";
	let DEFAULT_OPTIONS = {
			width: 500,
			height: 400,

			marginBottom: 50,
			marginLeft: 20,
			marginRight: 20,
			marginTop: 50,

			markerColor: "rgb(100, 100, 220)",
			markerType: 1,
			markerSize: 2,
		},
		ERROR_MSG_EN = {
			em1003: "No data was specified.",
			em1004: "The data specified is not valid.",
			em1005: "No x series values/function specified.",
			em1006: "The x series values are not valid.",
			em1007: "No y series values/function specified.",
			em1008: "The y series values are not valid.",
			em1009: "The x and y series values have different lengths.",
		},
		ERROR_MSG = ERROR_MSG_EN;

	function FFScatterPlot() {
		let DATA = null;
		let STAGE_WIDTH = 0;
		let STAGE_HEIGHT = 0;
		let USER_OPTIONS = null;

		function FFScatterPlot() {
		}
		FFScatterPlot.prototype = Object.create(this.constructor.prototype);
		FFScatterPlot.prototype.constructor = FFScatterPlot;

		FFScatterPlot.prototype.plot = function(stage, dataObj, optionsObj) {
			if(dataObj) this.setData(dataObj);

			if(stage) {
				let ctx = stage.getContext("2d");
				if(ctx instanceof CanvasRenderingContext2D) {
					// if(stylingObj) this.setStyling(stylingObj);
					STAGE_WIDTH = stage.width;
					STAGE_HEIGHT = stage.height;
					let STYLE = USER_OPTIONS ? USER_OPTIONS : DEFAULT_OPTIONS;

					let numberOfPoints = DATA.x.length;
					for(let _curPoint = 0; _curPoint < numberOfPoints; _curPoint++) {
						ctx.beginPath();
						ctx.arc(STYLE.marginLeft + DATA.x[_curPoint], STAGE_HEIGHT - STYLE.marginBottom - DATA.y[_curPoint], 2, 0, 2 * Math.PI);
						ctx.fillStyle = STYLE.markerColor;
						ctx.fill();
					}
				} else {
					throw new Error(ERROR_MSG.em02);
				}
			} else {
				throw new Error(ERROR_MSG.em01);
			}
		}

		FFScatterPlot.prototype.setData = function(dataObj) {
			if(dataObj) {
				if(dataObj.constructor === Object) {
					if("x" in dataObj) {
						if(dataObj.x.constructor === Array) {
							if("y" in dataObj) {
								if(dataObj.y.constructor === Array) {
									if(dataObj.x.length === dataObj.y.length) {
										DATA = dataObj;
									} else {
										throw new Error(ERROR_MSG.em1009);
									}
								} else {
									throw new Error(ERROR_MSG.em1008);
								}
							} else {
								throw new Error(ERROR_MSG.em1007);
							}
						} else {
							throw new Error(ERROR_MSG.em1006);
						}
					} else {
						throw new Error(ERROR_MSG.em1005);
					}
				} else {
					throw new Error(ERROR_MSG.em1004);
				}
			} else {
				throw new Error(ERROR_MSG.em1003);
			}
		};


		this.constructor.prototype = FFScatterPlot.prototype;
		return new FFScatterPlot();
	}

	return FFScatterPlot;
})();
























let FFText = (function() {
	"use strict";

	let AUTO = true,
		DEFAULT_OPTIONS = {
			color: "rgb(89,89,89)",
			fontFamily: "Calibri",
			fontSize: "14px",
			fontStretch: "normal",
			fontWeight: "normal",
			height: "100%",
			horizontalAlignment: "center",
			italic: false,
			lineHeight: 1,
			position: {
				x: AUTO,
				y: AUTO,
			},
			smallCaps: false,
			title: "Chart Title",
			width: "100%",
		},
		ERROR_MSG_EN = {
			em01: "No canvas element was specified.",
			em02: "The canvas element specified is not valid.",
		},
		ERROR_MSG = ERROR_MSG_EN;



	function FFText(optionsObj) {
		let STAGE_WIDTH = 0;
		let STAGE_HEIGHT = 0;
		let USER_OPTIONS = null;

		function getFont(style) {
			let FONT_STR = "";
			FONT_STR += (style.italic) ? "italic " : "normal ";
			FONT_STR += (style.smallCaps) ? "small-caps" : "normal ";
			FONT_STR += style.fontWeight + " ";
			FONT_STR += style.fontStretch + " ";
			FONT_STR += style.fontSize + "/";
			FONT_STR += style.lineHeight + " ";
			FONT_STR += style.fontFamily;

			return FONT_STR;
		}

		function getLeftOffset(ctx, style) {
			// let STYLE = getStyling();
			switch(style.horizontalAlignment) {
				case "center":

					break;
			}
		}

		function getStyling() {
			let STYLE = DEFAULT_OPTIONS;
			return STYLE;
		}

		function FFText(optionsObj) {
			if(optionsObj) this.setStyling(optionsObj);
		}
		FFText.prototype = Object.create(this.constructor.prototype);
		FFText.prototype.constructor = FFText;

		FFText.prototype.plot = function(stage, optionsObj) {
			if(!stage) throw new Error(ERROR_MSG.em01);
			
			let ctx = stage.getContext("2d");
			if(!(ctx instanceof CanvasRenderingContext2D)) throw new Error(ERROR_MSG.em02);

			STAGE_WIDTH = stage.width;
			STAGE_HEIGHT = stage.height;
			let STYLE = getStyling();
			ctx.font = getFont(STYLE);

			let textMetrics = ctx.measureText(STYLE.title);
			ctx.fillText(STYLE.title, 0, 50);
		}



		this.constructor.prototype = FFText.prototype;
		return new FFText(optionsObj);
	}

	return FFText;
})();




























let FFLabel = (function() {
	"use strict";

	let AUTO = 0,
		DEFAULT_OPTIONS = {
			fillColor: "rgba(255,255,255,0)",
			borderColor: "rgba(217,217,217,1)",
			height: AUTO,
			horizontalAlignment: "center",
			marginLeft: AUTO,
			marginRight: AUTO,
			marginTop: AUTO + 0.5,
			position: {
				x: AUTO,
				y: AUTO,
			},
			referencePoint: 5,
			title: "Label",
			width: "80%",
		},
		ERROR_MSG_EN = {
			em01: "No canvas element was specified.",
			em02: "The canvas element specified is not valid.",
			em03: "No options were specified.",
			em04: "The options specified are not valid.",
			em05: "The value is not valid.",
		},
		ERROR_MSG = ERROR_MSG_EN;



	function FFLabel(optionsObj) {
		let USER_OPTIONS = [];

		function parseNumericValue(value, percentageOfValue) {
			let returnValue = value;
			if(!(value.constructor === Number)) {
				if(value.constructor === String) {
					let valuePercentageStr = value.match(/\d+%/g);
					let valuePxStr = value.match(/\d+px/g);
					if(valuePercentageStr) {
						if(valuePercentageStr.length === 1) {
							returnValue = ((parseInt(valuePercentageStr[0].match(/\d+/g)))/100)*percentageOfValue;
						}
					} else if(valuePxStr){
						if(valuePxStr.length === 1) {
							returnValue = parseInt(valuePxStr[0].match(/\d+/g));
						}
					} else {
						throw new Error(ERROR_MSG.em05);
					}
				} else {
					throw new Error(ERROR_MSG.em05);
				}
			}

			return returnValue;
		}


		function getStyling(stage) {
			let STAGE_WIDTH = stage.width;
			let STAGE_HEIGHT = stage.height;
			let STYLE = DEFAULT_OPTIONS;


			STYLE.height = parseNumericValue(STYLE.height, STAGE_HEIGHT);
			STYLE.position.x = parseNumericValue(STYLE.position.x, STAGE_WIDTH);
			STYLE.position.y = parseNumericValue(STYLE.position.y, STAGE_HEIGHT);
			STYLE.marginLeft = parseNumericValue(STYLE.marginLeft, STAGE_WIDTH);
			STYLE.marginRight = parseNumericValue(STYLE.marginRight, STAGE_WIDTH);
			STYLE.marginTop = parseNumericValue(STYLE.marginTop, STAGE_HEIGHT);
			STYLE.width = parseNumericValue(STYLE.width, STAGE_WIDTH);



			switch(STYLE.horizontalAlignment) {
				case "center":
					STYLE.marginLeft = (STAGE_WIDTH - STYLE.width)/2;
					break;
				case "right":
					STYLE.marginLeft = STAGE_WIDTH - STYLE.width - STYLE.marginRight;
					break;
				default: 
					break;
			}


			return STYLE;
		}

		function FFLabel(optionsObj) {
			if(optionsObj) this.setStyling(optionsObj);
		}
		FFLabel.prototype = Object.create(this.constructor.prototype);
		FFLabel.prototype.constructor = FFLabel;

		FFLabel.prototype.plot = function(stage, optionsObj) {
			if(!stage) throw new Error(ERROR_MSG.em01);
			
			let ctx = stage.getContext("2d");
			if(!(ctx instanceof CanvasRenderingContext2D)) throw new Error(ERROR_MSG.em02);

			let STYLE = getStyling(stage);
			ctx.fillStyle = STYLE.fillColor;
			ctx.strokeStyle = STYLE.borderColor;
			ctx.beginPath();
			ctx.rect(STYLE.position.x + STYLE.marginLeft, STYLE.position.y + STYLE.marginTop, STYLE.width, 100);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}

		FFLabel.prototype.setOptions = function(optionsObj) {
			if(!optionsObj) throw new Error(ERROR_MSG.em03);

			if(optionsObj.constructor === Object) {
				USER_OPTIONS.push(optionsObj);
			} else {
				throw new Error(ERROR_MSG.em04);
			}
		};


		this.constructor.prototype = FFLabel.prototype;
		return new FFLabel(optionsObj);
	}

	return FFLabel;
})();




























let FFAxis = (function() {
	"use strict";

	let DEFAULT_OPTIONS = {
			lineColor: "rgb(0,0,0)",
			lineThickness: 1,
			marginBottom: 50,
			marginLeft: 30,
			marginRight: 30,
			marginTop: 50,
		},
		ERROR_MSG_EN = {
			em01: "No canvas element was specified.",
			em02: "The canvas element specified is not valid.",
			em03: "No styling was specified.",
			em04: "The styling specified is not valid.",
		},
		ERROR_MSG = ERROR_MSG_EN;



	function FFAxis(stylingObj) {
		let STAGE_WIDTH = 0;
		let STAGE_HEIGHT = 0;
		let USER_OPTIONS = null;

		function FFAxis(stylingObj) {
			if(stylingObj) this.setStyling(stylingObj);
		}
		FFAxis.prototype = Object.create(this.constructor.prototype);
		FFAxis.prototype.constructor = FFAxis;

		FFAxis.prototype.draw = function(stage, drawCallback, stylingObj) {
			if(stage) {
				let ctx = stage.getContext("2d");
				if(ctx instanceof CanvasRenderingContext2D) {
					if(stylingObj) this.setStyling(stylingObj);
					STAGE_WIDTH = stage.width;
					STAGE_HEIGHT = stage.height;
					let STYLE = USER_OPTIONS ? USER_OPTIONS : DEFAULT_OPTIONS;
					drawCallback(ctx, STAGE_WIDTH, STAGE_HEIGHT, STYLE);
				} else {
					throw new Error(ERROR_MSG.em02);
				}
			} else {
				throw new Error(ERROR_MSG.em01);
			}
		}

		FFAxis.prototype.setStyling = function(stylingObj) {
			if(stylingObj) {
				if(stylingObj.constructor === Object) {
					USER_OPTIONS = {};
					USER_OPTIONS.lineColor = (stylingObj.lineColor) ? stylingObj.lineColor : DEFAULT_OPTIONS.lineColor;
					USER_OPTIONS.lineThickness = (stylingObj.lineThickness) ? stylingObj.lineThickness : DEFAULT_OPTIONS.lineThickness;
					USER_OPTIONS.marginBottom = (stylingObj.marginBottom || Number.isInteger(stylingObj.marginBottom)) ? stylingObj.marginBottom : DEFAULT_OPTIONS.marginBottom;
					USER_OPTIONS.marginLeft = (stylingObj.marginLeft || Number.isInteger(stylingObj.marginLeft)) ? stylingObj.marginLeft : DEFAULT_OPTIONS.marginLeft;
					USER_OPTIONS.marginRight = (stylingObj.marginRight || Number.isInteger(stylingObj.marginRight)) ? stylingObj.marginRight : DEFAULT_OPTIONS.marginRight;
					USER_OPTIONS.marginTop = (stylingObj.marginTop || Number.isInteger(stylingObj.marginTop)) ? stylingObj.marginTop : DEFAULT_OPTIONS.marginTop;
				} else {
					throw new Error(ERROR_MSG.em04);
				}
			} else {
				throw new Error(ERROR_MSG.em03);
			}
		}


		this.constructor.prototype = FFAxis.prototype;
		return new FFAxis(stylingObj);
	}

	return FFAxis;
})();













let FFXAxis = (function() {
	"use strict";

	function FFXAxis(stylingObj) {
		function drawAxis(ctx, STAGE_WIDTH, STAGE_HEIGHT, STYLE) {
			ctx.fillStyle = STYLE.lineColor;
			ctx.fillRect(STYLE.marginLeft, STAGE_HEIGHT - STYLE.marginBottom - STYLE.lineThickness, STAGE_WIDTH - STYLE.marginLeft - STYLE.marginRight, STYLE.lineThickness);
		}

		function FFXAxis(stylingObj) {
		}
		FFXAxis.prototype = new FFAxis(stylingObj);
		FFXAxis.prototype.constructor = FFXAxis;

		FFXAxis.prototype.plot = function(stage, stylingObj) {
			this.draw(stage, drawAxis, stylingObj);
		}


		this.constructor.prototype = FFXAxis.prototype;
		return new FFXAxis(stylingObj);
	}

	return FFXAxis;
})();















let FFYAxis = (function() {
	"use strict";

	function FFYAxis(stylingObj) {
		function drawAxis(ctx, STAGE_WIDTH, STAGE_HEIGHT, STYLE) {
			ctx.fillStyle = STYLE.lineColor;
			ctx.fillRect(STYLE.marginLeft, STYLE.marginTop, STYLE.lineThickness, STAGE_HEIGHT - STYLE.marginTop - STYLE.marginBottom);
		}

		function FFYAxis(stylingObj) {
		}
		FFYAxis.prototype = new FFAxis(stylingObj);
		FFYAxis.prototype.constructor = FFYAxis;

		FFYAxis.prototype.plot = function(stage, stylingObj) {
			this.draw(stage, drawAxis, stylingObj);
		}


		this.constructor.prototype = FFYAxis.prototype;
		return new FFYAxis(stylingObj);
	}

	return FFYAxis;
})();
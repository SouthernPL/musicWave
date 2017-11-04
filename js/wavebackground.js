//这是绘制静态图案的绘制代码，通过不间断地调用，并且传入随音乐变化的参数而绘制动画

function RadarChart(svg, data, options) {
	
	// 默认的参数模板
	var cfg = {
	 w: 600,				
	 h: 600,				
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, 
	 levels: 3,				
	 maxValue: 0, 			
	 labelFactor: 1.25, 	
	 wrapWidth: 60, 		
	 opacityArea: 0.55, 	
	 dotRadius: 4, 			
	 opacityCircles: 0.1, 	
	 strokeWidth: 2, 		
	 roundStrokes: false,	
	 color: d3.scale.category10()	
	};
	
	// 检测到有参数option传入并覆盖到参数模板
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}
	
	
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	
	var radius = Math.min(cfg.w/2, cfg.h/2);
	    angleSlice = Math.PI * 2 / data[0].length;

	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);

	var maxR=rScale(d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

	var cScale = d3.scale.linear()
		.range([0.1, 0.65])
		.domain([0, maxValue]);
	
	var maxC=cScale(d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

	// 先擦除，再绘制
	svg.select(".background").remove();
	
	// 加入绘制律动动画的对象
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")")
			.attr("class","background");
	
	
	// 绘制舞台背景
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	// 绘制环状背景
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return maxR/cfg.levels*d;})
		.style("fill", "#0A4CAC")
		.style("stroke", "#0A4CAC")
		.style("fill-opacity", maxC)	

	// 配置路径生成器
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value)*0.8; })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	// 获取绘制中心波浪线的对象	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
	 // console.log(blobWrapper);
			
	// 绘制五角星主体	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		
		
	// 描绘五角星轮廓线	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")

	//彩蛋特效绘制
	function drawStar(width,height,margin){
			svg.select(".starArea").remove();	
		
			var starArea = svg.append("g")
					.attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
					.attr("class","starArea")	
					


			var starData=data;
		    var starWrapper = starArea.selectAll(".starWrapper")
				.data(starData)
				.enter().append("g")
				.attr("class", "starWrapper")


		    // 绽放画布配置
			starWrapper	
				.attr("transform","scale(0.4, 0.4)")
				.transition()
				.duration(2000)
				.attr("transform","scale(0.55, 0.55)")
				.style("opacity",0)
		
		      // console.log(starWrapper);
		      // 
		    var starXScale = d3.scale.linear()
				.range([cfg.w*0.7, cfg.w/2+cfg.margin.left/2])
				.domain([0, 1]);

			var starYScale = d3.scale.linear()
				.range([cfg.h*0.7, cfg.h/2+cfg.margin.top/2])
				.domain([0, 1]);


			starWrapper
				.append("path")
				.attr("class", "starArea")
				// .attr("transform","scale(0.1, 0.1)")
				.attr("transform",function(d){
					var mark1=Math.random()>0.5? 1 : -1 ;
					var mark2=Math.random()>0.5? 1 : -1 ;
					return "translate("+starXScale(Math.random())*mark1+","+starYScale(Math.random())*mark2+")"
				})
				.attr("d", function(d,i) { return radarLine(d); })
				.style("fill", function(d,i) { return cfg.colorStar(i); })
				.style("fill-opacity", cfg.opacityArea)
		        .style("stroke-width", cfg.strokeWidth + "px")
			    .style("stroke", function(d,i) { return cfg.color(i); })


	}


			

	// 特效判定条件 
	var boolStar=false;

	 if(d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))})>0.25){

	 	boolStar=true;

	 }else{
	 	boolStar=false;
	 }
	
	

	// 返回参数
	return {
		drawStar:drawStar,
		boolStar:boolStar
	};
	
}
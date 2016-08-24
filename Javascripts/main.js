 window.onload = function (){
        
        
        // when user clicks the about button, show the text
        $("#about").on("click", function(){
            $("#about").hide();
            $("#about-inset").css('visibility', 'visible');
            $("#about-text").css('visibility', 'visible');
        });
        
        // when user clicks on about inset, show just the about button
        $("#about-inset").on("click", function(){
            $("#about-inset").css('visibility', 'hidden');
            $("#about-text").css('visibility', 'hidden');
            $("#about").show();
        });
        
        // place the names of your PostGIS tables in a variable
        var crashTable = "transalt_crash_data";
        var comdistTable = "ccds_all_data";
        
        // create the heatmap
        var torqueSource = {
                type: 'torque',
                options: {
                  user_name: 'transaltsummer2016',
                  table_name: crashTable,
                  cartocss: $("#torque").text()
                }
              }
        
        // create the other choropleth layers in an array
        var layerSource = {
            user_name: 'transaltsummer2016',
            type: 'cartodb',
            sublayers: [{
                sql: "SELECT * FROM " + comdistTable,
                cartocss: "",
                interactivity: "cartodb_id"
            }]  
        }
        
        // set the initial lat / long and zoom level
        var locationOptions = {
            center: [40.738850, -73.889837],
            zoom: 12,
            minZoom: 10
        };
        
        // instantiate map on the 'map' div element
        var map = new L.map('map', locationOptions);
        
        // add a basemap to the 'map' element that was just instantiated
        L.tileLayer('https://a.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token={token}', {
            attribution: 'Mapbox',
            subdomains: ['a','b','c','d'],
            token: 'pk.eyJ1IjoicHppZWdsZXIiLCJhIjoiY2ltMHo3OGRxMDh0MXR5a3JrdHNqaGQ0bSJ9.KAFBMeyysBLz4Ty-ltXVQQ'
        }).addTo(map);
        
        // legends for each layer
        
        // crashes per square mile
        var areaLegend = new cdb.geo.ui.Legend({
            type: "custom",
            show_title: false,
            title: "",
            template: $('#area_legend').html(),
            visible: true
            });
        
        var areaStacked = new cdb.geo.ui.StackedLegend({
           legends: [areaLegend]
         });
        
        // population density
        var densityLegend = new cdb.geo.ui.Legend({
            type: "custom",
            show_title: false,
            title: "",
            template: $('#density_legend').html(),
            visible: true
            });
        
        var densityStacked = new cdb.geo.ui.StackedLegend({
           legends: [densityLegend]
         });
        
        // poverty rate
        var povertyLegend = new cdb.geo.ui.Legend({
            type: "custom",
            show_title: false,
            title: "",
            template: $('#poverty_legend').html(),
            visible: true
            });
        
        var povertyStacked = new cdb.geo.ui.StackedLegend({
           legends: [povertyLegend]
         });
        
        // unemployment rate
        var unemployLegend = new cdb.geo.ui.Legend({
            type: "custom",
            show_title: false,
            title: "",
            template: $('#unemployment_legend').html(),
            visible: true
            });
        
        var unemployStacked = new cdb.geo.ui.StackedLegend({
           legends: [unemployLegend]
         });
        
        // create the layers and wire them to click events
        
        cartodb.createLayer(map, layerSource, {legends: true, https: true})
        .addTo(map)
        .done(function(layer){
            
            var sublayer = layer.getSubLayer(0);
            
            // function to control CartoCSS from dropdown
            var LayerActions = {
				intensity: function(){
                    areaStacked.hide()
                    densityStacked.hide()
                    povertyStacked.hide()
                    unemployStacked.hide()
                    $("#circle-max").css('visibility', 'hidden');
                    $("#circle-min").css('visibility', 'hidden');
                    $(".circle-text").css('visibility', 'hidden');
				    sublayer.hide();
						},
				area: function(){
                    densityStacked.hide()
                    povertyStacked.hide()
                    unemployStacked.hide()
                    $("#circle-max").css('visibility', 'hidden');
                    $("#circle-min").css('visibility', 'hidden');
                    $(".circle-text").css('visibility', 'hidden');
                    $('#map').append(areaStacked.render().el);
                    sublayer.show();
				    sublayer.setCartoCSS($("#choropleth-area").text());
							return true;
						},
                popdensity: function(){
                    areaStacked.hide()
                    povertyStacked.hide()
                    unemployStacked.hide()
                    $("#circle-max").css('visibility', 'hidden');
                    $("#circle-min").css('visibility', 'hidden');
                    $(".circle-text").css('visibility', 'hidden');
                    $('#map').append(densityStacked.render().el);
                    sublayer.show();
				    sublayer.setCartoCSS($("#choropleth-density").text());
							return true;
						},
				medincome: function(){
                    areaStacked.hide()
                    densityStacked.hide()
                    povertyStacked.hide()
                    unemployStacked.hide()
                    $("#circle-max").css('visibility', 'visible');
                    $("#circle-min").css('visibility', 'visible');
                    $(".circle-text").css('visibility', 'visible');
                    sublayer.show();
				    sublayer.setCartoCSS($("#choropleth-bubble").text());
							return true;
						},
                povrate: function(){
                    unemployStacked.hide()
                    areaStacked.hide()
                    densityStacked.hide()
                    $("#circle-max").css('visibility', 'hidden');
                    $("#circle-min").css('visibility', 'hidden');
                    $(".circle-text").css('visibility', 'hidden');
                    $('#map').append(povertyStacked.render().el);
                    sublayer.show();
				    sublayer.setCartoCSS($("#choropleth-povrate").text());
							return true;
						},
                unemprate: function(){
                    areaStacked.hide()
                    densityStacked.hide()
                    povertyStacked.hide()
                    $("#circle-max").css('visibility', 'hidden');
                    $("#circle-min").css('visibility', 'hidden');
                    $(".circle-text").css('visibility', 'hidden');
                    $('#map').append(unemployStacked.render().el);
                    sublayer.show();
				    sublayer.setCartoCSS($("#choropleth-unemployment").text());
							return true;
						}
					};
              
              $('#layer_selector').change(function() {
					 LayerActions[$(this).val()]();
				});
        });
        
        // show the heat map on load
        cartodb.createLayer(map, torqueSource, {legends: true})
            .addTo(map)
            .done(function(layer){
            
            // store the heat map layer in a variable
            var heatMap = layer;
            
            // function to control CartoCSS from dropdown
            var LayerActions = {
				intensity: function(){
				    map.addLayer(heatMap);
						},
				area: function(){
				    map.removeLayer(heatMap);
						},
                popdensity: function(){
				    map.removeLayer(heatMap);
						},
				medincome: function(){
				    map.removeLayer(heatMap);
						},
                povrate: function(){
				    map.removeLayer(heatMap);
						},
                unemprate: function(){
				    map.removeLayer(heatMap);
						}
					};
              
              $('#layer_selector').change(function() {
					 LayerActions[$(this).val()]();
				});
        })
        
        // wire the borough buttons to zoom events
        var ZoomActions = {
            reset: function(){
                map.setView([40.738850, -73.889837], 12);
                },
            bronx: function(){
                var bronxXY = [40.836653, -73.922238];    
                map.setView(bronxXY, 13);
                },
            brooklyn: function(){
                var brooklynXY = [40.680862, -73.965410];    
                map.setView(brooklynXY, 13);
                },
            manhattan: function(){
                var manhattanXY = [40.740671, -73.988929];   
                map.setView(manhattanXY, 13);
                },
            queens: function(){
                var queensXY = [40.754, -73.898635];    
                map.setView(queensXY, 13);
                },
            statenisland: function(){
                var statenislandXY = [40.607092, -74.107118];    
                map.setView(statenislandXY, 13);
                }
            };
        
            $('#zoom_selector').change(function(){
                ZoomActions[$(this).val()]();
            });
        
        // create the GeoJSON layer and tooltips
        
        // original GeoJSON style
        function style(feature) {
			return {
				weight: 0.5,
				opacity: 1,
				color: 'white',
				fillOpacity: 0,
				fillColor: 'white'
			};
		}
        
        // function to highlight GeoJSON features
        function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 2,
				color: '#fff',
				fillOpacity: 0.5
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}
		}

		var geojson;

        // function to reset style of GeoJSON features
		function resetHighlight(e) {
			geojson.resetStyle(e.target);
		}
        
        // function to zoom features when clicked
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }
        
        
        // function bringing all of the listeners together
        function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
                click: zoomToFeature
			});
		  }
        
        geojson = L.geoJson(ccds, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);
        
        geojson.eachLayer(function (layer) {
            layer.bindLabel('<u>City Council District</u><p>' + '<u>' + layer.feature.properties.coun_dist + '</u></p><br> Crashes per Sq. Mi. <p>' + layer.feature.properties.crash_area.toFixed(1) + '</p>' + '<br> Population Density <p>' + layer.feature.properties.pop_density.toLocaleString('en', {minimumFractionDigits: 0,maximumFractionDigits: 0}) + '</p>' + '<br> Poverty Rate (%) <p>' + layer.feature.properties.pov_rate.toFixed(1) + '</p><br> Median Income ($) <p>' + layer.feature.properties.med_income.toLocaleString('en') + '</p>' + '<br> Unemployment Rate (%) <p>' + layer.feature.properties.unemp_rate.toFixed(1) + '</p>');
        });
       
    // bring in the d3 interactive elements!
        
    // create a global variable for your data
      var data = ccds;
          
    // set the width, height, and margins of your svg
      var margin = {top: 35, right: 35, bottom: 35, left: 35},
      w = 300 - margin.left - margin.right,
      h = 225 - margin.top - margin.bottom;
      
    // load the data
      var dataset = data.features;

      var xScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d){
                        return d.properties.pop_density;
                    })])
                    .range([0, w]);

      var yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d){
                        return d.properties.crash_area;
                    })])
                    .range([h, 0]);

      // create the scatterplot svg
      var svg = d3.select("#d3-elements")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 225")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // make a scatterplot
      svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d){
          return xScale(d.properties.pop_density);
      })
        .attr("cy", function(d){
          return yScale(d.properties.crash_area);
      })
        .attr("r", function(d){
          return 4;
      })
        .attr("fill", "#1DFF84")
        .attr("opacity", 0.5);

      // create axes
      var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

      var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

      // append the x axis to the svg
      svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

      // append a label to the x axis
      svg.append("text")
            .attr("id", "xlabel")
            .text("Population Density")
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
            .attr("font-size", "10px")
            .attr("x", w/2)
            .attr("y", h + margin.bottom - 5);

      // append the y axis to the svg
      svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

      // append a label to the y axis
      svg.append("text")
            .text("Crashes per Sq. Mi.")
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
            .attr("font-size", "10px")
            .attr("x", -80)
            .attr("y", -10)
            .attr("transform", "rotate(-90)");

      // append a title
      svg.append("text")
        .attr("id", "sctitle")
        .attr("x", (w / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .attr("font-size", "12px")
        .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
        .attr("fill", "white")
        .text("Relating Population Density and Crash Density");

      // create a function to update the data on layer change

      var D3Actions = {

        intensity: function(){

        // update x scale
        var xScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d){
                return d.properties.pop_density;
            })])
            .range([0, w]);

        // update the circles
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1500)
            .attr("cx", function(d){
                return xScale(d.properties.pop_density);
            })
            .attr("cy", function(d){
                return yScale(d.properties.crash_area);
            })
            .attr("r", function(d){
                return 4;
            })
            .attr("fill", "#1DFF84")
            .attr("opacity", 0.5);

        // update x axis variable
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

        // update the x axis svg
        svg.select(".x.axis")
            .transition()
            .duration(1500)
            .call(xAxis);

        // update the x axis label
        svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Population Density");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Population Density and Crash Density");

        return true;
      },
        area: function(){

        // update x scale
        var xScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d){
                return d.properties.pop_density;
            })])
            .range([0, w]);

        // update the circles
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1500)
            .attr("cx", function(d){
                return xScale(d.properties.pop_density);
            })
            .attr("cy", function(d){
                return yScale(d.properties.crash_area);
            })
            .attr("r", function(d){
                return 4;
            })
            .attr("fill", "#1DFF84")
            .attr("opacity", 0.5);

        // update x axis variable
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

        // update the x axis svg
        svg.select(".x.axis")
            .transition()
            .duration(1500)
            .call(xAxis);

        // update the x axis label
        svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Population Density");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Population Density and Crash Density");

        return true;
      },
        popdensity: function(){

        // update x scale
        var xScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d){
                return d.properties.pop_density;
            })])
            .range([0, w]);

        // update the circles
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1500)
            .attr("cx", function(d){
                return xScale(d.properties.pop_density);
            })
            .attr("cy", function(d){
                return yScale(d.properties.crash_area);
            })
            .attr("r", function(d){
                return 4;
            })
            .attr("fill", "#1DFF84")
            .attr("opacity", 0.5);

        // update x axis variable
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

        // update the x axis svg
        svg.select(".x.axis")
            .transition()
            .duration(1500)
            .call(xAxis);

        // update the x axis label
        svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Population Density");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Population Density and Crash Density");

        return true;
      },
    medincome: function(){

        // update x scale
        var xScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d){
                return d.properties.med_income;
            })])
            .range([0, w]);

        // update the circles
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1500)
            .attr("cx", function(d){
                return xScale(d.properties.med_income);
            })
            .attr("cy", function(d){
                return yScale(d.properties.crash_area);
            })
            .attr("r", function(d){
                return 4;
            })
            .attr("fill", "#1DFF84")
            .attr("opacity", 0.5);

        // update x axis variable
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

        // update the x axis svg
        svg.select(".x.axis")
            .transition()
            .duration(1500)
            .call(xAxis);

        // update the x axis label
        svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Median Income ($)");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Median Income and Crash Density");

        return true;
      },
    povrate: function(){

          // update x scale
          var xScale = d3.scale.linear()
                .domain([0, d3.max(dataset, function(d){
                    return d.properties.pov_rate;
                })])
                .range([0, w]);

          // update the circles
          svg.selectAll("circle")
                .data(dataset)
                .transition()
                .duration(1500)
                .attr("cx", function(d){
                  return xScale(d.properties.pov_rate);
              })
                .attr("cy", function(d){
                  return yScale(d.properties.crash_area);
              })
                .attr("r", function(d){
                  return 4;
              })
                .attr("fill", "#1DFF84")
                .attr("opacity", 0.5);

          // update x axis variable
          var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          // update the x axis svg
          svg.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxis);

          // update the x axis label
          svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Poverty Rate (%)");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Poverty Rate and Crash Density");

        return true;
      },
        unemprate: function(){

          // update x scale
          var xScale = d3.scale.linear()
                .domain([0, d3.max(dataset, function(d){
                    return d.properties.unemp_rate;
                })])
                .range([0, w]);

          // update the circles
          svg.selectAll("circle")
                .data(dataset)
                .transition()
                .duration(1500)
                .attr("cx", function(d){
                  return xScale(d.properties.unemp_rate);
              })
                .attr("cy", function(d){
                  return yScale(d.properties.crash_area);
              })
                .attr("r", function(d){
                  return 4;
              })
                .attr("fill", "#1DFF84")
                .attr("opacity", 0.5);

          // update x axis variable
          var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          // update the x axis svg
          svg.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxis);

          // update the x axis label
          svg.select("#xlabel")
              .transition()
              .duration(3000)
              .text("Unemployment Rate (%)");

          // update the title
          svg.select("#sctitle")
              .transition()
              .duration(3000)
              .text("Relating Unemployment Rate and Crash Density");

        return true;
      }
    }

      $('#layer_selector').change(function() {
             D3Actions[$(this).val()]();
        });

      // add some space between things
      var spacing = d3.select("#d3-elements")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "5%");

      // now create the bar chart. start by setting width and height of svg are the same.

      // create the dataset
      var datasetBar = boroughs;
      console.log(datasetBar);

      // create the xScale and yScale

      var xScaleBar = d3.scale.linear()
                    .domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })])
                    .range([0, w]);

      var yScaleBar = d3.scale.ordinal()
                    .domain(d3.range(datasetBar.length))
                    .rangeRoundBands([0, h], 0.05);

     // set a color scale
     var color = d3.scale.ordinal()
        .range(["#98abc5", "#d0743c", "#ff8c00", "#a05d56", "#8a89a6"]);

      // create the ring chart svg
     var svgBar = d3.select("#d3-elements")
        .append("div")
        .classed("svg-container-2", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 225")
        .classed("svg-content-responsive", true);

      //Create bars
     svgBar.selectAll("rect")
       .data(datasetBar)
       .enter()
       .append("rect")
       .attr("x", margin.left)
       .attr("y", function(d, i) {
            return yScaleBar(i) + margin.top/2;
       })
       .attr("width", function(d) {
            return xScaleBar(d.crash_dens);
       })
       .attr("height", yScaleBar.rangeBand())
       .attr("fill", function(d, i) {
            return color(i);
       })
       .attr("opacity", 1);

      //Create labels
    svgBar.selectAll("text")
       .data(datasetBar)
       .enter()
       .append("text")
       .text(function(d) {
            return d.name + " – " + d.crash_dens;
       })
       .attr("x", function(d) {
            if (d.crash_dens > 200){
                return xScaleBar(d.crash_dens) - 40;
            }
            else {
                return margin.left + 15;
            }
       })
       .attr("y", function(d, i) {
            return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
       })
       .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
       .attr("font-size", "8px")
       .attr("fill", "white")
       .attr("class", "chart-label");

      // create axes
      var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

      var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

      // append the x axis to the svg
      svgBar.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (margin.top/2 + h) + ")")
            .call(xAxisBar);

      // append a label to the x axis
      svgBar.append("text")
            .text("Crashes per Square Mile (2013-2015)")
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
            .attr("font-size", "10px")
            .attr("x", w/2 + margin.left)
            .attr("y", h + margin.bottom + 15);

      // append the y axis to the svg
      svgBar.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top/2 +")")
            .call(yAxisBar);

      // append a label to the y axis
      svgBar.append("text")
            .text("Borough")
            .attr("id", "ylabel")
            .style("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
            .attr("font-size", "10px")
            .attr("x", 80)
            .attr("y", 10)
            .attr("transform", "rotate(-90)");

      // append a title
      svgBar.append("text")
        .text("Crash Density by Borough")
        .attr("id", "bar-title")
        .attr("x", w/2 + margin.left)             
        .attr("y", 10)
        .attr("text-anchor", "middle")  
        .attr("font-size", "12px")
        .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
        .attr("fill", "white");

      // change the bar graph on change of zoom

      var D3BarActions = {

          bronx: function(){

          // update the dataset
          var datasetBar = bronx;

          // update the color function
          var colors = ["#8a89a6", "#98abc5", "#a05d56", "#d0743c", "#ff8c00"];

          var colorRange = d3.scale.linear()
                              .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
                              .range(colors);

          var c = d3.scale.linear()
                          .domain([0, d3.max(datasetBar, function(d){
                                return d.crash_dens;
                            })])
                          .range([0,1]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", h)
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d) {
                        return colorRange(c(d.crash_dens));
                   })
                   .attr("opacity", 1);

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", -yScaleBar.rangeBand)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 150){
                            return xScaleBar(d.crash_dens) - 30;
                        }
                        else {
                            return margin.left + 15;
                        }
                   })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Crash Densities in Bronx City Council Districts");

          },
          brooklyn: function(){
          // update the dataset
          var datasetBar = brooklyn;

          // update the color function
          var colors = ["#8a89a6", "#98abc5", "#a05d56", "#d0743c", "#ff8c00"];

          var colorRange = d3.scale.linear()
                              .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
                              .range(colors);

          var c = d3.scale.linear()
                          .domain([0, d3.max(datasetBar, function(d){
                                return d.crash_dens;
                            })])
                          .range([0,1]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", h)
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("fill", function(d, i) {
                    return color(i);
               })
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d) {
                        return colorRange(c(d.crash_dens));
                   })
                    .attr("opacity", 1);

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 150){
                            return xScaleBar(d.crash_dens) - 30;
                        }
                        else {
                            return margin.left + 15;
                        }
                   })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Crash Densities in Brooklyn City Council Districts");
          },
          manhattan: function(){

          // update the dataset
          var datasetBar = manhattan;

          // update the color function
          var colors = ["#8a89a6", "#98abc5", "#a05d56", "#d0743c", "#ff8c00"];

          var colorRange = d3.scale.linear()
                              .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
                              .range(colors);

          var c = d3.scale.linear()
                          .domain([0, d3.max(datasetBar, function(d){
                                return d.crash_dens;
                            })])
                          .range([0,1]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", h)
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("fill", function(d, i) {
                    return color(i);
               })
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d) {
                        return colorRange(c(d.crash_dens));
                   })
                   .attr("opacity", 1);

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 350){
                            return xScaleBar(d.crash_dens) - 30;
                        }
                        else {
                            return margin.left + 15;
                        }
                    })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Crash Densities in Manhattan City Council Districts");
          },
          queens: function(){
          // update the dataset
          var datasetBar = queens;

          // update the color function
          var colors = ["#8a89a6", "#98abc5", "#a05d56", "#d0743c", "#ff8c00"];

          var colorRange = d3.scale.linear()
                              .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
                              .range(colors);

          var c = d3.scale.linear()
                          .domain([0, d3.max(datasetBar, function(d){
                                return d.crash_dens;
                            })])
                          .range([0,1]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", h)
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("fill", function(d, i) {
                    return color(i);
               })
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d) {
                        return colorRange(c(d.crash_dens));
                   })
                   .attr("opacity", 1);

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 125){
                            return xScaleBar(d.crash_dens) - 30;
                        }
                        else {
                            return margin.left + 15;
                        }
                    })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Crash Densities in Queens City Council Districts");
          },
          statenisland: function(){

          // update the dataset
          var datasetBar = staten;

          // update the color function
          var colors = ["#8a89a6", "#98abc5", "#a05d56", "#d0743c", "#ff8c00"];

          var colorRange = d3.scale.linear()
                              .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
                              .range(colors);

          var c = d3.scale.linear()
                          .domain([0, d3.max(datasetBar, function(d){
                                return d.crash_dens;
                            })])
                          .range([0,1]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", (margin.top + h))
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("fill", function(d, i) {
                    return color(i);
               })
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d) {
                        return colorRange(c(d.crash_dens));
                   })
                   .attr("opacity", 1);

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 10){
                            return xScaleBar(d.crash_dens) - 30;
                        }
                        else {
                            return margin.left + 15;
                        }
                    })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Crash Densities in Staten Island City Council Districts");
          },
          reset: function(){

          // update the dataset
          var datasetBar = boroughs;

          // update the color function
          var color = d3.scale.ordinal()
        .range(["#98abc5", "#d0743c", "#ff8c00", "#a05d56", "#8a89a6"]);

          // update the scales
          xScaleBar.domain([0, d3.max(datasetBar, function(d){
                        return d.crash_dens;
                    })]);
          yScaleBar.domain(d3.range(datasetBar.length));

          // update the axes
          var xAxisBar = d3.svg.axis()
                    .scale(xScaleBar)
                    .orient("bottom")
                    .ticks(5)
                    .innerTickSize(1)
                    .outerTickSize(0);

          var yAxisBar = d3.svg.axis()
                    .scale(yScaleBar)
                    .ticks(0)
                    .tickFormat("")
                    .orient("right")
                    .innerTickSize(1)
                    .outerTickSize(0);

          // transition in the newby
          svgBar.select(".x.axis")
                .transition()
                .duration(1500)
                .call(xAxisBar);

          svgBar.select(".y.axis")
                .transition()
                .duration(1500)
                .call(yAxisBar);

          // select the rects and append the data
          var bars = svgBar.selectAll("rect")
                            .data(datasetBar);

          // add new values at the bottom of the chart
          bars.enter()
              .append("rect")
              .attr("x", margin.left)
               .attr("y", (margin.top + h))
               .attr("width", function(d) {
                    return xScaleBar(d.crash_dens);
               })
               .attr("height", yScaleBar.rangeBand())
               .attr("fill", function(d, i) {
                    return color(i);
               })
               .attr("opacity", 0);

          // update...
          bars.transition()
                .duration(1000)
                .attr("x", margin.left)
                   .attr("y", function(d, i) {
                        return yScaleBar(i) + margin.top/2;
                   })
                   .attr("width", function(d) {
                        return xScaleBar(d.crash_dens);
                   })
                   .attr("height", yScaleBar.rangeBand())
                   .attr("fill", function(d, i) {
                        return color(i);
                   })
                   .attr("opacity", 1);;

          // exit...
              bars.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // select the labels
              var labels = svgBar.selectAll(".chart-label")
                            .data(datasetBar);

          // get them ready
              labels.enter()
                    .append("text")
                    .attr("x", margin.left)
                    .attr("y", (margin.top + h))
                    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
                    .attr("font-size", "10px")
                    .attr("fill", "white")
                    .attr("class", "chart-label");

          // update
              labels.transition()
                    .duration(1000)
                    .text(function(d) {
                        return d.name + " – " + d.crash_dens;
                    })
                    .attr("x", function(d) {
                        if (d.crash_dens > 200){
                            return xScaleBar(d.crash_dens) - 40;
                        }
                        else {
                            return margin.left + 15;
                        }
                   })
                    .attr("y", function(d, i) {
                        return yScaleBar(i) + yScaleBar.rangeBand() / 2 + 3 + margin.top/2;
                    });

          // exit
              labels.exit()
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0)
                    .remove();

          // now just change the title
              svgBar.select("#bar-title")
                    .text("Distribution of Crash Densities by Borough");
          }
      }

      // transition bars on zoom
      $('#zoom_selector').change(function(){
            D3BarActions[$(this).val()]();
            });

}


// SVG Size
var width = 700,
	height = 500;

var genre = [];

// var prepareData = function(data) {
// 	genre.push(data["genre"])
// 	data.sort(function(x, y){
// 		return d3.descending(x.streams, y.streams);
// 	})
// 	return {
// 		name: data["name"],
// 		streams_in_mils: parseInt(data["streams_in_mils"]),
// 		songs: parseInt(data["songs"]),
// 		songs_with_mil_plus_streams: parseInt(data["songs_with_mil_plus_streams"]),
// 		genre: data["genre"]
// 	};
// 	// Step 1: Analyze and prepare the data
// 	// Use the web console to get a better idea of the dataset
// 	// Convert numeric values to numbers.
// 	// Make sure the genres array has the name of each genre
//
// }

var prepareData = function(data) {
	data.forEach( function (d) {
		d["streams_in_mils"] = parseInt(d["streams_in_mils"]);
		d["songs"] = parseInt(d["songs"]);
		d["songs_with_mil_plus_streams"] = parseInt(d["songs_with_mil_plus_streams"]);
		if (!genre.includes(d["genre"])) {
			genre.push(d["genre"])
		}
	});
	console.log(data);
	data.sort(function(x, y){
		return d3.descending(x["songs_with_mil_plus_streams"], y["songs_with_mil_plus_streams"]);
	})
	return data;

};

// Load CSV file
// d3.csv("data/spotify_data.csv", prepareData, function(data){
// 	// Analyze the dataset in the web console
// 	createVisualization(data);
// });

d3.csv("data/spotify_data.csv", function(data){

	// Analyze the dataset in the web console

	var preparedData = prepareData(data);

	createVisualization(preparedData);
});

var createVisualization = function(data) {
	// Step 2: Append a new SVG area with D3
	// The ID of the target div container in the html file is #chart-area
	// Use the margin convention with 50 px of bottom margin and 30 px of margin on other sides!
	var padding = 20;
	var margin = {top: 30, right: 30, bottom: 50, left: 30};
	var width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Step 3: Create linear scales by using the D3 scale functions
	// You will need an songs scale (x-axis) and a scale function for the streams (y-axis).
	// Call them numSongsScale and streamsScale.
	// Use d3.min() and d3.max() (or d3.extent()) for the input domain
	// Use the variables height and width for the output range

	var extent1 = d3.extent(data, function(d) {
		return d.songs;
	});

	var extent2 = d3.extent(data, function(d) {
		return d.streams_in_mils;
	})

	var numSongsScale = d3.scaleLinear()
		.domain(extent1)
		.range([padding, width - padding]);

	var streamsScale = d3.scaleLinear()
		.domain(extent2)
		.range([height - padding, padding]);

	// Step 4: Try the scale functions
	// You can call the functions with example values and print the result to the web console.



	// Step 6: Use your scales (songs and streams) to create D3 axis functions
	// Step 7: Append the x- and y-axis to your scatterplot
	// Add the axes to a group element that you add to the SVG drawing area.
	// Use translate() to change the axis position

	var xAxis = d3.axisBottom()
		.scale(numSongsScale)
	svg.append("g")
		.attr("class", "axis xAxis")
		.attr("transform", "translate(" + padding + "," + (height - padding) + ")")
		.call(xAxis);


	var yAxis = d3.axisLeft(streamsScale)
	// svg.append("g")
	// 	.attr("transform", "translate(50, 10)")
	// 	.call(yAxis);
	svg.append("g")
		.attr("class", "axis yAxis")
		.attr("transform", "translate(" + 0.25 * padding + "0)")
		.call(yAxis);

	// Step 8: Refine the domain of the scales
	// Notice that some of the circles are positioned on the outer edges of the svg area
	// You can include buffer values to widen the domain and to prevent circles and axes from overlapping

	// Step 9: Label your axes
	// Modified from a StackExchange thread
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height + 15)
		.text("Number of songs");

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", -20)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Number of streams (in millions)");

	// Step 5: Map the countries to SVG circles
	// Use select(), data(), enter() and append()
	// Instead of setting the x- and y-values directly,
	// you have to use your scale functions to convert the data values to pixel measures

	// Step 10: Add a scale function for the circle radius
	// Create a linear scale function dependent on the number of million plus streamed songs
	// The radius should be between 4 - 30px.
	// Then use the scale function to specify a dynamic radius

	// Step 11: Change the drawing order
	// Larger circles should not overlap or cover smaller circles.
	// Sort the artists by streams before drawing them.

	// Step 12: Color the circles depending on their genres
	// Use a D3 color scale

	var extent3 = d3.extent(data, function(d) {
		return d.songs_with_mil_plus_streams;
	})

	var milPlusStreamsScale = d3.scaleLinear()
		.domain(extent3)
		.range([4, 30]);

	var linearColor = d3.scaleOrdinal()
		.domain(genre)
		.range(["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "brown"]);

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d){
			return 2 * padding + numSongsScale(d.songs);
		})
		.attr("cy", function(d){
			return - padding + streamsScale(d.streams_in_mils);
		})
		.attr("r", function(d){
			return milPlusStreamsScale(d.songs_with_mil_plus_streams);
		})
		.attr("fill", function(d){
			return linearColor(d.genre)
		})

}

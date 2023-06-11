// Get the Roadster endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

// Display the default plot
function init() {

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Using D3, get sample names and fill the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let sample_names = data.names;

        // Add sample names to dropdown menu
        sample_names.forEach((id) => {

            // Console log and append the id 
            console.log(id);

            dropdown.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_first = sample_names[0];

        // Console log the first sample 
        console.log(sample_first);

        // Build the initial plots for the first sample
        buildMetadata(sample_first);
        buildBarChart(sample_first);
        buildBubbleChart(sample_first);
        buildGaugeChart(sample_first);
    });
};

// Function that fill the metadata info
function buildMetadata(sample) {

    // Using D3, retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all metadata info
        let metadata = data.metadata;

        // Filter based on sample, and console log the metadata_values
        let metadata_value = metadata.filter(result => result.id == sample);
        console.log(metadata_value)

        // Get the first value from the array
        let valueData = metadata_value[0];

        // Clear metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,metadata_value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,metadata_value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${metadata_value}`);
        });
    });
};

// Function that builds the bar chart
function buildBarChart(sample) {

    // Using D3, retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all sample data info
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            marker: {
                color: 'green'},
            type: "bar",
            orientation: "h"
        };

        // Setup layout
        let layout = {
            title: "Top 10 Operational Taxonomic Unit (OTUs)"
        };

        // Plot the bar chart using Plotly
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland"
            }
        };

        // Set layout
        let layout = {
            title: "Bacteria Per OTU ID",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {autorange: true},
        };

        // Plot the bubble chart using Plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that builds the gauge chart
// Unfortunately, at this stage, I cannot find how to add the needle hand into the gauge chart.
function buildGaugeChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all metadata
        let washInfo = data.metadata;

        // Filter based on the value of the sample
        let washvalue = washInfo.filter(result => result.id == sample);

        // Get the first index from the array 
        let valueData = washvalue[0];

        // Get the wfreq value
        let wfreq = valueData.wfreq;

        // Log the data to the console
        console.log(wfreq);
        
        // Set trace for gauge chart
        let trace1 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge",
            visible: true, 
            title: {text: "<b> Washing Frequency of Bely Buttons </b> <br></br> Number of Scrubs Per Week"},
            gauge: {
              axis: {range: [null,9], dtick: "1"},
              bar: {color: "black"},
              steps:[
                {range: [0, 1], color: "#D9E8CC"},
                {range: [1, 2], color: "#B7D8AA"},
                {range: [2, 3], color: "#8EC788"},
                {range: [3, 4], color: "#67B66E"},
                {range: [4, 5], color: "#47A461"},
                {range: [5, 6], color: "#279258"},
                {range: [6, 7], color: "#087F55"},
                {range: [7, 8], color: "#057162"},
                {range: [8, 9], color: "#035C62"},
              ]
            }
        };

        // Set layout
        let layout = {
            width: 600, height: 500, margin: { t: 0, b: 0 } 
          };

        // Plot the bubble chart using Plotly
        Plotly.newPlot("gauge", [trace1], layout)
    });
};

// Updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initialize function
init();
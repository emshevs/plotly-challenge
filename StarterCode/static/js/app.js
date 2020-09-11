// Function 
function getPlot(id) {
    
    // Reading Data
    d3.json("samples.json").then((data)=> {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)

        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        // Top 10 sample values
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // Top 10 OTU IDs
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // OTU placed in front of ID OTU
        var idOtu = idValues.map(d => "OTU " + d)

        // Top 10 sample OTU labels
        var labels = samples.otu_labels.slice(0, 10);
        
        // Bar Chart Trace
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // Create the data variable
        var data = [trace];

        // Bar Chart layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 110,
                r: 110,
                t: 35,
                b: 35,
            }
        };

        // Plot
        Plotly.newPlot("bar", data, layout);
        
        // Bubble Chart 
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // Layout for bubble chart
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
        };

        // Bubble chart data variable
        var data1 = [trace1];

        // Plot
        Plotly.newPlot("bubble", data1, layout); 

        // Gauge Chart

        var data3 = [
            {
            domain: { x: [0, 9], y: [0, 9] },
            value: wfreq,
            title: { text: `ID# ${id} Weekly Washing Frequency` },
            type: "indicator",
            mode: "gauge+number"
            }
            ];
            
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data3, layout);

    });    
}
    
// Function
function getInfo(id) {
    // Read file
    d3.json("samples.json").then((data)=> {
        
        var metadata = data.metadata;

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Event Change Function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // Append 
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();


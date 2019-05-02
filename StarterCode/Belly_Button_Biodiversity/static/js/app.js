function buildMetadata(sample) {
  //Grab container for the metadata
  var metadataContainer = d3.select("#sample-metadata")

  //Resquest the metadata for the sample via Flask and populate to the container
  d3.json(`/metadata/${sample}`).then(function(request){
    //console.log(Object.keys(request))
    var keys = Object.keys(request)
    keys.forEach(key => {
      metadataContainer.append("p").text(`${key}: ${request[key]}`).property("value", `${key}: ${request[key]}`);
    }
    )
})};


function buildCharts(sample) {
  function buildPie(sample){
    d3.json(`/samples/${sample}`).then(function(result) {
      
      var otu_ids = Object.values(result.otu_ids);
      var sample_values = Object.values(result.sample_values);
      var otu_labels = Object.values(result.otu_labels);
      var layout1 = {};
      var data = []
      for (var i = 0; i < sample_values.length; i++) {
        var line = {
          id: otu_ids[i],
          value: sample_values[i],
          label: otu_labels[i]
        }
        data.push(line)
      };
      var sorted_data = data.sort((a, b) => {
        return b.value - a.value
      });
      var top_ten = sorted_data.slice(0,10);
      var ids = [];
      var values = [];
      var labels = [];

      top_ten.forEach(function(r) {
        ids.push(r.id);
        values.push(r.value);
        labels.push(r.label);
      });

      var trace1 = [{
        labels: ids,
        values: values,
        hoverinfo: labels,
        type: "pie"
      }];
      Plotly.newPlot("pie", trace1, layout1);
  });
}
  buildPie(sample);
  };
    //   var layout2 = {textposition: 'inside'};
    //   var trace2 = [{
    //     x: otu_ids,
    //     y: sample_values,
    //     text: otu_labels,
    //     marker: {
    //       color: otu_ids,
    //       size: sample_values
    //     },
    //     mode: "markers",
    //     type: "scatter"
    //   }];
    //   Plotly.plot("bubble", trace2, layout2);
    // });

  //};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    }); 

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

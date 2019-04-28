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

  console.log('build charts')
}

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

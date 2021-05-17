
  var worldMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
  });
  
  var filter;
  var california;
  var states;
  var prisons;


  // create a prisons layer
  prisons = L.geoJSON(prisonData, {
    style: style,
    onEachFeature: onEachPrison
  });


  // create a states layer
  states = L.geoJson(stateData, {
    style: style,
    onEachFeature: onEachFeature
  });

  // create ca counties layer
  california = L.geoJson(countyData, {
    style: style,
    onEachFeature: onEachFeature
  });

  // create the map
  var map = L.map('map',{
    layers: [worldMap, california, prisons]
  }).setView([37.8, -96], 4);
  

  // control that shows state/county and prision info on hover
  var info = L.control();
  var info2 = L.control();


  // covert the prision name string to title case
  function titleCase(str) {
    str = str.toLowerCase().split(' ');
    
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }

    return str.join(' ');
  }


  function checkForData(numCases){
    if(numCases > 0){
      return numCases;
    }
    return "Unknown";
  }


  info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function(props) {
    this._div.innerHTML = '<h4>Covid Data</h4>' + (props ?
      '<b>' + props.name + '</b><br />' + 'Cases: ' + checkForData(props.cases):
      'Hover over a region');
  };

  info2.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  
  info2.update = function(props) {
    this._div.innerHTML = '<h4>Prison Data</h4>' + (props ?
      '<b>' + titleCase(props.name) + '</b><br />' + 'Cases: ' + checkForData(props.cases):
      'Hover over a marker');
  };

  // get color depending on population density value
  function getColor(d) {
    return d > 100000 ? '#800026' :
      d > 50000 ? '#BD0026' :
      d > 10000 ? '#E31A1C' :
      d > 1000 ? '#FC4E2A' :
      d > 500 ? '#FD8D3C' :
      d > 50 ? '#FEB24C' :
      d > 10 ? '#FED976' :
      d > 0 ? '#FFEDA0' :
      '#9c9c9c';
  }
  
  function style(feature) {
    return {
      weight: .5,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.cases)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }
  function highlightPrison(e) {
    var layer = e.target;

    info2.update(layer.feature.properties);
  }

  

  function resetHighlight(e) {
    california.resetStyle(e.target);
    info.update();
  }
  function resetPrison(e) {
    prisons.resetStyle(e.target);
    info2.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  function onEachPrison(feature, layer) {
    layer.on({
      mouseover: highlightPrison,
      mouseout: resetPrison
    });
  }
  function refresh(){
    california.setStyle(style);
    states.setStyle(style);
    prisons.setStyle(style);
  }


  map.attributionControl.addAttribution('State/County Covid Data &copy; <a href="https://github.com/nytimes/covid-19-data/blob/master/us-counties.csv">New York Times Covid Bot</a>');


  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = ["Unknown", 0, 50, 100, 500, 1000, 10000, 50000, 100000],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      if(from == "Unknown"){
        labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' + from);
      }else{
        labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }
      
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  var baseMaps = {
    "World Map": worldMap,
  };

  var overlayMaps = {
    "Counties": california,
    "States": states,
    "Prisons": prisons
  };


  info.addTo(map);
  info2.addTo(map);

  filter = L.control.layers(baseMaps, overlayMaps).addTo(map);
  legend.addTo(map);

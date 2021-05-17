function getData(){
    var datePicked = document.getElementById('date').value;

    axios.get('http://127.0.0.1:5000/county', {
        params: {
            date: datePicked
        }

    }).then(function (response) {
        
        //reset countyData
        var count1 = countyData.features.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            countyData.features[i].properties.cases = -1;
	    countyData.features[i].properties.deaths = -1;
        }

        refresh();

        var count1 = countyData.features.length;
        var count2 = response.data.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            
            var j = 0;
            for(j = 0; j < count2; j++){
                
                if(countyData.features[i].properties.name == response.data[j].county && countyData.features[i].properties.state == response.data[j].state){
                    
                    countyData.features[i].properties.cases = response.data[j].cases;
                    countyData.features[i].properties.deaths = response.data[j].deaths;
                    break;
                }
            }
        }


        var tableHeaderRowCount = 1;
        var table = document.getElementById('counties');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }   
        

        for (var i = 0; i < countyData.features.length; i++ ) {

            if(countyData.features[i].properties.state === "California") {
                createCountyTable(countyData.features[i].properties)
                console.log(countyData.features[i].properties)
            }
        }


        refresh();
        
    }).catch(function (error){
        console.log(error);
    });



    //load state covid data
    axios.get('http://127.0.0.1:5000/state', {
        params: {
            date: datePicked
        }

    }).then(function (response) {
        
        var count1 = stateData.features.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            stateData.features[i].properties.cases = -1;
            stateData.features[i].properties.deaths = -1;
        }

        refresh();

        var count1 = stateData.features.length;
        var count2 = response.data.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            
            var j = 0;
            for(j = 0; j < count2; j++){
                
                if(stateData.features[i].properties.name == response.data[j].state){
                    
                    stateData.features[i].properties.cases = response.data[j].cases;
                    stateData.features[i].properties.deaths = response.data[j].deaths;
                    break;
                }
            }
        }


        var tableHeaderRowCount = 1;
        var table = document.getElementById('states');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }   
        

        for (var i = 0; i < stateData.features.length; i++ ) {

            createStateTable(stateData.features[i].properties);
            console.log(stateData.features[i].properties);
        }


      refresh();
        
    }).catch(function (error){
        console.log(error);

    });


    axios.get('http://127.0.0.1:5000/prison', {
        params: {
            date: datePicked
        }

    }).then(function (response) {
        
        var count1 = prisonData.features.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            prisonData.features[i].properties.cases = -1;
            prisonData.features[i].properties.deaths = -1;
        }

        refresh();

        var count1 = prisonData.features.length;
        var count2 = response.data.length;
        var i = 0; 
        for(i = 0; i < count1; i++) {
            
            var j = 0;
            for(j = 0; j < count2; j++){
            
                if(prisonData.features[i].properties.name == response.data[j].prisonname && prisonData.features[i].properties.state == response.data[j].state){
                    
                    prisonData.features[i].properties.cases = response.data[j].cases;
                    prisonData.features[i].properties.deaths = response.data[j].deaths;
                    break;
                }
            }
        }


        var tableHeaderRowCount = 1;
        var table = document.getElementById('prisons');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }   
        

        for (var i = 0; i < prisonData.features.length; i++ ) {
            
            createPrisonTable(prisonData.features[i].properties);
            console.log(prisonData.features[i].properties);
        }


        refresh();
        
    }).catch(function (error){
        console.log(error);
    });
}


function createCountyTable(response) {

    var countyTable = document.getElementById("counties");
    var countyTableBodyRow = document.createElement('tr');
    countyTableBodyRow.className = 'countyTableBodyRow';

    let countyName = document.createElement('td');
    countyName.innerHTML = response.name;

    let countyCases = document.createElement('td');
    countyCases.innerHTML = checkForData(response.cases);

    let countyDeaths = document.createElement('td');
    countyDeaths.innerHTML = checkForData(response.deaths);

    countyTableBodyRow.append(countyName, countyCases, countyDeaths);
    countyTable.append(countyTableBodyRow);
}

function createStateTable(response) {

    var stateTable = document.getElementById("states");
    var stateTableBodyRow = document.createElement('tr');
    stateTableBodyRow.className = 'stateTableBodyRow';

    let stateName = document.createElement('td');
    stateName.innerHTML = response.name;

    let stateCases = document.createElement('td');
    stateCases.innerHTML = checkForData(response.cases);

    let stateDeaths = document.createElement('td');
    stateDeaths.innerHTML = checkForData(response.deaths);

    stateTableBodyRow.append(stateName, stateCases, stateDeaths);
    stateTable.append(stateTableBodyRow);
    
}

function createPrisonTable(response) {

    var prisonTable = document.getElementById("prisons");
    var prisonTableBodyRow = document.createElement('tr');
    prisonTableBodyRow.className = 'prisonTableBodyRow';

    let prisonName = document.createElement('td');
    prisonName.innerHTML = titleCase(response.name);

    let prisonCases = document.createElement('td');
    prisonCases.innerHTML = checkForData(response.cases);

    let prisonDeaths = document.createElement('td');
    prisonDeaths.innerHTML = checkForData(response.deaths);

    prisonTableBodyRow.append(prisonName, prisonCases, prisonDeaths);
    prisonTable.append(prisonTableBodyRow);
    
}
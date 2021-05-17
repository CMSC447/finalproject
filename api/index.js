const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 5000;
var cors = require('cors');

app.use(cors());
app.use( express.json() );


//connect to the database
var con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Sr.Tardis1!', // ENTER PASSWORD HERE
    database : 'covid_data'
});

con.connect();


app.get('/', (req, res) => {
    return "Test";
});


//retrieve county case data
app.get('/county', (req, res) => {

    con.query('SELECT * FROM counties WHERE dateupdated = ?', [req.query.date], function(err, results) {
        console.log("Success! (county data loaded)");
        res.send(results)
    }); 
});



//retrieve state case data
app.get('/state', (req, res) => {

    con.query('SELECT * FROM states WHERE dateupdated = ?', [req.query.date], function(err, results) {
        console.log("Success! (state data loaded)");
        res.send(results)
    }); 
});


//retrieve state case data
app.get('/prison', (req, res) => {

    con.query('SELECT * FROM prisons WHERE dateupdated = ?', [req.query.date], function(err, results) {
        console.log("Success! (prison data loaded)");
        res.send(results)
    }); 
});


app.listen(PORT,() => console.log(`Running on http://localhost:${PORT}`));
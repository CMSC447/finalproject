const express = require('express');
const path = require('path');
const app = express();
//var reload = require('reload')
const PORT = 3000;
var cors = require('cors');

app.use(cors());
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));

//load the html page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

//start the server
app.listen(PORT,() => console.log(`Running on http://localhost:${PORT}`));

//provides live browsers reload for development purposes.
//reload(app);
// __ VAR -> API's Version 0 __
var api_books               = require('./api_books');
var api_films               = require('./api_films');
var api_linux_distributions = require('./api_linux_distributions');

// __ VAR -> API's Version 1 __
var api_olders              = require('./api_olders');
var api_workers             = require('./api_workers');
var api_population          = require('./api_population');

// __ VAR -> Others __
var bodyParser = require('body-parser');
var express    = require('express');
var tools      = require('./tools');
var app        = express();
var port       = (process.env.PORT || 3500);

// __ URI -> API's Version 0 __
app.use('/api/sandbox/books', api_books);
app.use('/api/sandbox/films', api_films);
app.use('/api/sandbox/linux-distributions', api_linux_distributions);

// __ URI -> API's Version 1 __
app.use('/api/v1/olders', api_olders);
app.use('/api/v1/workers', api_workers);
app.use('/api/v1/population', api_population);

// __ Other Parameters __
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/static'));

app.listen(port, () => {
	console.log('Web server is running and listening on port: ' +port);
});

app.get('/', (req,res) => {
	res.send('<h1>Hello World from group 02</h1><a href="/about">about</a>');
});

app.get('/time', (req,res) => {
	res.send(tools.getFecha());
});
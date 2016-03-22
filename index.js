var bodyParser = require('body-parser');


var tools = require('./tools');
var api_books = require('./api_books');
var api_films = require('./api_films');
var api_linux_distributions = require('./api_linux_distributions');

var app = express();
var port = (process.env.PORT || 3000);

app.use('/api/sandbox/books', api_books);
app.use('/api/sandbox/films', api_films);
app.use('/api/sandbox/linux-distributions', api_linux_distributions);

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
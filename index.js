// __ VAR -> APIs Version 0 __
var api_books               = require('./api_books');
var api_films               = require('./api_films');
var api_linux_distributions = require('./api_linux_distributions');

// __ VAR -> APIs Version 1 __
var api_olders              = require('./api_olders');
var api_workers             = require('./api_workers');
var api_population          = require('./api_population');

// __ VAR -> proxied APIs __
var api_electrical_consume  = require('./api_electrical_consume');
var api_price_of_oil        = require('./api_price_of_oil');
var api_CO2_emisions        = require('./api_CO2_emisions');
var api_companiero_grupo_04 = require('./api_companiero_grupo_04');
var api_proxy_open_weather  = require('./api_proxy_weather');
var api_proxy_club_rural    = require('./api_proxy_club_rural');
var api_proxy_citybikes     = require('./api_proxy_citybikes');
var api_proxy_governify     = require('./api_proxy_governify');
var api_proxy_population_io     = require('./api_proxy_population_io');


// __ VAR -> General __
var bodyParser = require('body-parser');
var express    = require('express');
var tools      = require('./tools');
var app        = express();
var port       = (process.env.PORT || 3000);


// __ URI -> APIs Version 0 __
app.use('/api/sandbox/books', api_books);
app.use('/api/sandbox/films', api_films);
app.use('/api/sandbox/linux-distributions', api_linux_distributions);

// __ URI -> APIs Version 1 __
app.use('/api/v1/olders',     api_olders);
app.use('/api/v1/workers',    api_workers);
app.use('/api/v1/population', api_population);

// __ proxied APIs __
app.use('/api/v1/participants-number', api_electrical_consume);
app.use('/api/v1/oil', api_price_of_oil);
app.use('/api/v1/CO2', api_CO2_emisions);
app.use('/api/v1/population-unemployed-percentage-by-gender', api_companiero_grupo_04);

app.use('/api/proxy/open-weather',  api_proxy_open_weather);
app.use('/api/proxy/club-rural',    api_proxy_club_rural);
app.use('/api/proxy/citybikes',     api_proxy_citybikes);
app.use('/api/proxy/governify',     api_proxy_governify);
app.use('/api/proxy/population-io', api_proxy_population_io);


// __ Other parameters __
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/static'));

app.listen(port, () => {
	console.log('Web server is running and listening on port: ' + port);
});



// __ utils __
app.get('/time', (req,res) => {
	res.send(tools.getFecha());
});

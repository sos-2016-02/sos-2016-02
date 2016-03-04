var express =require("express");
var app = express();
var port = (process.env.PORT || 3000);

app.use("/", express.static(__dirname + "/static"));

app.listen(port, () => {
	console.log("Web server is running and listening on port: " + port);
});


app.get("/", (req, res) => {
	res.send(v_html_code);
});


app.get("/about", function(req, res) {
	res.send(v_about);
});


app.get("/about/population", function(req, res) {
	res.send(v_info_population);
});


app.get("/about/workers", function(req, res) {
	res.send(v_info_workers);
});


app.get("/about/olders", function(req, res) {
	res.send(v_info_olders);
});

var v_html_code      = "";
	v_html_code       += "<html>";
	v_html_code       += "<head><title>My first application on Heroku</title></head>";
	v_html_code       += "<body>";
	v_html_code       += "<h2>Hello world from sos-2016-02 </h2>";
	v_html_code       += "<p><a href='/about'>about</a></p>";
	v_html_code       += "</body>";
	v_html_code       += "</html>";	

var v_about            = "<p>Our sources of information are designed to analyze, at the provincial level in Spain, the relationship between the volume of people who meet the age of majority, the employment sector and part of the population born in EU and South America.</p>";
    v_about           += "<p>CRISTINA LEAL ECHEVARRÍA:     <a href='/about/workers'>workers</a>      </p>";
    v_about           += "<p>Victor Grousset Aburto Duran: <a href='/about/population'>population</a></p>";
    v_about           += "<p>Miguel Angel Cifredo Campos:  <a href='/about/olders'>olders</a>        </p>";

var v_info_population  = "<p>Data: Population</p><p>Columns: year, province, age, birthplace, number</p><p>Description: The number of people from EU and South America, separated in two age ranges (15-19, 20-24), by province, on the years 2014 and 2015.</p>";
var v_info_workers     = "<p>Data: Workers </p>  <p>Columns: province , year, industry, value       </p><p>Description: Labor market activity, employment and unemployment survey working population.</p>";
var v_info_olders      = "<p>Data: Olders</p>    <p>Columns: year, province, men, women             </p><p>Description: Population 18 years old.</p>";

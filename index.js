
var express =require("express");
var app = express(); 

// establecido el puerto de heroku de este otro modo 5000 es una alternativa 
app.set('port',(process.env.PORT || 5000);

app.get("/", (req,res) => {
	res.write("<html>");
	res.write("<head><title>My first application on Heroku</title></head>");
	res.write("<body><h2>Hello world from sos-2016-02 </h2></body>");
	res.write("</html>");
	res.end();
});

app.get("/about", function(req, res) {
	  res.send(v_about);
});

app.get("/about/population", function(req, res) {
	  res.send(v_info_population);
});

// change function for the oder version =>
app.get("/about/workers", (req, res)=> {
	  res.send(v_info_workers);
});

app.get("/about/olders", function(req, res) {
	  res.send(v_info_olders);
});

var v_about           = "";
    v_about           += "<p>Cristina Leal Echevarria:     <a href='/about/workers'>workers</a>      </p>";
    v_about           += "<p>Victor Grousset Aburto Duran: <a href='/about/population'>population</a></p>";
    v_about           += "<p>Miguel Angel Cifredo Campos:  <a href='/about/olders'>olders</a>        </p>";

var v_info_population = "<p>Data: Population</p><p>Columns: year, province, age, birthplace, number</p><p>Description: The number of people from EU and South America, separated in two age ranges (15-19, 20-24), by province, on the years 2014 and 2015.</p>";
var v_info_workers    = "<p>Data: Workers </p>  <p>Columns: province , year, industry, value       </p><p>Description: Labor market activity, employment and unemployment survey working population.</p>";
var v_info_olders     = "<p>Data: Olders</p>    <p>Columns: year, province, men, women             </p><p>Description: Population 18 years old.</p>";
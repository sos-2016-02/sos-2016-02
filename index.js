var express =require("express");
var app = express(); 

app.listen(process.env.PORT);

app.get("/", (req,res) => {
	res.write("<html>");
	res.write("<head><title>Mi primera apliación Heroku</title></head>");
	res.write("<body><h2>Hola mundo SOS-2016-02</h2></body>");
	res.write("</html>");
	res.end();
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

var v_info_population = "<p>Data: Population</p><p>Collums: year, province, age, birthplace, number</p><p>Description: The number of people from EU and South America, separated in two age ranges (15-19, 20-24), by province, on the years 2014 and 2015.</p>";
var v_info_workers    = "<p>Data: Workers</p>   <p>Collums: province, year, industry, value</p>        <p>Description: Labor market activity, employment and unemployment survey working population.</p>";
var v_info_olders     = "<p>Data: Olders</p>    <p>Collums: yerar, province, men, women</p>            <p>Description: Population 18 years old.</p>";
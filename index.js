var express =require("express");
var app = express(); 

app.listen(process.env.PORT);

app.get("/",(req,res) => {
	res.write("<html>");
	res.write("<head><title>Mi primera apliación Heroku</title></head>");
	res.write("<body><h2>Hola mundo SOS-2016-02</h2></body>");
	res.write("</html>");
	res.end();
});


/*
var populationIntroduction = `
<p>
  Data: Population
</p>
<p>
  Collums:  year, province, age, birthplace, number
</p>
<p>
  Description: The number of people from EU and South America, separated in two age ranges (15-19, 20-24), by province, on the years 2014 and 2015
</p>
`;
app.get('/about/population', function(req, res) {
	  res.send(populationIntroduction);
});
*/
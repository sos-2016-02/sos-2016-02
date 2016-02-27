var cool = require("cool-ascii-faces");
/*console.log(cool());*/

var express =require("express");
var app = express(); 
app.listen("3000");

app.get('/',function(req, res) {
	res.send(cool());
});

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

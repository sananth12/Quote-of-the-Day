var request = require('request'),
    $ = require('cheerio'),
    chalk = require('chalk'),
    quotesDB = require('./my.json'),
    fs = require('fs');

function appendJSON(q){
	var outputFilename = './my.json';

	fs.writeFile(outputFilename, JSON.stringify(q, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	}); 
}

function getAllQuotes(json){
	var htmlString = json.toString();
	var parsedHTML = $.load(htmlString);
	var quote = [];
	parsedHTML('.bqQuoteLink').map(function(i, foo){
		foo = $(foo);
		quote.push(foo.text());
	});
	
	var auth = [];
	parsedHTML('.bq-aut').map(function(i, foo){
		foo = $(foo);
		auth.push(foo.text());
	});

	var quotes = []
	for(var i = 0; i < quote.length; i++){
		quotes.push({ "quote" : quote[i], "author" : auth[i]});
		quotesDB.push({ "quote" : quote[i], "author" : auth[i]});
	}

	appendJSON(quotesDB);

	return quotes;
}

function randomIndex(len){
	return (parseInt((Math.random()*100)) % len);
}

console.log(chalk.underline.blue.bold("\nQuote of the day\n"));

request.get("http://wwwasd.brainyquote.com/quotes_of_the_day.html",function(error, res, json){
	if ( error || res.statusCode != 200) {
		
		var index = randomIndex(quotesDB.length - 1);
	
		console.log(['',
		     '    ' + chalk.yellow(quotesDB[index]["quote"]),
		     '        -- ' + chalk.red(quotesDB[index]["author"]),
		     ''
		    ].join('\n'));	

		console.log(chalk.white("Oops! Coudn't update DB."));

		return;
	}

	var quotes = getAllQuotes(json);
	var index = randomIndex(quotes.length - 1);
	
	console.log(['',
		     '    ' + chalk.yellow(quotes[index]["quote"]),
		     '        -- ' + chalk.red(quotes[index]["author"]),
		     ''
		    ].join('\n'));
});

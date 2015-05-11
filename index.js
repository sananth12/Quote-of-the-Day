var request = require('request'),
    $ = require('cheerio'),
    chalk = require('chalk'),
    quotesDB = require('./quotes.json'),
    fs = require('fs');

function appendJSON(q, quotesDB){
	var outputFilename = './quotes.json';

	for(var i = 0; i < q.length; i++){
		var j = 0;
		for(j = 0; j < quotesDB.length; j++)
			if(quotesDB[j]["quote"] == q[i]["quote"])
				break;

			if(j == quotesDB.length)
				quotesDB.push(q[i]);
	}

	fs.writeFile(outputFilename, JSON.stringify(quotesDB, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      //console.log(chalk.green(outputFilename + " has been updated!"));
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
	}

	appendJSON(quotes, quotesDB);

	return quotes;
}

function randomIndex(len){
	return (parseInt((Math.random()*100)) % len);
}


function printQuote(q, a){
	console.log(['',
		     '    ' + chalk.yellow(q),
		     '        -- ' + chalk.red(a),
		     ''
		    ].join('\n'));	
}


console.log(chalk.underline.blue.bold("\nQuote of the day\n"));

module.exports = function(latest){

	if(latest){
		console.log(chalk.green("Updating..."));

		request.get("http://www.brainyquote.com/quotes_of_the_day.html",function(error, res, json){
			if ( error || res.statusCode != 200) {
				
				var index = randomIndex(quotesDB.length - 1);
			
				printQuote(quotesDB[index]["quote"], quotesDB[index]["author"]);

				console.log(chalk.white("Oops! Coudn't update DB."));

				return;
			}

			var quotes = getAllQuotes(json);
			var index = randomIndex(quotes.length - 1);
			
			printQuote(quotesDB[index]["quote"], quotesDB[index]["author"]);

		});
	}
	else{
				var index = randomIndex(quotesDB.length - 1);
				printQuote(quotesDB[index]["quote"], quotesDB[index]["author"]);
				console.log(chalk.white("Oops! Coudn't update DB."));

	}
}
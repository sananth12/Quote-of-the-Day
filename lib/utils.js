var fs = require('fs'),
		quotesDB = require('../quotes.json'),
		chalk = require('chalk');

exports.appendJSON = function(q){
	var outputFilename = '../quotes.json';

	fs.writeFile(outputFilename, JSON.stringify(q, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	}); 
}

exports.randomIndex = function(len){
	return (parseInt((Math.random()*100)) % len);
}

module.exports = function getAllQuotes(json){
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

exports.printQuote = function(q, a){
			console.log(['',
		     '    ' + chalk.yellow(q),
		     '        -- ' + chalk.red(a),
		     ''
		    ].join('\n'));	

}
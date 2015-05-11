var quoter = require("./index")

var arg = process.argv[2];

if(arg == "--latest")
  quoter(true);
else
  quoter(false);


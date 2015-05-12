#! /usr/bin/env node

var quoter = require("./index")

var arg = process.argv[2];

if(arg == "--offline")
  quoter(false);
else
  quoter(true);


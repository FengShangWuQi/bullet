#!/usr/bin/env node
const pkg = require("../package.json");
const path = require("path");

require(path.join("../", pkg.main)).cli();

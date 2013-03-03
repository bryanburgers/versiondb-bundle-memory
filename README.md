# VersionDB Memory Bundle

Create an in-memory bundle for use in VersionDB.

[![Build Status](https://secure.travis-ci.org/bryanburgers/versiondb-bundle-memory.png)](http://travis-ci.org/bryanburgers/versiondb-bundle-memory)

## Usage

### Create a new memory bundle

	var memorybundle = require('versiondb-bundle-memory');
	var bundle = memorybundle();

### Add a product and version to the bundle

	bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example;");

### Get products

	bundle.getProducts(); // => ["example"]

### Get versions

	bundle.getVersions("example"); // => ["1.0.0"]

### Get update query

	bundle.getUpdateQuery("example", "1.0.0", function(err, query) {
		// query === "CREATE SCHEMA example;"
	});

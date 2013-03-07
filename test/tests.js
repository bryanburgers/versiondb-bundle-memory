var memorybundle = require('../');
var should = require('should');

describe('Memory Bundle', function() {

	describe('addUpdateQuery', function() {
		it('can add an update query', function() {
			(function() {
				var bundle = memorybundle();
				bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			}).should.not.throwError();
		});

		it('throws an error on an invalid version', function() {
			(function() {
				var bundle = memorybundle();
				bundle.addUpdateQuery("example", "bleh", "CREATE SCHEMA example");
			}).should.throwError(/version/i);
		});

		it('can overrwrite an update query', function(done) {
			var bundle = memorybundle();

			(function() {
				bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
				bundle.addUpdateQuery("example", "1.0.0", "overwritten");
			}).should.not.throwError();

			bundle.getUpdateQuery('example', '1.0.0', function(err, query) {
				should.not.exist(err);
				query.should.eql('overwritten');

				done();
			});
		});
	});

	describe('getProducts', function() {
		it('returns the correct products - empty', function() {
			var bundle = memorybundle();
			var products = bundle.getProducts();
			products.should.eql([]);
		});

		it('returns the correct products - single product', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			var products = bundle.getProducts();
			products.should.eql(["example"]);
		});

		it('returns the correct products - single product, multiple versions', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.addUpdateQuery("example", "1.0.1", "CREATE TABLE example.table ()");
			var products = bundle.getProducts();
			products.should.eql(["example"]);
		});

		it('returns the correct products - multiple products', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.addUpdateQuery("example", "1.0.1", "CREATE TABLE example.table ()");
			bundle.addUpdateQuery("other", "2.0.0", "CREATE SCHEMA other");
			var products = bundle.getProducts();
			products.should.eql(["example", "other"]);
		});
	});

	describe('getVersions', function() {
		it('throws an error for non-existent product', function() {
			var bundle = memorybundle();
			(function() {
				bundle.getVersions("example");
			}).should.throwError();
		});

		it('returns the correct versions - single product', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			var versions = bundle.getVersions("example");
			versions.should.eql(["1.0.0"]);
		});

		it('returns the correct versions - single product, multiple versions', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.addUpdateQuery("example", "1.0.1", "CREATE TABLE example.table ()");
			var versions = bundle.getVersions("example");
			versions.should.eql(["1.0.0", "1.0.1"]);
		});

		it('returns the correct versions - multiple versions', function() {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.addUpdateQuery("example", "1.0.1", "CREATE TABLE example.table ()");
			bundle.addUpdateQuery("other", "2.0.0", "CREATE SCHEMA other");
			var versions = bundle.getVersions("other");
			versions.should.eql(["2.0.0"]);
		});
	});

	describe('getUpdateQuery', function() {
		it('returns the correct data', function(done) {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.getUpdateQuery("example", "1.0.0", function(err, query) {
				should.not.exist(err);
				query.should.match(/CREATE SCHEMA example/);

				done();
			});
		});

		it('returns error for an invalid product', function(done) {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.getUpdateQuery("nonexistent", "1.0.0", function(err, query) {
				should.exist(err);

				done();
			});
		});

		it('returns error for an invalid version', function(done) {
			var bundle = memorybundle();
			bundle.addUpdateQuery("example", "1.0.0", "CREATE SCHEMA example");
			bundle.getUpdateQuery("example", "47.0.0", function(err, query) {
				should.exist(err);

				done();
			});
		});
	});
});

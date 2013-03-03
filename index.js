"use strict";

function MemoryBundle() {
	this.data = {};
}
MemoryBundle.prototype.addUpdateQuery = function(productName, version, query) {
	if (!this.data[productName]) {
		this.data[productName] = {};
	}
	this.data[productName][version] = query;
};
MemoryBundle.prototype.getProducts = function() {
	return Object.keys(this.data);
};
MemoryBundle.prototype.getVersions = function(productName) {
	var product = this.data[productName];
	if (!product) {
		throw new Error("Product '" + productName + "' does not exist.");
	}

	return Object.keys(product);
};
MemoryBundle.prototype.getUpdateQuery = function(productName, version, callback) {

	var product = this.data[productName];
	if (!product) {
		return callback(new Error("Product '" + productName + "' does not exist."));
	}

	var query = product[version];
	if (!query) {
		return callback(new Error("Version '" + productName + "@" + version + "' does not exist."));
	}

	process.nextTick(function() {
		callback(null, query);
	});
};

module.exports = function() {
	return new MemoryBundle();
};

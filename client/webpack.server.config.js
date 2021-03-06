﻿const path = require('path');
const webpack = require('webpack');


var fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules').filter(function (x) {
	return ['.bin', '.cache', '@types'].indexOf(x) === -1;
}).forEach(function (mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
	mode: 'none',
	entry: { server: './server.ts' },
	resolve: { extensions: ['.js', '.ts'] },
	target: 'node',
	// Make sure we include all node_modules etc
	externals: [/node_modules/],
	// externals: nodeModules,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{ test: /\.ts$/, loader: 'ts-loader' },
			{
				// Mark files inside `@angular/core` as using SystemJS style dynamic imports.
				// Removing this will cause deprecation warnings to appear.
				test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
				parser: { system: true }
			}
		]
	},
	plugins: [
		// Temporary Fix for issue: https://github.com/angular/angular/issues/11580
		// for "WARNING Critical dependency: the request of a dependency is an expression"
		new webpack.ContextReplacementPlugin(
			/(.+)?angular(\\|\/)core(.+)?/,
			path.join(__dirname, 'src'), // location of your src
			{} // a map of your routes
		),
		new webpack.ContextReplacementPlugin(
			/(.+)?express(\\|\/)(.+)?/,
			path.join(__dirname, 'src'),
			{}
		)
	]
};

/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
//const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var argv = require('minimist')(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const output = (isWeb ? 'build/web' : 'build/electron');
var nodeExternals = require('webpack-node-externals');

let options ={
	module: {
		rules: [{
			test: /\.tsx?$/,
			loaders: ['ts-loader'],
			exclude: /node_modules/,
			include: [
				path.resolve(__dirname, "src")
			],
		},
		{
			test: /\.jsx?$/,
			//loaders: ['babel'],
			exclude: /node_modules/,
			include: [
				path.resolve(__dirname, "src")
			],
			use: [
				 {
			      loader: 'babel-loader',
			      options: {
			        babelrc: false,
			        presets: [
			          'es2015',
			          'react'
			        ]
			      }
			    }]
		}
	]
	},
	output: {
		path: path.join(__dirname, output),
		publicPath: path.join(__dirname, 'src'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', /*'.ts', '.tsx',*/ '.jsx', '.js'],
		//packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
	},
	context: path.join(__dirname, 'src'),
	entry: './ProcessController.js',
	target: 'electron-renderer',
	externals: [ nodeExternals()
		/*(function () {
			var IGNORES = [
				'electron'
			];
			return function (context, request, callback) {
				if (IGNORES.indexOf(request) >= 0) {
					return callback(null, "require('" + request + "')");
				}
				return callback();
			};
		})()*/
	]

};

//options.target = webpackTargetElectronRenderer(options);

module.exports = options;

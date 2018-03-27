var copyWebpackPlugin = require("copy-webpack-plugin");
var path = require('path');

module.exports = {
	entry: {
		bundle: './App/index.tsx'
	},
	
	output: {
		filename: 'bundle/[name].js',
		path: path.resolve(__dirname, "")
	},
	
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		alias: {
			'App': path.resolve(__dirname, "App/"),
			'Server': path.resolve(__dirname, "Server/"),
			'Schema': path.resolve(__dirname, "Schema/")
		},
		extensions: [".tsx", ".ts", ".js"]
	},
	plugins: [
		new copyWebpackPlugin([{
			from: './node_modules/classui/assets/font-awesome',
			to: './bundle/font-awesome'
		}])
	],
	mode: "development",

	devtool: 'source-map',
	
	devServer: {
		host: '0.0.0.0',
		historyApiFallback: true
	}
};
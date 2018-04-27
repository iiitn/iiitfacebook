var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: {
		"server.bundle": './Server/index.ts'
	},
	
	output: {
		filename: 'bundle/[name].js',
		path: path.resolve(__dirname, "")
	},
	target: "node",
	externals: [nodeExternals({
		whitelist: ["classui"]
	})],
	
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},
	devtool: 'none',
	resolve: {
		alias: {
			'App': path.resolve(__dirname, "App/"),
			'Server': path.resolve(__dirname, "Server/"),
			'Schema': path.resolve(__dirname, "Schema/")
		},
		extensions: [".tsx", ".ts", ".js"]
	},
	mode: "development"
};
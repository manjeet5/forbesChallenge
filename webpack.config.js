const path = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: __dirname + '/main.js',
	output:{
		path : __dirname + '/build',
		filename:'webpack-bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:['babel-loader']
			}
		]
	},
		plugins:[
			new CleanWebpackPlugin('build'),
			new HtmlWebpackPlugin({
				title:'Flick API',
				filename:'index.html',
				template:'./index.html'
			})
		]
}

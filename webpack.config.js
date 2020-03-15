const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	// plugins: [
	// 	new MiniCssExtractPlugin({
	// 		// Options similar to the same options in webpackOptions.output
	// 		// both options are optional
	// 		filename: '[name].css',
	// 		// chunkFilename: '[id].css',
	// 	}),
	// ],
	entry: [
		'./src/scss/styles.scss',
		// './src/js/index.js',
	],
	// entry: {
	// 	'js/main.js': './src/js/index.js',
 //        // 'css/styles.css': './src/scss/styles.scss'
	// },
	output: {
		// filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
		inline: true,
        port: 3000,
	},
	module: {
		rules: [{
			test: /\.(s)css$/,
			use: [
				

				process.env.NODE_ENV !== 'production'
		            ? 'style-loader'
		            : MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
					},
				},
				{
					loader: 'sass-loader',
					options: {
						sourceMap: true,
					},
				},
			],
		}],
	},
};
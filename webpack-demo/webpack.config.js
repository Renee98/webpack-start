const fs = require('fs');
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	mode: "development", //配置相应环境  development/production/none  使用默认的优化
	// 默认支持http，可以配置https
	devServer: {
		// contentBase: path.join(__dirname, './dist'),
		port: 8000,
		open: true,
		// host:'0.0.0.0',
		// proxy: {
		// 	'api': {
		// 		target: 'http://localhost:3000',
		// 		pathRewrite: { '^/api': '' }
		// 	}
		// }
		https: {
			key: fs.readFileSync('./cert-key.pem'),
			cert: fs.readFileSync('./cert.pem'),
		}
	},
	entry: {
		main: ["@babel/polyfill", "./src/js/index.js"],
		app: ["./src/js/app.js"],
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].js", // [name] 多页面的时候方便管理
		// publicPath: "/dist/" 
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				enforce: "pre", // ESLint 优先级高于其他 JS 相关的 loader
				test: /\.(jsx|js)$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
			},
			{
				test: /\.(jsx|js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					// options: {
					// 	presets: ['@babel/preset-env', '@babel/preset-react']
					// }
				}
			},
			{
				test: /\.css$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192,
							fallback: "file-loader"
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							publicPath: "assets",
							outputPath: "images",
							name: "[path][name].[ext]"
						}
					}
				]
			},
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "./src/images/pic.png"),
				to: path.resolve(__dirname, "dist/images/pic.png"),
				ignore: [".*"]
			}
		]),
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(true),
			VERSION: JSON.stringify('5fa3b9'),
			BROWSER_SUPPORTS_HTML5: true,
			TWO: '1+1',
			'typeof window': JSON.stringify('object'),
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			}
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "index.html",
			inject: true,
			minify: {
				removeComments: true, //去掉注释
				collapseWhitespace: true, //去掉空行
				removeAttributeQuotes: true //移除属性的引号
			},
			chunks: ['main']
		}),
		new HtmlWebpackPlugin({
			template: "./src/app.html",
			filename: "app.html",
			inject: true,
			minify: {
				removeComments: true, //去掉注释
				collapseWhitespace: true, //去掉空行
				removeAttributeQuotes: true //移除属性的引号
			},
			chunks: ['app']
		}),
	]
};

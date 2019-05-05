const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// webpack 4
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 使用uglifyjs压缩
// const UnlifyJsPlugin = require('uglifyjs-webpack-plugin');
// 使用terser压缩
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "production", //配置相应环境  development/production/none  使用默认的优化
    entry: {
        main: ["@babel/polyfill", "./src/js/index.js"],
        app: ["./src/js/app.js"],
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js", // [name] 多页面的时候方便管理
        // chunkFilename: '[name].bundle.js', // 代码分割后输出的文件名
        // publicPath: "/dist/" 
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    //在生产环境中有助于代码调试
    devtool: 'source-map',
    optimization: {
        // 默认的基础配置
        splitChunks: {
            chunks: 'all',// 选择哪些块进行优化 all async initial
            minSize: 30000, // 要生成的块的最小字节
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5, //按需加载时最大并行请求数
            maxInitialRequests: 3, // 入口点处最大并行请求数
            automaticNameDelimiter: '~',
            name: true, // 拆分块的名称 true  自动生成（块和缓存组密钥）
            //模块可以属于多个缓存组。优化将更喜欢具有更高的缓存组priority。
            //默认组的优先级为负，以允许自定义组采用更高的优先级（默认值适用0于自定义组）。
            cacheGroups: {
                // 包括node_modules整个应用程序中的所有代码(第三方)
                vendors: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/, //符合就提取 chunk
                    name: "vendor", //分隔出来的 chunk 名称
                    reuseExistingChunk: true   // 可设置是否重用已用chunk 不再创建新的chunk
                },
            }
        },
        // 配置压缩方式  production 模式下默认为true
        minimizer: [
            // new UnlifyJsPlugin({
            // 	test: /\.js(\?.*)?$/i,
            // 	exclude: /node_modules/,
            // 	cache: true,
            // 	sourceMap: true,
            // 	beautify: true,
            // 	parallel: true,
            // })
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    warnings: false,
                    compress: false, // 完全跳过压缩
                    parse: {}, // 解析选项
                    ie8: false, // 设置true为支持IE8
                }
            })
        ]
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
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        },
                    },
                    "css-loader"
                ]
            },
            // {
            //     test: /\.css$/,
            //     use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            //     exclude: /node_modules/,
            // },
            // {
            // 	test: /\.css$/,
            // 	use: [
            // 		{
            // 			loader: "style-loader",
            // 			options: {
            // 				// 禁用热模块更换 适用于非本地开发和生产环境
            // 				// hmr: false, 
            // 				//设置模版ID
            // 				base: 1000,
            // 				attrs: {
            // 					id: 'hhh'
            // 				}
            // 			}
            // 		},
            // 		"css-loader"
            // 	],
            // 	exclude: /node_modules/
            // },
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
            // PRODUCTION: JSON.stringify(true),
            // VERSION: JSON.stringify('5fa3b9'),
            // BROWSER_SUPPORTS_HTML5: true,
            // TWO: '1+1',
            // 'typeof window': JSON.stringify('object'),
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
            // chunks: ['main', 'vendors']
            chunks: ['main', 'vendor']
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
            chunks: ['app', 'vendor']
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            Components: path.resolve(__dirname, 'src/components/'),
            Container: path.resolve(__dirname, 'src/container/'),
            Pages: path.resolve(__dirname, 'src/pages/'),
            Config: path.resolve(__dirname, 'src/config/'),
            Store: path.resolve(__dirname, 'src/store/'),
            Resource: path.resolve(__dirname, 'src/resource/'),
            Routes: path.resolve(__dirname, 'src/routes/'),
            Util: path.resolve(__dirname, 'src/util/'),
        }
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // 可以把css放在页面上
                    },
                    {
                        loader: 'css-loader' // 放在后面的先被解析
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                return path.relative(
                                    path.join(__dirname, 'src'),
                                    file
                                );
                            }
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/public/favicon.ico'
        }),
        new CleanWebpackPlugin({ template: './src/index.html' }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

var baseConf = {
    context: path.join(__dirname),
    entry: {
        main: './web/app.js',
        vendor: [
            'bootstrap/js/dist/util',
            'bootstrap/js/dist/alert',
            'bootstrap/js/dist/button',
            'bootstrap/js/dist/carousel',
            'bootstrap/js/dist/collapse',
            'bootstrap/js/dist/dropdown',
            'bootstrap/js/dist/modal',
            'bootstrap/js/dist/tooltip',
            'bootstrap/js/dist/popover',
            'bootstrap/js/dist/scrollspy',
            'bootstrap/js/dist/tab',
            '@fancyapps/fancybox/dist/jquery.fancybox'
        ]
    },
    optimization: {
        splitChunks: {
        chunks: "async",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
            },
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            }
}
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            emitFile: false, // copy loaded files in css
                            useRelativePath: true,
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    useRelativePath: true,
                    removeScriptTypeAttributes: true,
                    removeStyleTypeAttributes: true
                }
            },
            {
                test: /\.(woff2?|ttf|otf|eot|svg)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    useRelativePath: true,
                    emitFile: false,
                    name: '[name].[ext]'
                }
            },
            {
                test: /(\.css$)/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ //Generate index.html
            template: 'web/index.html'
        }),
        new CleanWebpackPlugin(['dist']),
         new CopyWebpackPlugin([
                {from: 'css/**/*'}
            ],
            {
                ignore: ['*.scss']
            }
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        })
    ]
};


var webConf = merge(baseConf, {
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    }
});



module.exports = [
    webConf
];
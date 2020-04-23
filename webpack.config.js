const path = require('path');

var htmlWebPlugin = require('html-webpack-plugin');
var htmlWebConfig = new htmlWebPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build'
    },
    resolve: {
        // alias: {
        //     ProjModules: path.resolve(__dirname, 'src/'),
        //     NodeModules: path.resolve(__dirname, 'node_modules/')
        // },
        modules: [path.resolve(__dirname, 'src'),path.resolve(__dirname, 'node_modules/')],
        extensions: ['.ts', '.js', '.png', '.jpg', '.json']
    },
    module: {
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                // the loader which should be applied, it'll be resolved relative to the context
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|jpe?g|gif|mp3)$/i,
                loader: "file-loader",
                // the loader which should be applied, it'll be resolved relative to the context
                exclude: '/node_modules/',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.script\.js$/,
                loader: "script-loader",
                // the loader which should be applied, it'll be resolved relative to the context
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [htmlWebConfig],
}
const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: 'haijack.js',
    },
    // plugins: [
    //     new webpack.LoaderOptionsPlugin({
    //         options: {
    //             is: 'is'
    //         }
    //     })
    // ]
}
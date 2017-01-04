var path = require('path');
var morgan = require('morgan');
var express = require('express');
var fs = require('fs');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var config = require('./webpack.config.js');
var compiler = webpack(config);

var app = express();

const PORT = 3330;

app.use(morgan('dev')); // this is for logging it is for automated
                        // logging of requests, responses and related data

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

// webpackDevMiddleware What is it?
// It's a simple wrapper middleware for webpack. It serves the files emitted from webpack over a connect server.
//
// It has a few advantages over bundling it as files:
//
// No files are written to disk, it handle the files in memory
// If files changed in watch mode, the middleware no longer serves the old bundle, but delays requests until the compiling has finished. You don't have to wait before refreshing the page after a file modification.
// I may add some specific optimization in future releases.


app.use(express.static('./dist/'));

// express.static is used when using static files

app.get('*', function (req, res) {
  var indexFilePath = path.resolve(__dirname, './dist/', 'index.html');
  if(fs.existsSync(indexFilePath)) {
    res.sendFile(indexFilePath)
  }
  indexFilePath = path.resolve(__dirname, './src/', 'index.html');
  res.sendFile(indexFilePath)
});

/*
Above I am checking index.html file is present in /dist/ or not
If not present it is been invoked with webpack.dev.config
*/

app.listen(PORT, function(err) {
  if(err) {
    return console.error(err);
  }

console.log('app running on', PORT);

});

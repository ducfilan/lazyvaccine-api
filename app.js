var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
require('./routes')(app);

// Listen config
// TODO: Get config and start server
// TODO: Auto restart server when source code changed
const port = 8080
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})

// Export for outside usage, such as unit testing
module.exports = app;

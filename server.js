var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var config      = require('./app/config');

var mongoose    = require('mongoose');
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.port;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Index Page' });
});

app.use(express.static('src'));

app.use('/', router);

var authenticateRouter  = require('./app/routes/authenticate');
var authorizeRouter     = require('./app/routes/authorize');
var coDataRouter        = require('./app/routes/co-data');
var countryDataRouter   = require('./app/routes/country-data');
var gameRouter          = require('./app/routes/game');
var unitDataRouter      = require('./app/routes/unit-data');
var userRouter          = require('./app/routes/user');

app.use('/' + config.apiPathPrefix + '/authenticate', authenticateRouter);
app.use(authorizeRouter);
app.use('/' + config.apiPathPrefix + '/cosData', coDataRouter);
app.use('/' + config.apiPathPrefix + '/countriesData', countryDataRouter);
app.use('/' + config.apiPathPrefix + '/games', gameRouter);
app.use('/' + config.apiPathPrefix + '/unitsData', unitDataRouter);
app.use('/' + config.apiPathPrefix + '/users', userRouter);

app.listen(port);
console.log('Listening on port ' + port);
var authorityRole = require('./authorityRole.json');

var config = {
	dev: 'dev',
	prod: 'prd',
	test: 'test',
	port: process.env.PORT || 8080,
	expireTime: 25 * 60,

	// Config authentication & authorization
	secrets: {
		jwt: process.env.JWT || 'lean-learn-api-2019'
	},
	authorizationPath: authorityRole
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

try {
	envConfig = require('./' + config.env) || {};
} catch (e) {
	envConfig = {};
}

// Merge base configurations and environment dependent configurations
module.exports = _.merge(config, envConfig);

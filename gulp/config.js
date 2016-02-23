export default {
	/**
	 * Environment variables
	 */
	env: {
		production: process.env.NODE_ENV === 'production',
		development: process.env.NODE_ENV === 'development',
	},

	/**
	 * Config for nodemon
	 */
	nodemon: {
		script: 'server/app.js',
		ignore: [
			'gulp',
			'node_modules',
			'package.json',
		],
	},

};

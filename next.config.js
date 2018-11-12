const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin')
const withCss = require('@zeit/next-css')

module.exports = withCss({
	webpack: (config, { buildId, dev }) => {
		/**
		 * Install and Update our Service worker
		 * on our main entry file :)
		 * Reason: https://github.com/ooade/NextSimpleStarter/issues/32
		 */
		const oldEntry = config.entry

		config.entry = () =>
			oldEntry().then(entry => {
				entry['main.js'] &&
					entry['main.js'].push(path.resolve('./utils/offline'))
				return entry
			})


		config.module.rules.push({
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			use: {
				loader: 'url-loader',
				options: {
				limit: 100000,
				publicPath: './',
				outputPath: 'static/',
				name: '[name].[ext]'
				}
			}
		})	
		/* Enable only in Production */
		if (!dev) {
			// Service Worker

			config.plugins.push(
				new WorkboxPlugin.InjectManifest({
					swSrc: path.join(__dirname, 'utils', 'sw.js'),
					swDest: path.join(__dirname, '.next', 'sw.js'),
					globDirectory: __dirname,
					globPatterns: [
						'static/**/*.{png,jpg,ico}' // Precache all static assets by default
					]
				})
			)
		}

		return config
	}
})

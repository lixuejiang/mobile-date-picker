/**
 * Created by chenlin on 2017/5/9.
 */
module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
				})
	]
}

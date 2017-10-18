const utils = require('./util');
module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: false,
        extract: true
    })
}

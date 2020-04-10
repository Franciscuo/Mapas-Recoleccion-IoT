const helpers = {};

helpers.equal = function(a, b, options) {
    if (a != b) {
        return options.inverse(this);
    }
    return options.fn(this);
};

helpers.notEqual = function(a, b, options) {
    if (a != b) {
        return options.fn(this);
    }
    return options.inverse(this);
};
module.exports = helpers;
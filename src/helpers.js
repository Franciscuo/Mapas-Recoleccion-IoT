const moment = require('moment');

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

helpers.compare = function(number1, operation, number2, options) {
    number1 = Number(number1);
    number2 = Number(number2);
    if (operation == '>') {
        if (number1 > number2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    } else {
        if (operation == '<') {
            if (number1 < number2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
    if (operation == '>>') {
        if (number1 > (number2 + 1)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
};


helpers.math = (number1, operation, number2) => {
    number1 = Number(number1);
    number2 = Number(number2);
    if (operation == '+') {
        return number1 + number2;
    } else {
        if (operation == '-') {
            return number1 - number2;
        } else {
            return 0;
        }
    }
};


helpers.timeago = timestamp => {
    return moment(timestamp).format('LL');

};

helpers.timeago2 = timestamp => {
    return moment(timestamp).startOf('minute').fromNow();

};
helpers.timeagoLong = date => {
    return moment(date).format('YYYY/MM/DD');
};



module.exports = helpers;
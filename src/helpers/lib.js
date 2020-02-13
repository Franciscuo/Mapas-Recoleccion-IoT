const helpers = {};

helpers.randomNumber = () => {
    let randomNumber = 0;
    const possible = 'abcdefghijklmnopqrstuvwxyz1234567890';
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return randomNumber;
};

helpers.randomPIN = () => {
    let randomNumber = 9;
    const possible = '1234567890';
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
};

module.exports = helpers;
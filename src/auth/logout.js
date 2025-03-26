const jwt = require('jsonwebtoken');
const db = require('../database/database');
const path = require('path-browserify');

module.exports = function (app) {
    app.post('/logout', (req, res) => {
        console.log('POST /logout');
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        res.status(200).send('Logout successful');
    });
}
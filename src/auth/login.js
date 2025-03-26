const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/database');
const path = require('path-browserify');

const secretKey = process.env.JWT_SECRET;

module.exports = function (app) {
    app.post('/login', (req, res) => {
        console.log("POST /login");
        const { username, password } = req.body;

        db.get("SELECT * FROM user WHERE username = ?", [username], (err, user) => {
            if (err || !user) {
                return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
            }

            if (password === user.password) {
                // Génère un token JWT
                const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '7d' });
                res.cookie('jwtToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    path: '/'
                 });
                res.status(200).send('Login successful');
            } else {
                return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
            }

            // bcrypt.compare(password, user.password, (err, isMatch) => {
            //     if (err || !isMatch) {
            //         return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
            //     }

            //     // Génère un token JWT
            //     const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '7d' });
            //     res.json({ token });
            // });
        });
    });
}
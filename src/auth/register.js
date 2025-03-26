const bcrypt = require('bcryptjs');
const db = require('../database/database');


module.exports = function (app) {
    app.post('/register', async (req, res) => {
        const { username, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run("INSERT INTO user (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
                if (err) {
                    return res.status(400).json({ message: 'Erreur lors de l\'inscription' });
                }
                res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
            });
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    });
}
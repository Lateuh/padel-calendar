const authenticateJWT = require('../auth/auth');
const db = require('../database/database');

module.exports = function (app) {
    // Point de terminaison pour obtenir toutes les notifications
    app.get('/notifications', (req, res) => {
        console.log("GET /notifications");
        db.all("SELECT * FROM notification", (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "notifications": rows });
        });
    });

    // Point de terminaison pour ajouter une notification
    app.post('/notifications', authenticateJWT, (req, res) => {
        const { date } = req.body;
        console.log("POST /notifications/" + date);
        db.run("INSERT INTO notification (date) VALUES (?)", [date], function (err) {
            if (err) {
                res.status(500).json({ "error": "Erreur BDD lors de l'ajout d'une notification " + err.message });
                throw err;
            }
            res.status(201).send();
        });
    });

    // Point de terminaison pour supprimer une notification
    app.delete('/notifications/:date', authenticateJWT, (req, res) => {
        console.log("DELETE /notifications/", req.params.date);
        db.run("DELETE FROM notification WHERE date = ?", req.params.date, function (err) {
            if (err) {
                res.status(500).json({ "error": 'Erreur BDD ' + err.message });
                throw err;
            }
            res.send();
        });
    });

    // Point de terminaison pour supprimer toutes les notifications obsolètes
    app.delete('/notifications', (req, res) => {
        console.log("DELETE /notifications");
        db.run("DELETE FROM notification WHERE date < date('now')", function (err) {
            if (err) {
                res.status(400).json({ "error": "Erreur lors du nettoyage des notifications passées" + err.message });
                return;
            }
            res.send();
        });
    });
}

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.CALENDAR_BACK_PORT || 5000;
const ip = require('ip');
const db = require('./src/database/database');

app.use(cors());
app.use(express.json());



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
app.post('/notifications', (req, res) => {
    console.log("POST /notifications");
    const { date } = req.body;
    db.run("INSERT INTO notification (date) VALUES (?)", [date], function (err) {
        if (err) {
            res.status(400).json({"error":"Erreur lors de l'ajout d'une notification " + err.message });
            return;
        }
        res.json({ "created": this.lastID });
    });
});

app.delete('/notifications/:date', (req, res) => {
    console.log("DELETE /notifications/", req.params.date);
    db.run("DELETE FROM notification WHERE date = ?", req.params.date, function (err) {
        if (err) {
            res.status(400).json({ "error": res.message });
            return;
        }
        res.json({ "deleted": this.changes });
    });
});

app.delete('/notifications', (req, res) => {
    console.log("DELETE /notifications");
    db.run("DELETE FROM notification WHERE date < date('now')", function(err) {
        if (err) {
          res.status(400).json({"error":"Erreur lors du nettoyage des notifications passées" + err.message});
          return;
        }
        res.json({"message": "Notifications obsolètes supprimées", "changes": this.changes});
      });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur https://${ip.address()}:${port}`);
});

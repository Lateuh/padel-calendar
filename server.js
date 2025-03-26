const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.CALENDAR_BACK_PORT || 5000;
const ip = require('ip');
const cookieParser = require('cookie-parser');

app.use(cors({ 
    origin: process.env.DOMAIN_NAME_CLIENT,
    credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

require('./src/notification/notification')(app);
require('./src/auth/login')(app);
require('./src/auth/logout')(app);
// require('./src/auth/register')(app); // Pas implémenté et pas utile pour l'instant

app.listen(port, () => {
    console.log(`Serveur démarré sur https://${ip.address()}:${port}`);
});

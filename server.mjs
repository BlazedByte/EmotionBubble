import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

import * as database from './database.mjs';

const PORT = 80;
const IP = '127.0.0.1'
const app = express();
// Gestion du chemin pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration d'EJS comme moteur de rendu
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: crypto.randomBytes(12).toString('hex'),
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));




function tosha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function getTodaysDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
}

function dateDelta(date, deltaJours) {
    let dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + deltaJours);
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
}

async function authenticateUser(username, passwordHash) {
    let user = await database.chechAuth(username, passwordHash);
    return user;
}

async function getUser(username) {
    let user = await database.getUser(username);
    return user;
}

async function registrationUser(user) {

    let user_get = await getUser(user.username);

    if (user_get) {
        return false;
    } else {
        database.insertUser(user);
        return true;
    }
}

async function getTodayRecord(username) {
    let record = await database.getRecords(username, 1);
    if (record.length == 0 || record[0].date != getTodaysDate()) {
        return {
            mood: null,
            weather: null,
        };
    }
    return record[0];
}

async function getLastRecords(username) {
    let records = await database.getRecords(username, 31);
    let days = [];
    for (let i = 1; i < 31; i++) {
        let date = dateDelta(getTodaysDate(), -i);
        let record = records.find((r) => r.date == date);
        if (record) {
            days.push(record);
        } else {
            days.push({
                mood: null,
                weather: null,
                date: date,
                visibility: 0,
                title: null,
                content: null
            });
        }
    }
    return days;
}

async function getAllRecords(username) {
    let records = await database.getRecords(username);
    if (records.length == 0) {
        return [];
    }
    return records;
}



// Page d'accueil
app.get('/', (req, res) => {
    res.render('index', {user: req.session});
});

// Page de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Page de register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'));
});

// Dashboard
app.get('/dashboard', async (req, res) => {
    if (req.session.username) {
        res.render('dashboard', {
            user: req.session,
            today : await getTodayRecord(req.session.username),
            jours : await getLastRecords(req.session.username)
        });
    } else {
        res.redirect('/login');
    }
});

// Historique
app.get('/historique', async (req, res) => {
    if (req.session.username) {
        res.render('history', {
            user: req.session,
            jours : await getAllRecords(req.session.username)
        });
    } else {
        res.redirect('/login');
    }
});

// Page de login
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});




// Login POST
app.post('/login-post', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hash = tosha256(password);

    const auth = await authenticateUser(username, hash);

    if (auth) {
        req.session.username = auth.username;
        req.session.admin = auth.admin;
        req.session.name = auth.name;
        req.session.friends = auth.friends;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Register POST
app.post('/register-post', async (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const password2 = req.body.passwordrepeat;
    const hash = tosha256(password);

    const reg = await registrationUser({
        username: username,
        name: name,
        password: hash,
        admin: 0,
        friends: [],
    });

    if (reg) {
        res.redirect('/login');
    } else {
        res.redirect('/register');
    }
});



app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

app.listen(PORT, IP, () => {
    console.log(`Serveur lancé sur http://${IP}:${PORT}`);
});
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

import * as database from './modules/database.js';
import { ERROR_MESSAGES } from './modules/errors.js';
import { tosha256, getTodaysDate, dateDelta } from './modules/tools.js';

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





async function registrationUser(user) {

    let user_get = await database.getUser(user.username);

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

async function getFriends(user) {
    const uid = user.uid;
    const realFriends = [];
    for (let fid of user.friends) {
        const friend = await database.getUserById(fid);
        if (!friend) {
            user.friends = user.friends.filter((f) => f != fid);
        }
        if (friend.friends.includes(uid)) {
            realFriends.push({
                uid: fid,
                name: friend.name,
                username: friend.username
            });
        }
    }
    return realFriends;
}

async function getFriendRequests(user) {
    const uid = user.uid;
    const friendRequests = [];
    for (let fid of user.friends) {
        const friend = await database.getUserById(fid);
        if (!friend) {
            user.friends = user.friends.filter((f) => f != fid);
        }
        if (!friend.friends.includes(uid)) {
            friendRequests.push({
                uid: fid,
                username: friend.username
            });
        }
    }
    return friendRequests;
}



// Page d'accueil
app.get('/', (req, res) => {
    res.render('index', {user: req.session});
});

// Page de login
app.get('/login', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('login', { error : error });
});

// Page de register
app.get('/register', (req, res) => {
    const error = req.session.error;
    req.session.error = null;
    res.render('register', { error : error });
});

// Dashboard
app.get('/dashboard', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    res.render('dashboard', {
        user: req.session,
        todaysDate : getTodaysDate(),
        today : await getTodayRecord(req.session.username),
        jours : await getLastRecords(req.session.username)
    });
});

// Historique
app.get('/historique', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    res.render('history', {
        user: req.session,
        friend : null,
        jours : await getAllRecords(req.session.username)
    });
});

// Gestion du logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Page de nouvel enregistrement
app.get('/new', (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const dateR = req.query.date;
    res.render('formrecord', {
        error : null,
        record : {
            date : dateR,
            mood : null,
            weather : null,
            visibility : 0,
            title : null,
            content : null
        },
    });
});

// Page de consultation
app.get('/consulter', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const dateR = req.query.date;
    const recordR = await database.getRecordByDate(req.session.username, dateR);
    if (recordR) {
        res.render('consultrecord', {
            error : null,
            record : recordR,
        });
    } else {
        res.render('consultrecord', {
            error : ERROR_MESSAGES.NO_RECORD_FOR_DATE,
            record : {
                date : dateR,
                mood : null,
                weather : null,
                visibility : 0,
                title : null,
                content : null
            },
        });
    }
});

// Modification d'enregistrement
app.get('/modif-record', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const dateR = req.query.date;
    const recordR = await database.getRecordByDate(req.session.username, dateR);
    if (recordR) {
        res.render('formrecord', {
            error : null,
            record : recordR,
        });
    } else {
        res.redirect('/new?date=' + dateR);
    }
});

// Suppression d'enregistrement
app.get('/delete-record', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const dateR = req.query.date;
    const recordR = await database.getRecordByDate(req.session.username, dateR);
    if (recordR) {
        database.deleteRecord(recordR.id);
        res.redirect('/dashboard');
    } else {
        res.redirect('/consulter?date=' + dateR);
    }
});

// Profil
app.get('/profil', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const error = req.session.error;
    req.session.error = null;
    
    res.render('profile', {
        error : error,
        user: req.session,
        friends : await getFriends(req.session),
        friendRequests : await getFriendRequests(req.session)
    });
});

// Administration
app.get('/admin', async (req, res) => {

    if (!req.session.admin) {
        req.session.error = ERROR_MESSAGES.ADMIN_ONLY;
        res.redirect('/login');
        return;
    }

    res.render('admin', {
        error: null,
    });
});

// Page d'ami
app.get('/ami', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const friend = await database.getUser(req.query.username);

    res.render('history', {
        user: req.session,
        friend : friend,
        jours : (await getAllRecords(req.query.username)).filter((r) => r.visibility == 1)
    });
});

// Suppression d'ami
app.get('/delete-friend', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const friend_username = req.query.username;
    const friend = await database.getUser(friend_username);
    const friend_id = friend.id;
    await database.deleteFriend(req.session.uid, friend_id);

    req.session.friends = req.session.friends.filter((f) => f != friend_id);
    req.session.error = ERROR_MESSAGES.FRIEND_DELETED;
    res.redirect('/profil');
});





// Login POST
app.post('/login-post', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hash = tosha256(password);

    const auth = await database.chechAuth(username, hash);

    if (auth) {
        req.session.username = auth.username;
        req.session.admin = auth.admin;
        req.session.name = auth.name;
        req.session.friends = auth.friends;
        req.session.uid = auth.id;
        res.redirect('/dashboard');
    } else {
        req.session.error = ERROR_MESSAGES.AUTH_FAILED;
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

    if (password != password2) {
        req.session.error = ERROR_MESSAGES.PWDS_NOT_MATCH;
        res.redirect('/register');
        return;
    }

    if (username == '' || name == '' || password == '') {
        req.session.error = ERROR_MESSAGES.MISSING_FIELDS;
        res.redirect('/register');
        return;
    }

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
        req.session.error = ERROR_MESSAGES.USERNAME_USED;
        res.redirect('/register');
    }
});

// Modification / Création POST
app.post('/modification-post',  async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const date = req.body.date;
    const mood = req.body.mood;
    const weather = req.body.weather;
    let visibility = req.body.visibility;
    const title = req.body.title;
    const content = req.body.content;
    if (!visibility) {
        visibility = 0;
    } else {
        visibility = 1;
    }

    const dateRecord = await database.getRecordByDate(req.session.username, req.body.date);

    const record = {
        userid : req.session.uid,
        date : date,
        mood : mood,
        weather : weather,
        visibility : visibility,
        title : title,
        content : content
    }

    if (dateRecord) {
        database.updateRecord(record);
    } else {
        database.insertRecord(record);
    }

    res.redirect('/dashboard');
});

// Modification du profil POST
app.post('/update-profile-post', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const username = req.body.username;
    const name = req.body.name;

    if (username && username != req.session.username) {
        const u = await database.getUser(username);
        if (u) {
            req.session.error = ERROR_MESSAGES.USERNAME_USED;
            res.redirect('/profil');
            return;
        } else {
            req.session.username = username;
        }
    }
    if (name && name != req.session.name) {
        req.session.name = name;
    }

    database.updateUser(req.session.uid, req.session.username, req.session.name);

    req.session.error = ERROR_MESSAGES.PROFILE_UPDATED;
    res.redirect('/profil');
});

// Modification du mdp POST
app.post('/update-profile-password-post', (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const password = req.body.password;
    const password2 = req.body.passwordrepeat;

    if (password != password2) {
        req.session.error = ERROR_MESSAGES.PWDS_NOT_MATCH;
        res.redirect('/profil');
        return;
    }

    const hash = tosha256(password);

    database.updateUserPwd(req.session.uid, hash);

    req.session.error = ERROR_MESSAGES.PASSWORD_UPDATED;
    res.redirect('/profil');
});

// Ajout d'ami POST
app.post('/add-friend-post', async (req, res) => {

    if (!req.session.username) {
        req.session.error = ERROR_MESSAGES.NOT_LOGGED;
        res.redirect('/login');
        return;
    }

    const friend_username = req.body.username;
    const friend = await database.getUser(friend_username);
    const friend_id = friend.id;
    await database.addFriend(req.session.uid, friend_id);

    req.session.friends.push(friend_id);
    req.session.error = ERROR_MESSAGES.FRIEND_ADDED;
    res.redirect('/profil');
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

app.listen(PORT, IP, () => {
    console.log(`Serveur lancé sur http://${IP}:${PORT}`);
});
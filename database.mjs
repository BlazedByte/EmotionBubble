import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    } else {
        console.log('Database opened');
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, name TEXT, password TEXT, admin INTEGER, friends TEXT)');
        db.run('CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY, userid INTEGER, date TEXT, visibility INTEGER, title TEXT, content TEXT, mood INTEGER, weather INTEGER, FOREIGN KEY(userid) REFERENCES users(id))');
    }
});

export function getUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach(element => {
                    element.friends = JSON.parse(element.friends);
                });
                resolve(rows);
            }
        });
    })
}

export function insertUser(user) {
    const query = `
        INSERT INTO users (username, name, password, admin, friends)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
        user.username,
        user.name,
        user.password,
        user.admin,
        JSON.stringify(user.friends)
    ];
    db.run(query, params, (err) => {
        if (err) {
            console.error('Insert user error: ', err);
            return false;
        } else {
            console.log('User inserted successfully');
            return true;
        }
    });
}

export function insertRecord(record) {
    const query = `
        INSERT INTO records (userid, date, visibility, title, content, mood, weather)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        record.userid,
        record.date,
        record.visibility,
        record.title,
        record.content,
        record.mood,
        record.weather
    ];
    db.run(query, params, function(err) {
        if (err) {
            console.error('Insert record error:', err);
            return false;
        } else {
            console.log('Record inserted successfully');
            return true;
        }
    });
}

export function updateRecord(record) {
    const query = `
        UPDATE records
        SET visibility = ?, title = ?, content = ?, mood = ?, weather = ?
        WHERE userid = ? AND date = ?
    `;
    const params = [
        record.visibility,
        record.title,
        record.content,
        record.mood,
        record.weather,
        record.userid,
        record.date
    ];
    db.run(query, params, function(err) {
        if (err) {
            console.error('Update record error:', err);
            return false;
        } else {
            console.log('Record updated successfully');
            return true;
        }
    });
}

export function chechAuth(username, password) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        db.get(query, [username, password], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    row.friends = JSON.parse(row.friends);
                }
                resolve(row);
            }
        });
    });
}

export function getUser(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE username = ?`;
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    row.friends = JSON.parse(row.friends);
                }
                resolve(row);
            }
        });
    });
}

export function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM users WHERE id = ?`;
        db.run(query, [userId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function getRecords(username, limit = undefined) {
    const baseQuery = `SELECT * FROM records WHERE userid = (SELECT id FROM users WHERE username = ?) ORDER BY date DESC`;
    if (limit === undefined) {
        return new Promise((resolve, reject) => {
            db.all(baseQuery, [username], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            const query = `${baseQuery} LIMIT ?`;
            db.all(query, [username, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

export function getRecordByDate(username, date) {
    const query = `SELECT * FROM records WHERE userid = (SELECT id FROM users WHERE username = ?) AND date = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [username, date], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export function deleteRecord(recordId) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM records WHERE id = ?`;
        db.run(query, [recordId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
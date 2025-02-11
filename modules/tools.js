import crypto from 'crypto';

export function tosha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function getTodaysDate() {
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

export function dateDelta(date, deltaJours) {
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
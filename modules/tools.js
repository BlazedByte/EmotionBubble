import crypto from 'crypto';
import fs from 'fs';

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

export function log(message) {
    const date = new Date();
    const time = date.toISOString();
    const logMessage = `[${time}] ${message}`;
    const logFileName = `logs/${getTodaysDate()}.log`;

    console.log(logMessage);
    fs.appendFileSync(logFileName, logMessage + '\n');
}

export function logError(error) {
    const date = new Date();
    const time = date.toISOString();
    const logMessage = `[${time}] <ERROR> ${error}`;
    const logFileName = `logs/${getTodaysDate()}.log`;

    console.error(logMessage);
    fs.appendFileSync(logFileName, logMessage + '\n');
}
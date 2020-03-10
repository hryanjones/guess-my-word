const urlParams = new URLSearchParams(window.location.search);
const useProdBackend = urlParams.get('useProd') === ''
    || window.location.hostname.includes('hryanjones.com'); // includes to allow for beta on home.hryanjones.com

const BOARD_SERVER = useProdBackend
    // ? 'https://home.hryanjones.com'
    ? 'https://ec2.hryanjones.com'
    : 'http://192.168.0.144:8080';
// const BOARD_SERVER = 'https://hryanjones.builtwithdark.com';
// const BAD_NAMES_SERVER = 'https://hryanjones.builtwithdark.com/gmw/bad-names';

const UNKNOWN_LEADERBOARD_ERROR = 'Sorry, the completion board is having trouble right now. Please try again in a little bit. (contact @hryanjones if it persists)';


function makeLeaderboardRequest(timezonelessDate, wordlist, onSuccess, onFailure, postData, extraURL = '') {
    const url = `${BOARD_SERVER}/leaderboard/${timezonelessDate}/wordlist/${wordlist}${extraURL}`;
    return makeRequest(url, onSuccess, onFailure, postData);
}

function makeRequest(url, onSuccess, onFailure, postData) {
    let responseStatus;
    let body;
    let method = 'GET';
    let headers;
    if (postData) {
        method = 'POST';
        headers = { 'Content-Type': 'application/json' };
        body = JSON.stringify(postData);
    }

    return fetch(url, {
        method,
        mode: 'cors',
        cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
        headers,
        body,
    })
        .then((response) => {
            responseStatus = response.status;
            return response.json(); // need to send JSON parsing through promise
        })
        .catch(onFailure)
        .then((json) => {
            if (responseStatus !== 200 && responseStatus !== 201) {
                onFailure(json, responseStatus);
                return;
            }
            onSuccess(json);
        });
}


// Utilities

function getTimezonelessLocalDate(date) {
    return `${date.getFullYear()}-${getMonth(date)}-${getMonthDay(date)}`;
}

function getMonth(date) {
    return leftPad((date.getMonth() + 1).toString(), 2);
}

function getMonthDay(date) {
    return leftPad(date.getDate().toString(), 2);
}

function leftPad(string, desiredLength, character = '0') {
    if (string.length === desiredLength) {
        return string;
    }
    return leftPad(character + string, desiredLength);
}

function getFormattedTime(milliseconds) {
    if (!Number.isInteger(milliseconds)) {
        return '';
    }
    let seconds = Math.round((milliseconds) / 1000);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const formattedTime = [];
    if (hours) {
        formattedTime.push(`${hours}h`);
    }
    if (minutes) {
        formattedTime.push(`${minutes}m`);
    }
    if (seconds) {
        formattedTime.push(`${seconds}s`);
    }

    return formattedTime.join(' ') || '0s';
}

function isToday(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return datesMatch(now(), date);
}

function now() {
    return new Date();
}

function datesMatch(date1, date2) { // ignores time
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

// # Local Storage Persistence

const IS_LOCAL_STORAGE_AVAILABLE = testLocalStorage();

function testLocalStorage() {
    // stolen from https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

const SAVED_GAMES_KEYS_BY_DIFFICULTY = {
    normal: 'savedGame_normal',
    hard: 'savedGame_hard',
};

function getSavedGameByDifficulty(difficulty) {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return undefined;
    const savedGameKey = SAVED_GAMES_KEYS_BY_DIFFICULTY[difficulty];
    const savedGameJSON = difficulty && localStorage.getItem(savedGameKey);
    try {
        return savedGameJSON && JSON.parse(savedGameJSON);
    } catch (e) {
        localStorage.removeItem(savedGameKey);
    }
    return undefined;
}

const USERNAMES_USED_KEY = 'usernamesUsed';

function getStoredUserNames() {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return [];
    const usernamesJSON = localStorage.getItem(USERNAMES_USED_KEY);
    try {
        return usernamesJSON && JSON.parse(usernamesJSON) || [];
    } catch (error) {
        return [];
    }
}

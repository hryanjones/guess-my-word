const BOARD_SERVER = 'https://home.hryanjones.com';
// const BOARD_SERVER = 'http://192.168.0.144:8080';
// const BOARD_SERVER = 'https://hryanjones.builtwithdark.com';

// const BAD_NAMES_SERVER = 'https://hryanjones.builtwithdark.com/gmw/bad-names';

const UNKNOWN_LEADERBOARD_ERROR = 'Sorry, the completion board is having trouble right now. Please try again in a little bit. (contact @hryanjones if it persists)';


function makeLeaderboardRequest(timezonelessDate, wordlist, onSuccess, onFailure, postData) {
    const url = `${BOARD_SERVER}/leaderboard/${timezonelessDate}/wordlist/${wordlist}`;
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
            return response.json();
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

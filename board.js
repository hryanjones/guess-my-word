/* global
Vue,
getTimezonelessLocalDate,
UNKNOWN_LEADERBOARD_ERROR,
makeLeaderboardRequest,
getFormattedTime,
urlParams,
IS_LOCAL_STORAGE_AVAILABLE,
getSavedGameByDifficulty,
isToday,
now,
getStoredUserNames,
WordCloud,
*/

const LEADER_HEADER_FIELDS_BY_TYPE = {
    normal: [
        { text: 'name', key: 'name' },
        { text: '# guesses', key: 'numberOfGuesses' },
        { text: 'time', key: 'time', formatter: getFormattedTime },
        { text: 'awards', key: 'awards' },
        { text: 'guesses', key: 'guesses' },
    ],
    allTime: [
        { text: 'name', key: 'name' },
        { text: 'weekly play rate', key: 'weeklyPlayRate', formatter: getTwoDecimalPlaces },
        { text: '# plays', key: 'playCount' },
        { text: 'best time', key: 'bestTime', formatter: getFormattedTime },
        { text: 'median time', key: 'timeMedian', formatter: getFormattedTime },
        { text: 'best # guesses', key: 'bestNumberOfGuesses' },
        { text: 'median # guesses', key: 'numberOfGuessesMedian' },
        { text: 'first play date', key: 'firstSubmitDate', formatter: removeTimeFromISOString },
        { text: 'awards', key: 'awards' },
    ],
};

const allHeaderFields = LEADER_HEADER_FIELDS_BY_TYPE.normal
    .concat(LEADER_HEADER_FIELDS_BY_TYPE.allTime);

// add default pass-through formatter
allHeaderFields.forEach((field) => {
    field.formatter = field.formatter || passThrough;
});

const EMPTY_LEADER = {}; // the empty leader is required for the virtualized board to render
allHeaderFields.map(field => field.key).forEach((key) => {
    EMPTY_LEADER[key] = '';
});

const DEFAULT_SORT_CONFIG_BY_LEADER_TYPE = {
    normal: {
        key: 'numberOfGuesses',
        direction: 'ascending',
    },
    allTime: {
        key: 'weeklyPlayRate',
        direction: 'descending',
    },
};

const difficultyFromURL = urlParams.get('difficulty');
const searchFromURL = urlParams.get('search');
const LOCAL_BAD_NAMES_KEY = 'guess-my-word-leaderboard-bad-names';
const REPORT_DATE_KEY = 'guess-my-word-leaderboard-recent-report-dates';

const app = new Vue({ // eslint-disable-line no-unused-vars
    el: '#leaderboard-container',
    data: {
        leadersType: 'normal',
        leaders: [EMPTY_LEADER],
        difficulty: difficultyFromURL || 'normal',
        message: '',
        error: '',
        sortConfig: DEFAULT_SORT_CONFIG_BY_LEADER_TYPE.normal,
        leaderSearch: searchFromURL || '',
        filteredLeaders: null,
        showInappropriateNames: false,
        reportMode: false,
        hasPlayedThisBoardToday: null, // determined in getLeaders
        localBadNames: loadSavedLocalBadNames(),
        usedNames: getStoredUserNames(),
        leaderHeaderFields: null, // determined in getLeaders
        wordCloudData: null,
        wordCloudCanvas: null,
    },
    created() {
        this.getLeaders();
    },
    methods: {
        getLeaders,
        setDifficulty(e) {
            const newDifficulty = e.target.value;
            this.difficulty = newDifficulty;
            this.getLeaders();
        },
        changeLeaderSort,
        toggleLeaderType() {
            this.leadersType = this.leadersType === 'normal' ? 'allTime' : 'normal';
            this.reportMode = false;
            this.sortConfig = DEFAULT_SORT_CONFIG_BY_LEADER_TYPE[this.leadersType];
            this.getLeaders();
        },
        updateLeaderSearch(e) {
            this.leaderSearch = e.target.value;
        },
        onSearch(e) {
            const searchTerm = this.leaderSearch.trim().toLowerCase();
            if (!searchTerm) {
                this.filteredLeaders = null;
            } else {
                this.filteredLeaders = this.leaders.filter(leader => (
                    leader.name.toLowerCase().includes(searchTerm)
                ));
            }
            return !e; // return false if it's from submit
        },
        clearSearch() {
            this.leaderSearch = '';
            this.onSearch();
        },
        areLeadersLoaded() {
            return this.leaders[0] !== EMPTY_LEADER;
        },
        toggleBadNames() {
            this.showInappropriateNames = !this.showInappropriateNames;
            hackToReRenderList(this.leaders);
        },
        toggleReportMode(e) {
            this.reportMode = !this.reportMode;
            e.stopPropagation(); // don't change leaderboard sort
            e.preventDefault();
            hackToReRenderList(this.leaders);
        },
        reportName(name) {
            if (!confirm(`Really report "${name}" as offensive?

(Note: this name will be immediately and ALWAYS hidden for you, and hidden for others with enough reports.)`)) {
                return;
            }

            this.localBadNames[name] = !this.localBadNames[name];
            this.reportMode = false;
            saveLocalBadNames(this.localBadNames);
            reportBadName(name, this.difficulty, this.lastUsedName);
            hackToReRenderList(this.leaders);
        },
        isBadName(record) {
            return record.badName || this.localBadNames[record.name];
        },
        toggleWordCloud() {
            const wordCloudContainer = document.getElementById('word-cloud-container');
            if (this.wordCloudCanvas) {
                wordCloudContainer.innerHTML = '';
                this.wordCloudCanvas = null;
                return;
            }
            this.wordCloudCanvas = document.createElement('div');
            this.wordCloudCanvas.id = 'word-cloud-canvas';
            wordCloudContainer.append(this.wordCloudCanvas);

            let i = 0;
            WordCloud(
                this.wordCloudCanvas,
                {
                    list: this.wordCloudData,
                    fontFamily: 'sans-serif',
                    color: stripedColorsBlackToGray, // 'random-dark',
                    minRotation: 0,
                    maxRotation: 0,
                    drawOutOfBound: false,
                    shrinkToFit: true,
                    gridSize: 10,
                    minSize: 8,
                }
            );

            function stripedColorsBlackToGray() {
                let n = i * 2;
                if (i % 2 !== 0) {
                    n += 120;
                }
                i += 1;
                n = Math.min(200, n);
                return `rgb(${n}, ${n}, ${n})`;
            }
        },
    },
});

function hackToReRenderList(leaders) {
    // HACK ALERT: modify leaders to get the list to re-render
    leaders.push(EMPTY_LEADER);
    leaders.pop();
}

function loadSavedLocalBadNames() {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return {};
    const localBadNames = localStorage.getItem(LOCAL_BAD_NAMES_KEY);
    try {
        return (localBadNames && JSON.parse(localBadNames)) || {};
    } catch (e) {
        localStorage.removeItem(LOCAL_BAD_NAMES_KEY);
    }
    return {};
}

function saveLocalBadNames(badNames) {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;
    localStorage.setItem(LOCAL_BAD_NAMES_KEY, JSON.stringify(badNames));
}

function reportBadName(badName, wordlist, reporterName) {
    if (reachedReportingLimit()) return;
    makeLeaderboardRequest(
        getTimezonelessLocalDate(new Date()),
        wordlist,
        noop,
        noop,
        { badName, reporterName },
        '/badname',
    );
    addToReportCount();
}

const REPORT_TIMEOUT_IN_MS = 12 /* hours */ * 60 /* min/hour */ * 60 /* sec/min */ * 1000; /* ms */
const NUMBER_OF_REPORTS_ALLOWED_IN_ONE_DAY = 5;

function reachedReportingLimit() {
    const recentReports = getRecentReports(); // TODO maybe shouldn't fetch from localstorage every time?
    if (recentReports.length < NUMBER_OF_REPORTS_ALLOWED_IN_ONE_DAY) {
        return false;
    }
    const oldestReportDate = new Date(recentReports[recentReports.length - 1]);
    return +oldestReportDate > (+now() - REPORT_TIMEOUT_IN_MS);
}

function addToReportCount() {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;
    let recentReports = getRecentReports();
    recentReports.unshift(new Date());
    recentReports = recentReports.slice(0, NUMBER_OF_REPORTS_ALLOWED_IN_ONE_DAY);
    localStorage.setItem(REPORT_DATE_KEY, JSON.stringify(recentReports));
}

function getRecentReports() {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return [];
    const json = localStorage.getItem(REPORT_DATE_KEY);
    try { // FIXME need to centralize this and stop copy-pastaing it
        return (json && JSON.parse(json)) || [];
    } catch (e) {
        localStorage.removeItem(REPORT_DATE_KEY);
    }
    return [];
}

function noop() {}

const throttledHandleScroll = throttle(handleScroll, 100);

document.addEventListener('scroll', throttledHandleScroll, true);

function handleScroll() {
    const header = document.getElementById('leaderboard-header');
    if (!header) return;
    const headerTop = document.getElementById('leaderboard-header-top');
    const headerTopPosition = headerTop && headerTop.getBoundingClientRect();
    const top = (headerTopPosition && headerTopPosition.top) || 0;
    if (top < 0) {
        if (header.style.position !== 'fixed') header.style.position = 'fixed';
        header.style.left = `${headerTopPosition.left}px`;
        return;
    }
    if (header.style.position !== 'static') header.style.position = 'static';
}

function getLeaders() {
    let date;
    const type = this.leadersType;
    if (type === 'allTime') {
        date = 'ALL';
    } else {
        date = getTimezonelessLocalDate(new Date());
    }

    this.hasPlayedThisBoardToday = determineIfPlayedThisBoardToday(this.difficulty, type);
    this.leaderHeaderFields = LEADER_HEADER_FIELDS_BY_TYPE[type];
    if (!this.hasPlayedThisBoardToday && type === 'normal') {
        // remove guesses column if we won't have the data
        this.leaderHeaderFields = LEADER_HEADER_FIELDS_BY_TYPE.normal.filter(h => h.key !== 'guesses');
    }

    const onSuccess = (json) => {
        const { key, direction } = this.sortConfig;
        try {
            this.leaders = sortLeaders(
                normalizeLeadersAndAddAwards(json),
                key,
                direction,
            );
        } catch (e) {
            console.error(e);
            this.message = '';
            this.error = 'Sorry, having trouble dealing with the response from the leaderboard. Please let @hryanjones know.';
            return;
        }
        this.error = '';
        if (this.leaders.length === 0) {
            this.message = 'nobody has guessed the word for today';
            this.leaders = [EMPTY_LEADER];
        } else {
            this.onSearch();
            this.message = '';
            this.wordCloudData = getWordCloudData(this.leaders);
        }
    };

    const onFailure = () => {
        this.leaders = [EMPTY_LEADER];
        this.message = '';
        this.error = UNKNOWN_LEADERBOARD_ERROR;
    };

    this.message = 'loading...';
    this.leaders = [EMPTY_LEADER];
    this.wordCloudData = null;
    this.wordCloudCanvas = null;

    const queryString = getQueryStringForIncludingGuesses(this.hasPlayedThisBoardToday, this.difficulty);
    makeLeaderboardRequest(date, this.difficulty, onSuccess, onFailure, null, queryString);
}

function determineIfPlayedThisBoardToday(difficulty, type) {
    // return true // GUESSES TEST
    if (type === 'allTime') return false; // can't report on all time board
    const savedGame = getSavedGameByDifficulty(difficulty);
    return Boolean(savedGame && savedGame.submitTime && isToday(savedGame.submitTime));
}

function getQueryStringForIncludingGuesses(hasPlayed, difficulty) {
    // return '?name=miguelpotts&key=pop' // GUESSES TEST
    const savedGame = getSavedGameByDifficulty(difficulty);
    if (!hasPlayed || !savedGame) return '';
    const { username, guesses } = savedGame;
    const [firstGuess] = guesses;
    return `?name=${username}&key=${firstGuess}`;
}

const OPPOSITE_SORT_DIRECTION = {
    ascending: 'descending',
    descending: 'ascending',
};

function changeLeaderSort(newKey) {
    let { direction, key } = this.sortConfig;
    if (newKey === this.sortConfig.key) {
        direction = OPPOSITE_SORT_DIRECTION[direction];
    } else {
        key = newKey;
    }

    this.sortConfig = { direction, key };

    this.leaders = sortLeaders(this.leaders, key, direction);
    this.onSearch();
}

const SECONDARY_SORT_KEY_BY_PRIMARY_SORT_KEY = {
    name: null, // don't need a secondary sort key as name should be unique
    numberOfGuesses: 'time',
    time: 'numberOfGuesses',
};

function sortLeaders(leaders, sortKey, direction) {
    return sortArrayByKey(leaders, sortKey, direction);
}

function sortArrayByKey(array, key, direction) {
    const sorter = direction === 'descending' ? sortByKeyDesc : sortByKeyAsc;
    const arrayCopy = array.slice(0);
    const secondaryKey = SECONDARY_SORT_KEY_BY_PRIMARY_SORT_KEY[key];
    const bareSorted = arrayCopy.sort((first, second) => sorter(first, second, key, secondaryKey));
    return putLuckyBuggersAtTheBottom(bareSorted);
}

function sortByKeyAsc(first, second, key, secondaryKey) {
    // always do caseinsensitive sorting
    const firstValue = lowercase(first[key]);
    const secondValue = lowercase(second[key]);
    if (firstValue > secondValue) {
        return 1;
    }
    if (firstValue < secondValue) {
        return -1;
    }

    if (secondaryKey) {
        return sortByKeyAsc(first, second, secondaryKey);
    }

    return 0;
}

function lowercase(value) {
    return (value && value.toLowerCase && value.toLowerCase()) || value;
}

function sortByKeyDesc(first, second, key, secondaryKey) {
    return -1 * sortByKeyAsc(first, second, key, secondaryKey);
}

const LUCKY_AWARD = '🍀 lucky?';

function putLuckyBuggersAtTheBottom(array) {
    if (array.length <= 1) {
        return array;
    }
    const luckyBuggers = [];
    const goodPeople = [];
    array.forEach((record) => {
        if (isLuckyRecord(record)) {
            luckyBuggers.push(record);
        } else {
            goodPeople.push(record);
        }
    });
    return goodPeople.concat(luckyBuggers);
}

function isLuckyRecord(record) {
    return record.awards.includes(LUCKY_AWARD);
}

function normalizeLeadersAndAddAwards(leadersData) {
    return leadersData.map((leader) => {
        leader.awards = leader.awards || ''; // normalize awards
        if (leader.firstSubmitDate) {
            leader.firstSubmitDate = leader.firstSubmitDate.replace(/T.*/, ''); // remove time portion
        }
        if (leader.guesses) {
            leader.guesses = joinWithSpaces(leader.guesses);
        } else {
            leader.guesses = '';
        }
        return leader;
    });
}

function passThrough(input) {
    return input;
}

function removeTimeFromISOString(dateString) {
    return dateString && dateString.replace(/T.*/, '');
}

function getTwoDecimalPlaces(number) {
    return number && number.toFixed(2);
}

function joinWithSpaces(array) {
    return array && array.join && array.join(' ');
}

function getWordCloudData(leaders) {
    let maxWordFrequency = 0;
    const wordFrequency = {};
    leaders.forEach(({ guesses }) => {
        guesses = (guesses && guesses.split(' ')) || ['word'];
        guesses.pop(); // last word is the word, remove it
        guesses.forEach((guess) => {
            if (!wordFrequency[guess]) {
                wordFrequency[guess] = 0;
            }
            wordFrequency[guess] += 1;
            if (wordFrequency[guess] > maxWordFrequency) {
                maxWordFrequency = wordFrequency[guess];
            }
        });
    });

    // remove words only used once
    // Object.keys(wordFrequency).forEach((word) => {
    //     if (wordFrequency[word] === 1) {
    //         delete wordFrequency[word];
    //     }
    // });

    if (maxWordFrequency < 10 || Object.keys(wordFrequency) < 5) {
        return null;
    }

    return toWordCloud2List(wordFrequency);
}

function toWordCloud2List(wordFrequency) {
    const list = [];
    Object.keys(wordFrequency).forEach((word) => {
        list.push([word, wordFrequency[word]]);
    });

    list.sort(([, aFrequency], [, bFrequency]) => bFrequency - aFrequency);
    return list;
}

function randomColor() {
    const randomUpTo200 = Math.round(Math.random() * 200);
    return `rgb(${randomUpTo200}, ${randomUpTo200}, ${randomUpTo200})`;
}

/* eslint-disable */
// stolen and modified from
// https://stackoverflow.com/questions/27078285/simple-throttle-in-js
// FIXME fix the linting in this thing
function throttle(func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    const trailing = true;
    return function () {
        var now = Date.now();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && trailing) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
/* eslint-enable */

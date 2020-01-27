/* global
Vue,
getTimezonelessLocalDate,
UNKNOWN_LEADERBOARD_ERROR,
makeLeaderboardRequest,
getFormattedTime,
urlParams,
*/

const LEADER_HEADER_FIELDS_BY_TYPE = {
    normal: [
        { text: 'name', key: 'name' },
        { text: '# guesses', key: 'numberOfGuesses' },
        { text: 'time', key: 'time', formatter: getFormattedTime },
        { text: 'awards', key: 'awards' },
    ],
    allTime: [
        { text: 'name', key: 'name' },
        { text: 'weekly play rate', key: 'weeklyPlayRate' },
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
    },
    created() {
        this.getLeaders(this.leadersType);
    },
    methods: {
        getLeaders,
        setDifficulty(e) {
            const newDifficulty = e.target.value;
            this.difficulty = newDifficulty;
            this.getLeaders(this.leadersType);
        },
        changeLeaderSort,
        toggleLeaderType() {
            this.leadersType = this.leadersType === 'normal' ? 'allTime' : 'normal';
            this.sortConfig = DEFAULT_SORT_CONFIG_BY_LEADER_TYPE[this.leadersType];
            this.getLeaders(this.leadersType);
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
    },
});

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

function getLeaders(type) {
    let date;
    if (type === 'allTime') {
        date = 'ALL';
    } else {
        date = getTimezonelessLocalDate(new Date());
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
        }
    };

    const onFailure = () => {
        this.leaders = [EMPTY_LEADER];
        this.message = '';
        this.error = UNKNOWN_LEADERBOARD_ERROR;
    };

    this.message = 'loading...';
    this.leaders = [EMPTY_LEADER];
    makeLeaderboardRequest(date, this.difficulty, onSuccess, onFailure);
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
        return leader;
    });
}

function passThrough(input) {
    return input;
}

function removeTimeFromISOString(dateString) {
    return dateString && dateString.replace(/T.*/, '');
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

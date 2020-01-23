

const dataKeys = Object.values(LEADER_HEADER_FIELDS_BY_TYPE.normal)
    .concat(Object.values(LEADER_HEADER_FIELDS_BY_TYPE.allTime))
    .map(field => field.key);

const EMPTY_LEADER = {}; // the empty leader is required for the virtualized board to render
dataKeys.forEach(key => EMPTY_LEADER[key] = '');

function getLeaders(type) {
    let date;
    if (type === 'allTime') {
        date = 'ALL';
    } else {
        date = getTimezonelessLocalDate(new Date());
    }

    const onSuccess = (json) => {
        const { sortKey, direction } = this.sortConfig;
        this.leaders = sortLeaders(
            normalizeLeadersAndAddAwards(json, this.leadersType),
            sortKey,
            direction
        );
        this.error = '';
        if (this.leaders.length === 0) {
            this.message = 'nobody has guessed the word for today';
            this.leaders = [EMPTY_LEADER];
        } else {
            this.onSearch();
            this.message = '';
        }
    }

    const onFailure = (json) => {
        this.leaders = [EMPTY_LEADER];
        this.message = '';
        this.error = UNKNOWN_LEADERBOARD_ERROR;
    };

    this.message = 'loading...';
    this.leaders = [EMPTY_LEADER];
    makeLeaderboardRequest(date, this.difficulty, onSuccess, onFailure);
}

const DEFAULT_SORT_CONFIG_BY_LEADER_TYPE = {
    normal: {
        key: 'numberOfGuesses',
        sortKey: 'numberOfGuesses',
        direction: 'ascending',
    },
    allTime: {
        key: 'weeklyPlayRate',
        sortKey: 'weeklyPlayRate',
        direction: 'descending',
    },
}

const urlParams = new URLSearchParams(window.location.search);
const difficultyFromURL = urlParams.get('difficulty');
const searchFromURL = urlParams.get('search');

new Vue({
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
            this.getLeaders(this.leadersType)
        },
        updateLeaderSearch(e) {
            this.leaderSearch = e.target.value;
        },
        onSearch(e) {
            const searchTerm = this.leaderSearch.trim().toLowerCase();
            if (!searchTerm) {
                this.filteredLeaders = null;
            } else {
                this.filteredLeaders = this.leaders.filter(leader => leader.name.toLowerCase().includes(searchTerm));
            }
            return e ? false : true;
        },
        clearSearch() {
            this.leaderSearch = '';
            this.onSearch();
        },
        areLeadersLoaded() {
            return this.leaders[0] !== EMPTY_LEADER;
        }
    },
});

const throttledHandleScroll = throttle(handleScroll, 100);

document.addEventListener('scroll', throttledHandleScroll, true);

function handleScroll() {
    const header = document.getElementById('leaderboard-header');
    if (!header) return;
    const headerTop = document.getElementById('leaderboard-header-top');
    const headerTopPosition = headerTop && headerTop.getBoundingClientRect();
    const top = headerTopPosition && headerTopPosition.top || 0;
    if (top < 0) {
        if (header.style.position !== 'fixed') header.style.position = 'fixed';
        header.style.left = headerTopPosition.left + 'px';
        return;
    }
    if (header.style.position !== 'static') header.style.position = 'static';
}

// stolen and modified from
// https://stackoverflow.com/questions/27078285/simple-throttle-in-js
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
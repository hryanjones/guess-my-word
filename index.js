/* global Vue */

/* eslint-disable */
const possibleWords = {
    // normal words were from 1-1,000 common English words on TV and movies https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/TV/2006/1-1000
    normal: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */['','','','course','against','ready','daughter','work','friends','minute','though','supposed','honey','point','start','check','alone','matter','office','hospital','three','already','anyway','important','tomorrow','almost','later','found','trouble','excuse','hello','money','different','between','every','party','either','enough','year','house','story','crazy','mind','break','tonight','person','sister','pretty','trust','funny','gift','change','business','train','under','close','reason','today','beautiful','brother','since','bank','yourself','without','until','forget','anyone','promise','happy','bake','worry','school','afraid','cause','doctor','exactly','second','phone','look','feel','somebody','stuff','elephant','morning','heard','world','chance','call','watch','whatever','perfect','dinner','family','heart','least','answer','woman','bring','probably','question','stand','truth','problem','patch','pass','famous','true','power','cool','last','fish','remote','race','noon','wipe','grow','jumbo','learn','itself','chip','print','young','argue','clean','remove','flip','flew','replace','kangaroo','side','walk','gate','finger','target','judge','push','thought','wear','desert','relief','basic','bright','deal','father','machine','know','step','exercise','present','wing','lake','beach','ship','wait','fancy','eight','hall','rise','river','round','girl','winter','speed','long','oldest','lock','kiss','lava','garden','fight','hook','desk','test','serious','exit','branch','keyboard','naked','science','trade','quiet','home','prison','blue','window','whose','spot','hike','laptop','dark','create','quick','face','freeze','plug','menu','terrible','accept','door','touch','care','rescue','ignore','real','title','city','fast','season','town','picture','tower','zero','engine','lift','respect','time','mission','play','discover','nail','half','unusual','ball','tool','heavy','night','farm','firm','gone','help','easy','library','group','jungle','taste','large','imagine','normal','outside','paper','nose','long','queen','olive','doing','moon','hour','protect','hate','dead','double','nothing','restaurant','reach','note','tell','baby','future','tall','drop','speak','rule','pair','ride','ticket','game','hair','hurt','allow','oven','live','horse','bottle','rock','public','find','garage','green','heat','plan','mean','little','spend','nurse','practice','wish','uncle','core','stop','number','nest','magazine','pool','message','active','throw','pull','level','wrist','bubble','hold','movie','huge','ketchup','finish','pilot','teeth','flag','head','private','together','jewel','child','decide','listen','garbage','jealous','wide','straight','fall','joke','table','spread','laundry','deep','quit','save','worst','email','glass','scale','safe','path','camera','excellent','place','zone','luck','tank','sign','report','myself','knee','need','root','light','sure','page','life','space','magic','size','tape','food','wire','period','mistake','full','paid','horrible','special','hidden','rain','field','kick','ground','screen','risky','junk','juice','human','nobody','mall','bathroom','high','class','street','cold','metal','nervous','bike','internet','wind','lion','summer','president','empty','square','jersey','worm','popular','loud','online','something','photo','knot','mark','zebra','road','storm','grab','record','said','floor','theater','kitchen','action','equal','nice','dream','sound','fifth','comfy','talk','police','draw','bunch','idea','jerk','copy','success','team','favor','open','neat','whale','gold','free','mile','lying','meat','nine','wonderful','hero','quilt','info','radio','move','early','remember','understand','month','everyone','quarter','center','universe','name','zoom','inside','label','yell','jacket','nation','support','lunch','twice','hint','jiggle','boot','alive','build','date','room','fire','music','leader','rest','plant','connect','land','body','belong','trick','wild','quality','band','health','website','love','hand','okay','yeah','dozen','glove','give','thick','flow','project','tight','join','cost','trip','lower','magnet','parent','grade','angry','line','rich','owner','block','shut','neck','write','hotel','danger','impossible','illegal','show','come','want','truck','click','chocolate','none','done','bone','hope','share','cable','leaf','water','teacher','dust','orange','handle','unhappy','guess','past','frame','knob','winner','ugly','lesson','bear','gross','midnight','grass','middle','birthday','rose','useless','hole','drive','loop','color','sell','unfair','send','crash','knife','wrong','guest','strong','weather','kilometer','undo','catch','neighbor','stream','random','continue','return','begin','kitten','thin','pick','whole','useful','rush','mine','toilet','enter','wedding','wood','meet','stolen','hungry','card','fair','crowd','glow','ocean','peace','match','hill','welcome','across','drag','island','edge','great','unlock','feet','iron','wall','laser','fill','boat','weird','hard','happen','tiny','event','math','robot','recently','seven','tree','rough','secret','nature','short','mail','inch','raise','warm','gentle','glue','roll','search','regular','here','count','hunt','keep','week',],

    // hard words were gotten from a top 100 SAT word list https://education.yourdictionary.com/for-students-and-parents/100-most-common-sat-words.html
    hard: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */['abdicate','empathy','abate','venerable','exemplary','hackneyed','foster','aberration','clairvoyant','extenuating','mundane','forbearance','fortitude','prudent','hypothesis','ephemeral','scrutinize','capitulate','spurious','substantiate','intuitive','tenacious','digression','prosperity','compromise','vindicate','fraught','submissive','ostentatious','boisterous','bias','impetuous','wary','rancorous','deleterious','amicable','reclusive','canny','superficial','emulate','frugal','perfidious','jubilation','brusque','intrepid','sagacity','arid','inconsequential','nonchalant','reconciliation','brazen','prosaic','pretentious','benevolent','aesthetic','adversity','abhor','divergent','fortuitous','conditional','disdain','demagogue','asylum','compassion','hedonist','condescending','querulous','collaborate','inevitable','discredit','renovation','lobbyist','enervating','provocative','florid','convergence','subtle','diligent','surreptitious','orator','superfluous','opulent','capacious','tactful','longevity','restrained','conformist','abstain','pragmatic','reverence','spontaneous','anachronistic','haughty','procrastinate','parched','camaraderie','precocious','evanescent','impute','transient','predecessor','snorkel','confluence','pyromaniac','remedial','genetic','conventional','digitize','corroborate','ossify','compound','proxy','innovate','harassment','disparage','sufficient','negligence','attache','dubious','mandible','temporary','regret','words','convoluted','adequate','diminish','plausible','necessity','materialistic','abysmal','osteoporosis','diminutive','deficient','capture','nutrition','keen','delirious','laminate','lunatic','succulent','fraternity','loathe','entrenched','effigy','hazardous','foment','dilate','condone','osmosis','hypocrite','reconnaissance','anomaly','counteract','delegate','subsequent','underscore','eccentric','seethe','scallop','decree','asymmetrical','devise','enumerate','precedent','peevish','caricature','prohibit','ridiculous','redact','restitution','dispatch','erratic','juvenile','sacrilegious','saucer','flagrant','feasibility','filament','undermine','reclaim','unveil','maternity','superb','exhilarating','quirk','irreconcilable','chasm','suspicious','garment','typical','fructose','dopamine','coarse','resilient','burble','gorge','rhombus','ambiguous','facilitate','repudiate','adversarial','necromancer','mercenary','jaunt','atavistic','analogous','frock','bodacious','proletariat','sundry','theoretical','lament','contemplate','anticipate','culmination','complement','rebuttal','viper','confide','endow','galvanize','summation','constitution','prosecute','auspices','survival','gregarious','syndicate','quorum','ferocious','surreal','melodramatic','justify','controversial','reinforce','ubiquitous','rustic','virtuous','dilemma','provincial','establish','yearn','catamaran','onset','regurgitate','renounce','obsolete','nimbus','orthogonal','amendment','kleptomaniac','herring','marginal','conducive','invade','coincide','deference','scorn','dignity','complacent','sheath','austere','postulate','coddle','nuisance','jarring','amiable','desolate','worthwhile','condemn','indifferent','stupendous','widget','kinetic','clout','avid','theology','sporadic','cognition','confound','retention','provision','knight','callous','gorgeous','refute','agitate','inundate','qualitative','gargoyle','scandalous','restoration','chronic','dire','validate','quell','cuddle','affluent','momentous','synchronous','reconsider','objective','fraudulent','battlement','malleable','notable','impartial','gremlin','withstand','bevel','virile','petulant','preamble','squalor','fray','lavender','buccaneer','blather','calamity','excel','hypothetical','tedious','demonstrate','nominee','leukemia','supine','flourish','peculiar','fluctuate','easel','palliative','nuptials','asynchronous','undulate','brothel','egregious','hostile','dominion','congregate','vicious','malicious','logarithm','conformity','restructure','stark','dependency','jeopardize','perish','incite','limbic','brawl','diversify','intimate','hegemony','warranty','allegory','diligence','mercurial','tryst','zealot','righteous','reconcile','saber','dapper','inversion','placid','immolate','proffer','unilateral','universal','rambunctious','coordination','recompense','foreseeable','geriatric','candid','secrete','jaded','ramification','persecute','guarantee','devious','invoke','simian','astute','sparingly','concise','surly','bohemian','recite','solidarity','dearth','dilute','quench','iteration','lambaste','sociopath','timorous','valiant','apex','susceptible','comparable','fatigue','remnant','query','marauder','recreation','superlative','bogart','omnipotent','chalice','brevity','hitherto','empirical','brute','narrative','potent','advocate','intone','unprecedented','supercilious','nautical','heritage','cadence','kiosk','quid','novice','yacht','taut','quirky','delusion','grim','recoup','quizzical','unadorned','teeming','conduct','gadget','recumbent','tension','expend','tremendous','providence','navigate','robust','juncture','altercation','wallop','wreckage','intravenous','ambivalent','prow','spawn','demur','convey','demeanor','paramount','bubonic','brackish','ornate','calibrate','substantial','temperament','niche','sumptuous','gruesome','sustain','frankly','loiter','yield','nymph','swivel','oxymoron','emphatic','ostensible','bolus','evoke','capitalize','adhere','conceive','lemur','reform','diabolical','delicate','savvy','contradict','sinister','warrant','litigious','arsenal','bygones','vital','nuance','fragile','articulate','precarious','brunt','jolt','rapture','paddock','conviction','deliberate','adamant','exacerbate','surmount','acquisition','discord','jealous','vigor','allude','nascent','envy','provoke','synthesis','treacherous','oust','emit','ameliorate','paranormal','doctrine','cultivate','blemish','surveillance','abscond','tentative','commission','blithe','reluctant','braggart','bemuse','bumpkin','stature','khaki','eloquent','introvert','granular','cower','karma','ruminate','vintage','iota','insatiable','sublimate','fiscal','accumulate','solvent','hydrogen','competent','salacious','apprehensive','transparent','eminent','ostracize','consensus','horizontal','terse','infer','gauge','contender','prompt','hectare','endure','subordinate','entail','lucrative','exploit','assertion','gargantuan','hence','innate','hoist','juggernaut','concede','locomotion','exert','vestigial','quantitative','election','tabular','candor','astringent','nominal','indiscriminate','viable','reproach','kosher','civic','notorious','jubilant','triumvirate','telemetry','judgemental','billet','dismay','clamour','renovate','imposing','transaction','bolster','prescribe','stationary','irrational','yeti','foist','dreary','novel','quaint','recalcitrant','jovial','responsibility','deplete','pinnacle','fumigate','forage','indulge','zombie','sodium','sage','annihilate','rigorous','zenith','harbinger','cumulative','sentiment','fundamental','principle','collate',]
};
/* eslint-enable */

 const BOARD_SERVER = 'https://home.hryanjones.com';
// const BOARD_SERVER = 'http://192.168.0.144:8080';
// const BOARD_SERVER = 'https://hryanjones.builtwithdark.com';

const BAD_NAMES_SERVER = 'https://hryanjones.builtwithdark.com/gmw/bad-names';

const WIN = 'win';
const BEFORE = 'before';
const AFTER = 'after';
const HARD = 'hard';
const NORMAL = 'normal';
const OTHER_DIFFICULTY = {
    [NORMAL]: HARD,
    [HARD]: NORMAL,
};
let vueApp;

const UNKNOWN_LEADERBOARD_ERROR = 'Sorry, the completion board is having trouble right now. Please try again in a little bit. (contact @hryanjones if it persists)';

const FORMATTED_TIME_KEYS = {
    time: 'formattedTime',
    bestTime: 'formattedBestTime',
    timeMedian: 'formattedTimeMedian',
};

const LUCKY_BUGGER_GUESS_COUNT_THRESHOLD = 3;
const THAT_GUY_NAME = 'THAT GUY 🤦‍♀️'; // name that signifies a user is using an inappropriate username

const LEADER_HEADER_FIELDS_BY_TYPE = { // eslint-disable-line no-unused-vars
    normal: [
        { text: 'name', key: 'name', sortKey: 'name' },
        { text: '# guesses', key: 'numberOfGuesses', sortKey: 'numberOfGuesses' },
        { text: 'time', key: FORMATTED_TIME_KEYS.time, sortKey: 'time' },
        { text: 'awards', key: 'awards', sortKey: 'awards' },
    ],
    allTime: [
        { text: 'name', key: 'name', sortKey: 'name' },
        { text: 'weekly play rate', key: 'weeklyPlayRate', sortKey: 'weeklyPlayRate' },
        { text: '# plays', key: 'playCount', sortKey: 'playCount' },
        { text: 'best time', key: FORMATTED_TIME_KEYS.bestTime, sortKey: 'bestTime' },
        { text: 'median time', key: FORMATTED_TIME_KEYS.timeMedian, sortKey: 'timeMedian' },
        { text: 'best # guesses', key: 'bestNumberOfGuesses', sortKey: 'bestNumberOfGuesses' },
        { text: 'median # guesses', key: 'numberOfGuessesMedian', sortKey: 'numberOfGuessesMedian' },
        { text: 'first play date', key: 'firstSubmitDate', sortKey: 'firstSubmitDate' },
        { text: 'awards', key: 'awards', sortKey: 'awards' },
    ],
};

Vue.directive('focus', {
    inserted: (el) => {
        el.focus();
    },
});

document.addEventListener('DOMContentLoaded', () => {
    if (getElement('container')) {
        vueApp = new Vue({
            el: '#container',
            data: {
                guesses: [],
                difficulty: null,
                startTime: null,
                winTime: null,
                gaveUpTime: null,
                submitTime: null,
                word: undefined,
                guessValue: '',
                guessError: '',
                afterGuesses: [],
                beforeGuesses: [],
                username: '',
                usernamesUsed: [],
                isLocalStorageAvailable: null,
                isReplay: false,

                leadersType: 'normal',
                leaders: null,
                leaderboardRequest: null,
                leaderSubmitError: '',
                sortConfig: {
                    key: 'numberOfGuesses',
                    sortKey: 'numberOfGuesses',
                    direction: 'ascending',
                },

                // Date picker state
                showDatePicker: false,
                playDate: null, // if unset playdate is for "today"
            },
            methods: {
                reset,
                setGuess,
                getInvalidReason,
                makeGuess,
                getComparisonToTargetWord,
                recordGuess,
                getFormattedTime,
                giveUp,
                setWordAndDate,
                toggleDifficulty,
                submitToLeaderboard,
                changeLeaderSort,
                setUsername(event) {
                    this.username = event.target.value;
                },
                shouldShowSubmitName,

                reportBadUserName,
                getBadUserNames,

                // Date picker methods
                getShortDayString,
                backDay,
                backWeek,
                backMonth,
                forwardDay,
                forwardWeek,
                forwardMonth,
                toggleShowDate,
            },
        });
    }

    if (vueApp) {
        vueApp.reset({ stealFocus: true });
    }
});


function reset(options) {
    this.word = undefined;

    this.guessValue = '';

    if (typeof isLocalStorageAvailable !== 'boolean') {
        this.isLocalStorageAvailable = testLocalStorage();
    }

    resetStats(this);
    loadStoredUserNames(this);
    // reset stats

    // fix leaderboard state
    this.leaders = null;
    this.leaderSubmitError = null;
    this.leaderboardRequest = null;

    if (!options || !options.stealFocus) return;
    Vue.nextTick(() => {
        getElement('new-guess').focus();
    });
}

const LAST_SET_DIFFICULTY_KEY = 'lastSetDifficultyToday';
const RECENT_FIRST_PLAYED_DIFFICULTY = 'recentFirstPlayedDifficulty';
const SAVED_GAMES_KEYS_BY_DIFFICULTY = {
    normal: 'savedGame_normal',
    hard: 'savedGame_hard',
};
const USERNAMES_USED_KEY = 'usernamesUsed';

function resetStats(app) {
    if (!app.isLocalStorageAvailable) {
        setEmptyStats(app);
        return;
    }
    const difficulty = getDifficulty(app.difficulty);
    const savedGame = getSavedGameByDifficulty(difficulty);
    setStatsFromExistingGame(app, savedGame, difficulty);
}

function setEmptyStats(app, difficulty) {
    app.difficulty = difficulty || app.difficulty || NORMAL;
    app.guesses = [];
    app.afterGuesses = [];
    app.beforeGuesses = [];
    app.startTime = null;
    app.winTime = null;
    app.gaveUpTime = null;
    app.submitTime = null;
    app.isReplay = false;
}

function getDifficulty(currentDifficulty) {
    if (currentDifficulty) return currentDifficulty;

    const lastSetDifficulty = localStorage.getItem(LAST_SET_DIFFICULTY_KEY);
    const recentFirstPlayedDifficulty = localStorage.getItem(RECENT_FIRST_PLAYED_DIFFICULTY);
    if (!isSameDay() && recentFirstPlayedDifficulty) {
        localStorage.removeItem(RECENT_FIRST_PLAYED_DIFFICULTY);
        return recentFirstPlayedDifficulty;
    }

    return lastSetDifficulty || NORMAL;
}

function isSameDay() {
    // we determine if it's the same day by looking to see if any of the
    // saved games have the same date as today
    return Object.keys(OTHER_DIFFICULTY).some((difficulty) => {
        const savedGame = getSavedGameByDifficulty(difficulty);
        if (!savedGame) return false;
        const savedStartTime = new Date(savedGame.startTime);
        return isToday(savedStartTime);
    });
}

function isToday(date) {
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

function getSavedGameByDifficulty(difficulty) {
    const savedGameKey = SAVED_GAMES_KEYS_BY_DIFFICULTY[difficulty];
    const savedGameJSON = difficulty && localStorage.getItem(savedGameKey);
    try {
        return savedGameJSON && JSON.parse(savedGameJSON);
    } catch (e) {
        localStorage.removeItem(savedGameKey);
    }
    return undefined;
}

function setStatsFromExistingGame(app, savedGame, difficulty) {
    if (!savedGame || !savedGame.startTime) {
        setEmptyStats(app, difficulty);
        return;
    }
    const startTime = new Date(savedGame.startTime);
    if (!isPlayDateToday(app.playDate)) {
        setEmptyStats(app, difficulty);
        return;
    }
    const savedGameForToday = getDOY(startTime) === getDOY(now());
    if (!savedGameForToday) {
        resetSavedGames();
        setEmptyStats(app, difficulty);
        return;
    }
    const {
        winTime,
        gaveUpTime,
        submitTime,
        guesses,
    } = savedGame;
    app.difficulty = difficulty;
    app.startTime = startTime;
    app.winTime = (winTime && new Date(winTime)) || null;
    app.gaveUpTime = (gaveUpTime && new Date(gaveUpTime)) || null;
    app.submitTime = (submitTime && new Date(submitTime)) || null;
    app.guesses = guesses || [];
    app.word = getWord(startTime, difficulty);
    app.beforeGuesses = generateGuessList(BEFORE, guesses, app.word);
    app.afterGuesses = generateGuessList(AFTER, guesses, app.word);
    if (app.gaveUpTime || app.winTime) {
        app.word = getWord(app.startTime, app.difficulty);
        app.guessValue = app.word;
    }
    if (app.submitTime || app.gaveUpTime) {
        app.isReplay = true;
        app.guessValue = app.word;
    } else {
        app.isReplay = false;
    }
}

function isPlayDateToday(playDate) {
    if (playDate == null) return true; // by definition if playdate isn't set it is for today
    return isToday(playDate);
}

function resetSavedGames() {
    Object.keys(OTHER_DIFFICULTY).forEach((difficulty) => {
        localStorage.removeItem(SAVED_GAMES_KEYS_BY_DIFFICULTY[difficulty]);
    });
}

function generateGuessList(beforeOrAfter, guesses, word) {
    const guessList = [];
    guesses
        .filter(getBeforeOrAfterGuesses)
        .forEach((guess) => {
            insertIntoSortedArray(guessList, guess);
        });
    return guessList;

    function getBeforeOrAfterGuesses(guess) {
        if (beforeOrAfter === BEFORE) {
            return guess > word;
        }
        return guess < word;
    }
}

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

function loadStoredUserNames(app) {
    if (!app.isLocalStorageAvailable || app.usernamesUsed.length > 0) return;
    const usernamesJSON = localStorage.getItem(USERNAMES_USED_KEY);
    let usernames = [];
    try {
        usernames = (usernamesJSON && JSON.parse(usernamesJSON)) || [];
    } finally {
        app.usernamesUsed = usernames || [];
        const lastUsedName = app.usernamesUsed[0];
        if (lastUsedName && !app.username) {
            app.username = lastUsedName;
        }
    }
}

function setWordAndDate() {
    this.startTime = now();
    saveGame(this);

    const dateForWord = this.playDate || this.startTime;

    // Note: We don't want to set the word until the user starts playing as then
    // it'd be possible for their start date and the expected word on that date
    // not to match (and the eventual backend will verify this)
    this.word = getWord(dateForWord, this.difficulty);
}

function getWord(date, difficulty) {
    const index = getWordIndex(date);
    return possibleWords[difficulty][index];
}

function getWordIndex(date) {
    const doy = getDOY(date);
    const yearOffset = (date.getFullYear() - 2019) * 365;
    // FIXME deal with leap years?
    return doy + yearOffset - 114;
}

function saveLastSetDifficulty({ isLocalStorageAvailable, difficulty }) {
    if (!isLocalStorageAvailable) {
        return;
    }
    localStorage.setItem(LAST_SET_DIFFICULTY_KEY, difficulty);
}

function saveGame({
    isLocalStorageAvailable,
    difficulty,
    startTime,
    winTime,
    gaveUpTime,
    submitTime,
    guesses,
    playDate,
}) {
    if (!isLocalStorageAvailable || !isPlayDateToday(playDate)) {
        return;
    }
    if (!localStorage.getItem(RECENT_FIRST_PLAYED_DIFFICULTY)) {
        localStorage.setItem(RECENT_FIRST_PLAYED_DIFFICULTY, difficulty);
    }
    const savedGameKey = SAVED_GAMES_KEYS_BY_DIFFICULTY[difficulty];
    localStorage.setItem(savedGameKey, JSON.stringify({
        startTime,
        winTime,
        gaveUpTime,
        submitTime,
        guesses,
    }));
}

function setGuess(event) {
    this.guessValue = event.target.value;
    if (this.guessError) { // only re-evaluate form validity on-the-fly if it was invalid
        this.guessError = this.getInvalidReason(sanitizeGuess(this.guessValue));
    }
}

function makeGuess() {
    const guess = sanitizeGuess(this.guessValue);
    this.guessError = this.getInvalidReason(guess);

    if (this.guessError) {
        return;
    }

    this.guesses.push(guess);

    if (!this.word) {
        this.setWordAndDate();
    }

    const comparison = this.getComparisonToTargetWord(guess);
    if (comparison === WIN) {
        this.winTime = now();
        saveGame(this);
        return;
    }
    saveGame(this);
    this.guessValue = ''; // clear input to get ready for next guess

    this.recordGuess(guess, comparison);
}

function sanitizeGuess(guess) {
    return guess.toLowerCase().trim().replace(/[^a-z]/g, '');
}

function getInvalidReason(guess) {
    if (!guess) {
        return "Guess can't be empty.";
    }
    if (!isAValidWord(guess)) {
        return 'Guess must be an English word. (Scrabble-acceptable)';
    }
    if (this.guesses.includes(guess)) {
        return "Oops, you've already guessed that word.";
    }
    return '';
}

function isAValidWord(guess) {
    let level = validWordTrie; // eslint-disable-line no-undef
    for (const letter of guess) {
        level = level[letter];
        if (!level) return false;
    }
    return '' in level;
}

function getComparisonToTargetWord(guess) {
    if (guess === this.word) {
        return WIN;
    }
    return guess > this.word ? BEFORE : AFTER;
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


function recordGuess(guess, comparison) {
    const previousGuesses = comparison === AFTER ? this.afterGuesses : this.beforeGuesses;
    insertIntoSortedArray(previousGuesses, guess);
}

function insertIntoSortedArray(array, newElement) {
    for (let i = 0; i <= array.length; i += 1) {
        const thisElement = array[i];
        if (newElement < thisElement) {
            array.splice(i, 0, newElement);
            return;
        }
    }
    array.push(newElement);
}

function giveUp() {
    if (!confirm('Really give up?')) {
        return;
    }
    this.guessValue = this.word;
    this.gaveUpTime = now();
    saveGame(this);
}

function toggleDifficulty() {
    const haveMadeGuesses = this.guesses.length > 0;
    const haveWonOrGivenUp = this.winTime || this.gaveUpTime;
    if (!this.difficulty) {
        this.difficulty = NORMAL;
        return;
    }
    if (haveMadeGuesses && !haveWonOrGivenUp && !this.isLocalStorageAvailable
        && !confirm('Change difficulty and lose current guesses?')) {
        this.$forceUpdate(); // need to make sure the changer dropdown is in the correct state
        return;
    }
    this.difficulty = OTHER_DIFFICULTY[this.difficulty] || NORMAL;
    this.reset({ stealFocus: true });
    saveLastSetDifficulty(this);
}

function shouldShowSubmitName() {
    return this.winTime && this.guesses.length > 1 && !this.isReplay && !this.submitTime
        && isPlayDateToday(this.playDate);
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

function getElement(id) {
    return document.getElementById(id);
}

// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
/* eslint-disable */
function isLeapYear(date) {
    var year = date.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
}

// Get Day of Year
function getDOY(date) {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = date.getMonth();
    var dn = date.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && isLeapYear(date)) dayOfYear++;
    return dayOfYear;
};

/* eslint-enable */


// LEADERBOARD

function submitToLeaderboard() {
    const name = this.username;
    const postData = {
        name,
        time: this.winTime - this.startTime,
        guesses: this.guesses,
    };
    const timezonelessDate = getTimezonelessLocalDate(this.startTime);
    const submitTime = now();

    const onSuccess = (json) => {
        const { sortKey, direction } = this.sortConfig;
        this.leaders = sortLeaders(
            normalizeLeadersAndAddAwards(json, this.leadersType),
            sortKey,
            direction,
        );
        this.submitTime = submitTime;
        saveGame(this);
        saveUserName(this, name);
    };
    this.leaderSubmitError = '';
    this.leaderboardRequest = makeLeaderboardRequest(
        timezonelessDate,
        this.difficulty,
        onSuccess,
        handleBadResponse.bind(this),
        postData,
    );
}

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

function handleBadResponse(json, responseStatus) {
    const invalidReason = (json && json.invalidReason)
        || `${UNKNOWN_LEADERBOARD_ERROR} ${responseStatus}`;
    this.leaderSubmitError = invalidReason;
    this.leaderboardRequest = null;
    console.warn(invalidReason); // eslint-disable-line no-console
}

function normalizeLeadersAndAddAwards(leadersByName, type) {
    const leaders = [];

    const awardTrackers = getNewAwardTrackers(type);
    const luckyTracker = {
        names: [],
        award: '🍀 lucky?',
    };

    for (const name in leadersByName) {
        const leader = prepareLeaderForBoard(name, leadersByName);

        leaders.push(leader);

        if (leader.numberOfGuesses <= LUCKY_BUGGER_GUESS_COUNT_THRESHOLD) {
            luckyTracker.names.push(leader.name);
            continue; // eslint-disable-line
        }
        awardTrackers.forEach((tracker) => {
            recordAwards(leader, tracker);
        });
    }
    awardTrackers.push(luckyTracker);

    awardTrackers.forEach((tracker) => {
        addAwards(tracker, leadersByName);
    });

    leaders.forEach((leader) => {
        leader.awards = leader.awards.join(', ');
    });
    return leaders;
}

function getNewAwardTrackers(type) {
    if (type !== 'allTime') {
        return [
            {
                value: Infinity,
                key: 'time',
                names: [],
                award: '🏆 fastest',
            },
            {
                value: Infinity,
                key: 'numberOfGuesses',
                names: [],
                award: '🏆 fewest guesses',
            },
            {
                value: 'ZZZZ', // submitTime is ISO string
                key: 'submitTime',
                names: [],
                award: '🏅 first guesser',
            },
        ];
    }
    return [
        {
            value: 0,
            key: 'weeklyPlayRate',
            names: [],
            award: '🏆👏 highest weekly rate',
            reverse: true,
        },
        {
            value: Infinity,
            key: 'timeMedian',
            names: [],
            award: '🏆👏 fastest median',
        },
        {
            value: Infinity,
            key: 'numberOfGuessesMedian',
            names: [],
            award: '🏆👏 fewest median guesses',
        },
        {
            value: Infinity,
            key: 'bestTime',
            names: [],
            award: '🏆 fastest',
        },
        {
            value: Infinity,
            key: 'bestNumberOfGuesses',
            names: [],
            award: '🏆 fewest guesses',
        },
        {
            value: 0,
            key: 'playCount',
            names: [],
            award: '🏅 most plays',
            reverse: true,
        },
    ];
}

function prepareLeaderForBoard(name, leadersByName) {
    const leader = leadersByName[name];
    // warning mutating inputs here, don't care YOLO
    leader.name = name;
    Object.keys(FORMATTED_TIME_KEYS).forEach((key) => {
        const timeValue = leader[key];
        if (timeValue) {
            const formattedKey = FORMATTED_TIME_KEYS[key];
            leader[formattedKey] = getFormattedTime(timeValue);
        }
    });
    if (leader.weeklyPlayRate) {
        leader.weeklyPlayRate = leader.weeklyPlayRate.toFixed(2);
    }
    if (leader.firstSubmitDate) {
        leader.firstSubmitDate = leader.firstSubmitDate.replace(/T.*/, ''); // remove time portion
    }
    leader.awards = [];
    return leader;
}

function recordAwards(leader, tracker) {
    if (leader.name === THAT_GUY_NAME) return;
    const { key, value, reverse } = tracker;
    const leaderValue = leader[key];
    const isLeaderValueBetter = reverse
        ? leaderValue > value
        : leaderValue < value;
    if (isLeaderValueBetter) {
        tracker.value = leaderValue;
        tracker.names = [leader.name];
    } else if (leaderValue === value) {
        tracker.names.push(leader.name);
    }
}

function addAwards({ award, names }, leadersByName) {
    names.forEach((name) => {
        leadersByName[name].awards.push(award);
    });
}

function saveUserName(app, name) {
    app.usernamesUsed = unshiftUniqueValue(app.usernamesUsed, name);
    localStorage.setItem(USERNAMES_USED_KEY, JSON.stringify(app.usernamesUsed));
}

function unshiftUniqueValue(arrayOfUniqueValues, newValue) {
    return [newValue].concat(
        arrayOfUniqueValues
            .filter(value => value !== newValue),
    );
}

const OPPOSITE_SORT_DIRECTION = {
    ascending: 'descending',
    descending: 'ascending',
};

function changeLeaderSort(newKey, newSortKey) {
    let { direction, key, sortKey } = this.sortConfig;
    if (newKey === this.sortConfig.key) {
        direction = OPPOSITE_SORT_DIRECTION[direction];
    } else {
        key = newKey;
        sortKey = newSortKey || newKey;
    }

    this.sortConfig = { direction, key, sortKey };

    this.leaders = sortLeaders(this.leaders, sortKey, direction);
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
    return value && value.toLowerCase && value.toLowerCase() || value;
}

function sortByKeyDesc(first, second, key, secondaryKey) {
    return -1 * sortByKeyAsc(first, second, key, secondaryKey);
}

function putLuckyBuggersAtTheBottom(array) {
    if (!array[0] || !array[0].numberOfGuesses) {
        return array;
    }
    const luckyBuggers = array
        .filter(record => record.numberOfGuesses <= LUCKY_BUGGER_GUESS_COUNT_THRESHOLD);
    return array
        .filter(record => record.numberOfGuesses > LUCKY_BUGGER_GUESS_COUNT_THRESHOLD)
        .concat(luckyBuggers);
}


function reportBadUserName(badUserName) {
    badUserName = badUserName || 'Fuck eric';
    const url = `${BAD_NAMES_SERVER}`;
    const postData = { badUserName, reporter: 'whatever!' };
    makeRequest(url, console.log, console.error, postData);
}

function getBadUserNames() {
    const url = `${BAD_NAMES_SERVER}`;
    makeRequest(url, console.log, console.error);
}

// Date picker

function toggleShowDate() {
    const newShowDatePicker = !this.showDatePicker;
    if (newShowDatePicker === false) {
        this.playDate = null; // reset to today if they close the date picker
        this.reset();
    }
    this.showDatePicker = newShowDatePicker;
}

const SHORT_WEEK_DAY_BY_INDEX = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
];
const SHORT_MONTH_BY_INDEX = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MILLISECONDS_IN_DAY = 60 * 60 * 24 * 1000;
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7;

function backDay() {
    const playDate = this.playDate || now();
    setNewPlayDate(this, playDate - MILLISECONDS_IN_DAY);
}

function forwardDay() {
    const playDate = this.playDate || now();
    setNewPlayDate(this, +playDate + MILLISECONDS_IN_DAY);
}

function backWeek() {
    const playDate = this.playDate || now();
    setNewPlayDate(this, playDate - MILLISECONDS_IN_WEEK);
}

function forwardWeek() {
    const playDate = this.playDate || now();
    setNewPlayDate(this, +playDate + MILLISECONDS_IN_WEEK);
}

function backMonth() {
    const playDate = this.playDate || now();
    const monthIndex = playDate.getMonth();
    if (monthIndex > 0) {
        playDate.setMonth(monthIndex - 1);
    } else {
        const year = playDate.getFullYear();
        playDate.setMonth(11);
        playDate.setYear(year - 1);
    }
    setNewPlayDate(this, playDate);
}

function forwardMonth() {
    const playDate = this.playDate || now();
    const monthIndex = playDate.getMonth();
    if (monthIndex < 11) {
        playDate.setMonth(monthIndex + 1);
    } else {
        const year = playDate.getFullYear();
        playDate.setMonth(0);
        playDate.setYear(year + 1);
    }
    setNewPlayDate(this, playDate);
}

function setNewPlayDate(app, dateNumberOrString) {
    const clampedDate = clampDate(new Date(dateNumberOrString));
    app.playDate = isPlayDateToday(clampedDate) ? null : clampedDate;
    app.reset();
}

const FIRST_DATE = new Date(2019, 3, 24, 12);

function clampDate(date) {
    if (date > now()) {
        return now();
    }
    if (date < FIRST_DATE) {
        return new Date(FIRST_DATE);
    }
    return date;
}

function getShortDayString() {
    const specialDateString = getSpecialDateString(this.playDate);
    if (specialDateString) {
        return specialDateString;
    }
    const dayOfWeekIndex = this.playDate.getDay();
    const monthIndex = this.playDate.getMonth();
    return [
        SHORT_WEEK_DAY_BY_INDEX[dayOfWeekIndex],
        SHORT_MONTH_BY_INDEX[monthIndex],
        `${this.playDate.getDate()},`,
        this.playDate.getFullYear(),
    ].join(' ');
}

function getSpecialDateString(playDate) {
    if (isPlayDateToday(playDate)) {
        return 'Today';
    }
    if (datesMatch(playDate, FIRST_DATE)) {
        return 'First day 🎂';
    }
    return '';
}

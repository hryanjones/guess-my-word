/* global
Vue,
getTimezonelessLocalDate,
UNKNOWN_LEADERBOARD_ERROR,
makeLeaderboardRequest,
getFormattedTime,
validWordTrie,
isToday,
now,
datesMatch,
IS_LOCAL_STORAGE_AVAILABLE,
SAVED_GAMES_KEYS_BY_DIFFICULTY,
getSavedGameByDifficulty,
USERNAMES_USED_KEY,
getStoredUserNames,
urlParams,
*/


/* eslint-disable */
const possibleWords = {
    // normal words were from 1-1,000 common English words on TV and movies https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/TV/2006/1-1000
    normal: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */['','','','course','against','ready','daughter','work','friends','minute','though','supposed','honey','point','start','check','alone','matter','office','hospital','three','already','anyway','important','tomorrow','almost','later','found','trouble','excuse','hello','money','different','between','every','party','either','enough','year','house','story','crazy','mind','break','tonight','person','sister','pretty','trust','funny','gift','change','business','train','under','close','reason','today','beautiful','brother','since','bank','yourself','without','until','forget','anyone','promise','happy','bake','worry','school','afraid','cause','doctor','exactly','second','phone','look','feel','somebody','stuff','elephant','morning','heard','world','chance','call','watch','whatever','perfect','dinner','family','heart','least','answer','woman','bring','probably','question','stand','truth','problem','patch','pass','famous','true','power','cool','last','fish','remote','race','noon','wipe','grow','jumbo','learn','itself','chip','print','young','argue','clean','remove','flip','flew','replace','kangaroo','side','walk','gate','finger','target','judge','push','thought','wear','desert','relief','basic','bright','deal','father','machine','know','step','exercise','present','wing','lake','beach','ship','wait','fancy','eight','hall','rise','river','round','girl','winter','speed','long','oldest','lock','kiss','lava','garden','fight','hook','desk','test','serious','exit','branch','keyboard','naked','science','trade','quiet','home','prison','blue','window','whose','spot','hike','laptop','dark','create','quick','face','freeze','plug','menu','terrible','accept','door','touch','care','rescue','ignore','real','title','city','fast','season','town','picture','tower','zero','engine','lift','respect','time','mission','play','discover','nail','half','unusual','ball','tool','heavy','night','farm','firm','gone','help','easy','library','group','jungle','taste','large','imagine','normal','outside','paper','nose','long','queen','olive','doing','moon','hour','protect','hate','dead','double','nothing','restaurant','reach','note','tell','baby','future','tall','drop','speak','rule','pair','ride','ticket','game','hair','hurt','allow','oven','live','horse','bottle','rock','public','find','garage','green','heat','plan','mean','little','spend','nurse','practice','wish','uncle','core','stop','number','nest','magazine','pool','message','active','throw','pull','level','wrist','bubble','hold','movie','huge','ketchup','finish','pilot','teeth','flag','head','private','together','jewel','child','decide','listen','garbage','jealous','wide','straight','fall','joke','table','spread','laundry','deep','quit','save','worst','email','glass','scale','safe','path','camera','excellent','place','zone','luck','tank','sign','report','myself','knee','need','root','light','sure','page','life','space','magic','size','tape','food','wire','period','mistake','full','paid','horrible','special','hidden','rain','field','kick','ground','screen','risky','junk','juice','human','nobody','mall','bathroom','high','class','street','cold','metal','nervous','bike','internet','wind','lion','summer','president','empty','square','jersey','worm','popular','loud','online','something','photo','knot','mark','zebra','road','storm','grab','record','said','floor','theater','kitchen','action','equal','nice','dream','sound','fifth','comfy','talk','police','draw','bunch','idea','jerk','copy','success','team','favor','open','neat','whale','gold','free','mile','lying','meat','nine','wonderful','hero','quilt','info','radio','move','early','remember','understand','month','everyone','quarter','center','universe','name','zoom','inside','label','yell','jacket','nation','support','lunch','twice','hint','jiggle','boot','alive','build','date','room','fire','music','leader','rest','plant','connect','land','body','belong','trick','wild','quality','band','health','website','love','hand','okay','yeah','dozen','glove','give','thick','flow','project','tight','join','cost','trip','lower','magnet','parent','grade','angry','line','rich','owner','block','shut','neck','write','hotel','danger','impossible','illegal','show','come','want','truck','click','chocolate','none','done','bone','hope','share','cable','leaf','water','teacher','dust','orange','handle','unhappy','guess','past','frame','knob','winner','ugly','lesson','bear','gross','midnight','grass','middle','birthday','rose','useless','hole','drive','loop','color','sell','unfair','send','crash','knife','wrong','guest','strong','weather','kilometer','undo','catch','neighbor','stream','random','continue','return','begin','kitten','thin','pick','whole','useful','rush','mine','toilet','enter','wedding','wood','meet','stolen','hungry','card','fair','crowd','glow','ocean','peace','match','hill','welcome','across','drag','island','edge','great','unlock','feet','iron','wall','laser','fill','boat','weird','hard','happen','tiny','event','math','robot','recently','seven','tree','rough','secret','nature','short','mail','inch','raise','warm','gentle','glue','roll','search','regular','here','count','hunt','keep','week',],

    // hard words were gotten from a top 100 SAT word list https://education.yourdictionary.com/for-students-and-parents/100-most-common-sat-words.html
    hard: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */['abdicate','empathy','abate','venerable','exemplary','hackneyed','foster','aberration','clairvoyant','extenuating','mundane','forbearance','fortitude','prudent','hypothesis','ephemeral','scrutinize','capitulate','spurious','substantiate','intuitive','tenacious','digression','prosperity','compromise','vindicate','fraught','submissive','ostentatious','boisterous','bias','impetuous','wary','rancorous','deleterious','amicable','reclusive','canny','superficial','emulate','frugal','perfidious','jubilation','brusque','intrepid','sagacity','arid','inconsequential','nonchalant','reconciliation','brazen','prosaic','pretentious','benevolent','aesthetic','adversity','abhor','divergent','fortuitous','conditional','disdain','demagogue','asylum','compassion','hedonist','condescending','querulous','collaborate','inevitable','discredit','renovation','lobbyist','enervating','provocative','florid','convergence','subtle','diligent','surreptitious','orator','superfluous','opulent','capacious','tactful','longevity','restrained','conformist','abstain','pragmatic','reverence','spontaneous','anachronistic','haughty','procrastinate','parched','camaraderie','precocious','evanescent','impute','transient','predecessor','snorkel','confluence','pyromaniac','remedial','genetic','conventional','digitize','corroborate','ossify','compound','proxy','innovate','harassment','disparage','sufficient','negligence','attache','dubious','mandible','temporary','regret','words','convoluted','adequate','diminish','plausible','necessity','materialistic','abysmal','osteoporosis','diminutive','deficient','capture','nutrition','keen','delirious','laminate','lunatic','succulent','fraternity','loathe','entrenched','effigy','hazardous','foment','dilate','condone','osmosis','hypocrite','reconnaissance','anomaly','counteract','delegate','subsequent','underscore','eccentric','seethe','scallop','decree','asymmetrical','devise','enumerate','precedent','peevish','caricature','prohibit','ridiculous','redact','restitution','dispatch','erratic','juvenile','sacrilegious','saucer','flagrant','feasibility','filament','undermine','reclaim','unveil','maternity','superb','exhilarating','quirk','irreconcilable','chasm','suspicious','garment','typical','fructose','dopamine','coarse','resilient','burble','gorge','rhombus','ambiguous','facilitate','repudiate','adversarial','necromancer','mercenary','jaunt','atavistic','analogous','frock','bodacious','proletariat','sundry','theoretical','lament','contemplate','anticipate','culmination','complement','rebuttal','viper','confide','endow','galvanize','summation','constitution','prosecute','auspices','survival','gregarious','syndicate','quorum','ferocious','surreal','melodramatic','justify','controversial','reinforce','ubiquitous','rustic','virtuous','dilemma','provincial','establish','yearn','catamaran','onset','regurgitate','renounce','obsolete','nimbus','orthogonal','amendment','kleptomaniac','herring','marginal','conducive','invade','coincide','deference','scorn','dignity','complacent','sheath','austere','postulate','coddle','nuisance','jarring','amiable','desolate','worthwhile','condemn','indifferent','stupendous','widget','kinetic','clout','avid','theology','sporadic','cognition','confound','retention','provision','knight','callous','gorgeous','refute','agitate','inundate','qualitative','gargoyle','scandalous','restoration','chronic','dire','validate','quell','cuddle','affluent','momentous','synchronous','reconsider','objective','fraudulent','battlement','malleable','notable','impartial','gremlin','withstand','bevel','virile','petulant','preamble','squalor','fray','lavender','buccaneer','blather','calamity','excel','hypothetical','tedious','demonstrate','nominee','leukemia','supine','flourish','peculiar','fluctuate','easel','palliative','nuptials','asynchronous','undulate','brothel','egregious','hostile','dominion','congregate','vicious','malicious','logarithm','conformity','restructure','stark','dependency','jeopardize','perish','incite','limbic','brawl','diversify','intimate','hegemony','warranty','allegory','diligence','mercurial','tryst','zealot','righteous','reconcile','saber','dapper','inversion','placid','immolate','proffer','unilateral','universal','rambunctious','coordination','recompense','foreseeable','geriatric','candid','secrete','jaded','ramification','persecute','guarantee','devious','invoke','simian','astute','sparingly','concise','surly','bohemian','recite','solidarity','dearth','dilute','quench','iteration','lambaste','sociopath','timorous','valiant','apex','susceptible','comparable','fatigue','remnant','query','marauder','recreation','superlative','bogart','omnipotent','chalice','brevity','hitherto','empirical','brute','narrative','potent','advocate','intone','unprecedented','supercilious','nautical','heritage','cadence','kiosk','quid','novice','yacht','taut','quirky','delusion','grim','recoup','quizzical','unadorned','teeming','conduct','gadget','recumbent','tension','expend','tremendous','providence','navigate','robust','juncture','altercation','wallop','wreckage','intravenous','ambivalent','prow','spawn','demur','convey','demeanor','paramount','bubonic','brackish','ornate','calibrate','substantial','temperament','niche','sumptuous','gruesome','sustain','frankly','loiter','yield','nymph','swivel','oxymoron','emphatic','ostensible','bolus','evoke','capitalize','adhere','conceive','lemur','reform','diabolical','delicate','savvy','contradict','sinister','warrant','litigious','arsenal','bygones','vital','nuance','fragile','articulate','precarious','brunt','jolt','rapture','paddock','conviction','deliberate','adamant','exacerbate','surmount','acquisition','discord','jealous','vigor','allude','nascent','envy','provoke','synthesis','treacherous','oust','emit','ameliorate','paranormal','doctrine','cultivate','blemish','surveillance','abscond','tentative','commission','blithe','reluctant','braggart','bemuse','bumpkin','stature','khaki','eloquent','introvert','granular','cower','karma','ruminate','vintage','iota','insatiable','sublimate','fiscal','accumulate','solvent','hydrogen','competent','salacious','apprehensive','transparent','eminent','ostracize','consensus','horizontal','terse','infer','gauge','contender','prompt','hectare','endure','subordinate','entail','lucrative','exploit','assertion','gargantuan','hence','innate','hoist','juggernaut','concede','locomotion','exert','vestigial','quantitative','election','tabular','candor','astringent','nominal','indiscriminate','viable','reproach','kosher','civic','notorious','jubilant','triumvirate','telemetry','judgemental','billet','dismay','clamour','renovate','imposing','transaction','bolster','prescribe','stationary','irrational','yeti','foist','dreary','novel','quaint','recalcitrant','jovial','responsibility','deplete','pinnacle','fumigate','forage','indulge','zombie','sodium','sage','annihilate','rigorous','zenith','harbinger','cumulative','sentiment','fundamental','principle','collate',]
};
/* eslint-enable */


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
                difficulty: null,
                word: undefined,
                guessValue: '',
                startTime: null,
                guesses: [],
                afterGuesses: [], // derived from guesses and word
                beforeGuesses: [], // derived from guesses and word
                winTime: null,
                isReplay: false, // if we've loaded a game that's already been played (always today's game)
                guessError: '',
                gaveUpTime: null,

                submitTime: null,
                username: '', // for submitting to the leaderboard
                areGuessesPublic: null, // set in .reset
                leaderboardRequest: null,
                leaderSubmitError: '',
                usernamesUsed: [],

                isLocalStorageAvailable: IS_LOCAL_STORAGE_AVAILABLE, // FIXME don't need this on state

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
                setUsername(event) {
                    this.username = event.target.value;
                },
                toggleGuessesPublic() {
                    if (this.areGuessesPublic) {
                        this.areGuessesPublic = false;
                    } else {
                        this.areGuessesPublic = getAreGuessesPublicDefault() || true;
                    }
                },
                shouldShowSubmitName,

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

    resetStats(this);
    loadStoredUserNames(this);
    // reset stats

    // fix leaderboard state
    this.leaders = null;
    this.leaderSubmitError = null;
    this.leaderboardRequest = null;

    this.areGuessesPublic = getAreGuessesPublicDefault();

    if (!options || !options.stealFocus) return;
    Vue.nextTick(() => {
        getElement('new-guess').focus();
    });
}

const LAST_SET_DIFFICULTY_KEY = 'lastSetDifficultyToday';
const RECENT_FIRST_PLAYED_DIFFICULTY = 'recentFirstPlayedDifficulty';

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

function loadStoredUserNames(app) {
    if (app.usernamesUsed.length > 0) return;
    const usernames = getStoredUserNames();
    app.usernamesUsed = usernames || [];
    const lastUsedName = app.usernamesUsed[0];
    if (lastUsedName && !app.username) {
        app.username = lastUsedName;
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
    username,
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
        username,
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
    let level = validWordTrie;
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

const ARE_GUESSES_PUBLIC_KEY = 'guess-my-word_areGuessesPublic';
const FIRST_TIME_MAKING_GUESSES_PUBLIC = 'First time making guesses public -> ask';
function getAreGuessesPublicDefault() {
    if (!IS_LOCAL_STORAGE_AVAILABLE) {
        return true;
    }
    const savedValue = localStorage.getItem(ARE_GUESSES_PUBLIC_KEY);
    if (!savedValue) {
        return FIRST_TIME_MAKING_GUESSES_PUBLIC;
    }
    return savedValue === 'true';
}

function saveAreGuessesPublic(value) {
    if (IS_LOCAL_STORAGE_AVAILABLE) {
        localStorage.setItem(ARE_GUESSES_PUBLIC_KEY, value);
    }
}

// Utilities


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
    let { areGuessesPublic } = this;
    if (
        areGuessesPublic === FIRST_TIME_MAKING_GUESSES_PUBLIC
        && !confirm("Just double checking that you don't mind your guesses being public? (won't ask again)")
    ) {
        return;
    }

    areGuessesPublic = Boolean(areGuessesPublic);
    this.areGuessesPublic = areGuessesPublic; // in case of submit error no-re-ask
    saveAreGuessesPublic(areGuessesPublic);

    const postData = {
        name,
        time: this.winTime - this.startTime,
        guesses: this.guesses,
        areGuessesPublic,
    };
    const timezonelessDate = getTimezonelessLocalDate(this.startTime);
    const submitTime = now();

    const onSuccess = () => {
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

function handleBadResponse(json, responseStatus) {
    const invalidReason = (json && json.invalidReason)
        || `${UNKNOWN_LEADERBOARD_ERROR} ${responseStatus}`;
    this.leaderSubmitError = invalidReason;
    this.leaderboardRequest = null;
    console.warn(invalidReason); // eslint-disable-line no-console
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

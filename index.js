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
let guesses = [];
let startTime;
let winTime;
let word;
let difficulty = 'normal';
let vueApp;

const UNKNOWN_LEADERBOARD_ERROR = "Sorry, can't contact the leaderboard right now. Please try again in a little bit. (please contact @hryanjones if it persists)";

const LEADER_HEADER_FIELDS = [
    { text: 'name', key: 'name', sortKey: 'name' },
    { text: '# guesses', key: 'numberOfGuesses', sortKey: 'numberOfGuesses' },
    { text: 'time', key: 'formattedTime', sortKey: 'time' },
];

document.addEventListener('DOMContentLoaded', () => {
    if (getElement('container')) {
        vueApp = new Vue({ // eslint-disable-line no-undef
            el: '#container',
            data: {
                LEADER_HEADER_FIELDS,
                leaders: [],
                sortConfig: {
                    key: 'numberOfGuesses',
                    sortKey: 'numberOfGuesses',
                    direction: 'ascending',
                },
            },
            methods: {
                submitToLeaderboard,
                reset() {
                    this.leaders = [];
                },
                changeLeaderSort,
            },
        });
    }

    setup();

    // fix input validation when typing
    const input = getInput();
    if (input) {
        input.addEventListener('input', event => event.target.setCustomValidity(''));
    }
});


function setup() {
    word = undefined;

    // focus input
    const input = getInput();
    if (!input) {
        return; // not on the main site (maybe in the guess generator)
    }
    input.disabled = false;
    input.value = '';
    input.focus();

    // reset stats
    guesses = [];
    startTime = null;
    winTime = null;

    // remove possible win/gave-up state
    removeClass('show-win');
    removeClass('show-leaderboard');
    vueApp.reset();
    removeClass('gave-up');
    removeClass('difficulty-hard');
    removeClass('difficulty-normal');
    removeClass('awfully-lucky');

    getContainer().classList.add(`difficulty-${difficulty}`);

    // remove old guesses
    getElement('after-guesses').innerHTML = '';
    getElement('before-guesses').innerHTML = '';

    // make labels and give up hidden again
    getElement('before-label').classList.add('initially-hidden');
    getElement('after-label').classList.add('initially-hidden');
    getElement('give-up').classList.add('initially-hidden');

    // fix leaderboard state
    getElement('leaderboard-validation-error').innerText = '';
    setDisabledForLeaderboardForm(false);
}

function setWordAndDate() {
    startTime = new Date();

    // Note: We don't want to set the word until the user starts playing as then 
    // it'd be possible for their start date and the expected word on that date 
    // not to match (and the eventual backend will verify this)
    const dayOfYear = getDOY(startTime);

    // FIXME need to fix this so it works into next year.
    const index = dayOfYear - 114;
    ensureDifficultyMatchesDropdown();
    word = possibleWords[difficulty][index];
}

function ensureDifficultyMatchesDropdown() {
    const dropdown = getDifficultyChanger();
    if (difficulty !== dropdown.value) {
        difficulty = dropdown.value;
    }
}

function getInput() {
    return getElement('new-guess');
}

function getContainer() {
    return getElement('container');
}

function getGuesses() {
    return document.getElementsByClassName('guess');
}

function getDifficultyChanger() {
    return getElement('difficulty-changer');
}

function resetValidation() { // eslint-disable-line no-unused-vars
    const guess = getGuess();
    const invalidReason = getInvalidReason(guess);
    getInput().setCustomValidity(invalidReason);
}

function makeGuess(/* event */) { // eslint-disable-line no-unused-vars
    const guess = getGuess();
    const invalidReason = getInvalidReason(guess);
    const input = getInput();
    input.setCustomValidity(invalidReason);
    if (invalidReason) {
        return false;
    }

    updateStats();
    getElement('give-up').classList.remove('initially-hidden');

    if (!word) {
        setWordAndDate();
    }

    const comparison = getComparisonToTargetWord(guess);
    if (comparison === WIN) {
        handleWin();
        return false;
    }
    input.value = ''; // clear input to get ready for next guess

    recordGuess(guess, comparison);
    return false;

    function updateStats() {
        guesses.push(guess);
    }
}

function getGuess() {
    const input = getInput();
    return sanitizeGuess((input && input.value) || '');

    function sanitizeGuess(guess) {
        return guess.toLowerCase().trim().replace(/[^a-z]/g, '');
    }
}

function getInvalidReason(guess) {
    if (!guess) {
        return "Guess can't be empty.";
    }
    if (!isAValidWord(guess)) {
        return 'Guess must be an English word. (Scrabble-acceptable)';
    }
    if (guesses.includes(guess)) {
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
    if (guess === word) {
        return WIN;
    }
    return guess > word ? BEFORE : AFTER;
}

function handleWin() {
    const stats = getElement('stats');
    winTime = new Date();
    stats.innerText = `(${guesses.length} guesses in ${getFormattedTime(winTime - startTime)})`;
    getInput().disabled = true;
    getContainer().classList.add('show-win');
    if (guesses.length === 1) {
        getContainer().classList.add('awfully-lucky');
        return;
    }

    getElement('leaderboard-name').focus();
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
    removeClass('current-guess');

    insertGuess(generateGuessElement(), comparison);

    revealLabel(comparison);

    function generateGuessElement() {
        const numberOfGuesses = guesses.length;
        const guessElement = document.createElement('div');
        guessElement.className = 'guess current-guess';

        guessElement.dataset.guess = guess;
        guessElement.innerHTML = `
            <span>${guess}</span>
            <span class="guess-number" title="guess number ${numberOfGuesses}">
                ${numberOfGuesses}
            </span>`;
        return guessElement;
    }
}

function insertGuess(guessElement, comparison) {
    const guessContainer = getElement(`${comparison}-guesses`);
    const method = comparison === AFTER ? 'after' : 'before';
    const previousGuesses = Array.from(guessContainer.children);
    if (comparison === AFTER) {
        previousGuesses.reverse();
    }
    for (const previousGuess of previousGuesses) {
        if (guessIsNext(previousGuess, guessElement, comparison)) {
            previousGuess[method](guessElement);
            return;
        }
    }
    guessContainer[comparison === AFTER ? 'prepend' : 'append'](guessElement);
}

function guessIsNext(previousGuessElement, guessElement, comparison) {
    const { guess } = guessElement.dataset;
    const previousGuess = previousGuessElement.dataset.guess;
    return (comparison === AFTER && previousGuess < guess)
        || (comparison === BEFORE && previousGuess > guess);
}

function revealLabel(comparison) {
    getElement(`${comparison}-label`).classList.remove('initially-hidden');
}

function removeClass(className) {
    const elementsWithClass = document.getElementsByClassName(className);
    for (const element of elementsWithClass) {
        element.classList.remove(className);
    }
}

function giveUp() { // eslint-disable-line no-unused-vars
    if (!confirm('Really give up?')) {
        return;
    }
    const input = getInput();
    input.value = word;
    input.disabled = true;
    getContainer().classList.add('gave-up');
}

function changeDifficulty(givenDifficulty) { // eslint-disable-line no-unused-vars
    const haveMadeGuesses = getGuesses().length > 0;
    const formClasses = getContainer() && getContainer().classList;
    const haveWonOrGivenUp = formClasses && (formClasses.contains('show-win') || formClasses.contains('gave-up'));
    const difficultyChanger = getDifficultyChanger();
    if (haveMadeGuesses && !haveWonOrGivenUp && !confirm('Change difficulty and lose current guesses?')) {
        difficultyChanger.value = difficulty;
        return;
    }
    const newDifficulty = givenDifficulty || difficultyChanger.value;
    if (newDifficulty !== difficultyChanger.value) {
        difficultyChanger.value = newDifficulty;
    }
    difficulty = newDifficulty;
    setup();
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

function submitToLeaderboard() { // eslint-disable-line no-unused-vars
    const postData = {
        name: getElement('leaderboard-name').value,
        time: winTime - startTime,
        guesses,
    };
    const timezonelessDate = getTimezonelessLocalDate(startTime);

    setDisabledForLeaderboardForm(true);

    const onSuccess = (json) => {
        const { sortKey, direction } = this.sortConfig;
        this.leaders = sortLeaders(
            normalizeLeaders(json),
            sortKey,
            direction,
        );
        getContainer().classList.add('show-leaderboard');
    };
    makeLeaderboardRequest(timezonelessDate, difficulty, onSuccess, handleBadResponse, postData);
}

function makeLeaderboardRequest(timezonelessDate, wordlist, onSuccess, onFailure, postData) {
    let responseStatus;
    let body;
    let method = 'GET';
    let headers;
    if (postData) {
        method = 'POST';
        headers = { 'Content-Type': 'application/json' };
        body = JSON.stringify(postData);
    }

    // const server = 'https://home.hryanjones.com';
    const server = 'http://192.168.1.6:8080';

    fetch(`${server}/leaderboard/${timezonelessDate}/wordlist/${wordlist}`, {
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
            if (responseStatus !== 200) {
                onFailure(json);
                return;
            }
            onSuccess(json);
        });
}

function setDisabledForLeaderboardForm(disabled = false) {
    getElement('leaderboard-name').disabled = disabled;
    const leaderboardSubmitButton = getElement('submit-to-leaderboard');
    leaderboardSubmitButton.disabled = disabled;
    leaderboardSubmitButton.value = disabled ? 'sending...' : 'submit';
}

function handleBadResponse(json) {
    const invalidReason = (json && json.invalidReason)
        || UNKNOWN_LEADERBOARD_ERROR;
    getElement('leaderboard-validation-error').innerText = invalidReason;
    setDisabledForLeaderboardForm(false);
    throw new Error(invalidReason);
}

function normalizeLeaders(leadersByName) {
    const leaders = [];
    for (const name in leadersByName) {
        const leader = leadersByName[name];
        leader.name = name; // warning mutating inputs here, don't care YOLO
        leader.formattedTime = getFormattedTime(leader.time);
        leaders.push(leader);
    }
    return leaders;
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
    return arrayCopy.sort((first, second) => sorter(first, second, key, secondaryKey));
}

function sortByKeyAsc(first, second, key, secondaryKey) {
    if (first[key] > second[key]) {
        return 1;
    }
    if (first[key] < second[key]) {
        return -1;
    }

    if (secondaryKey) {
        return sortByKeyAsc(first, second, secondaryKey);
    }

    return 0;
}

function sortByKeyDesc(first, second, key, secondaryKey) {
    return -1 * sortByKeyAsc(first, second, key, secondaryKey);
}

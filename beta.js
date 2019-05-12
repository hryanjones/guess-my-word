/* eslint-disable */
const possibleWords = {
    // normal words were from 1-1,000 common English words on TV and movies https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/TV/2006/1-1000
    normal: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */['', '', '', 'course', 'against', 'ready', 'daughter', 'work', 'friends', 'minute', 'though', 'supposed', 'honey', 'point', 'start', 'check', 'alone', 'matter', 'office', 'hospital', 'three', 'already', 'anyway', 'important', 'tomorrow', 'almost', 'later', 'found', 'trouble', 'excuse', 'hello', 'money', 'different', 'between', 'every', 'party', 'either', 'enough', 'year', 'house', 'story', 'crazy', 'mind', 'break', 'tonight', 'person', 'sister', 'pretty', 'trust', 'funny', 'gift', 'change', 'business', 'train', 'under', 'close', 'reason', 'today', 'beautiful', 'brother', 'since', 'bank', 'yourself', 'without', 'until', 'forget', 'anyone', 'promise', 'happy', 'bake', 'worry', 'school', 'afraid', 'cause', 'doctor', 'exactly', 'second', 'phone', 'look', 'feel', 'somebody', 'stuff', 'elephant', 'morning', 'heard', 'world', 'chance', 'call', 'watch', 'whatever', 'perfect', 'dinner', 'family', 'heart', 'least', 'answer', 'woman', 'bring', 'probably', 'question', 'stand', 'truth', 'problem',],

    // hard words were gotten from a top 100 SAT word list https://education.yourdictionary.com/for-students-and-parents/100-most-common-sat-words.html
    hard: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */                                      ['abdicate','empathy','abate','venerable','exemplary','hackneyed','foster','aberration','clairvoyant','extenuating','mundane','forbearance','fortitude','prudent','hypothesis','ephemeral','scrutinize','capitulate','spurious','substantiate','intuitive','tenacious','digression','prosperity','compromise','vindicate','fraught','submissive','ostentatious','boisterous','bias','impetuous','wary','rancorous','deleterious','amicable','reclusive','canny','superficial','emulate','frugal','perfidious','jubilation','brusque','intrepid','sagacity','arid','inconsequential','nonchalant','reconciliation','brazen','prosaic','pretentious','benevolent','aesthetic','adversity','abhor','divergent','fortuitous','conditional','disdain','demagogue','asylum','compassion','hedonist','condescending','querulous','collaborate','inevitable','discredit','renovation','lobbyist','enervating','provocative','florid','convergence','subtle','diligent','surreptitious','orator','superfluous','opulent','capacious','tactful','longevity','restrained','conformist','abstain','pragmatic','reverence','spontaneous','anachronistic','haughty','procrastinate','parched','camaraderie','precocious','evanescent','impute','transient', ],
};
/* eslint-enable */

const WIN = 'win';
const BEFORE = 'before';
const AFTER = 'after';
let guesses = [];
let startTime;
let word;
let difficulty = 'normal';

// will be used for leaderboard
let timezonelessDate; // eslint-disable-line no-unused-vars

setup();

// fix input validation when typing
getInput().addEventListener('input', event => event.target.setCustomValidity(''));

function setup() {
    word = undefined;

    // focus input
    const input = getInput();
    input.disabled = false;
    input.value = '';
    input.focus();

    // reset stats
    guesses = [];
    startTime = null;

    // remove possible win/gave-up state
    removeClass('show-win');
    removeClass('gave-up');
    removeClass('difficulty-hard');
    removeClass('difficulty-normal');

    getForm().classList.add(`difficulty-${difficulty}`);

    // remove old guesses
    document.getElementById('after-guesses').innerHTML = '';
    document.getElementById('before-guesses').innerHTML = '';

    // make labels and give up hidden again
    document.getElementById('before-label').classList.add('initially-hidden');
    document.getElementById('after-label').classList.add('initially-hidden');
    document.getElementById('give-up').classList.add('initially-hidden');
}

function setWordAndDate() {
    const now = new Date();

    // Note: We don't want to set the word until the user starts playing as then 
    // it'd be possible for their start date and the expected word on that date 
    // not to match (and the eventual backend will verify this)
    const dayOfYear = getDOY(now);

    // FIXME need to fix this so it works into next year.
    const index = dayOfYear - 114;
    ensureDifficultyMatchesDropdown();
    word = possibleWords[difficulty][index];

    timezonelessDate = getTimezonelessLocalDate(now);
}

function ensureDifficultyMatchesDropdown() {
    const dropdown = getDifficultyChanger();
    if (difficulty !== dropdown.value) {
        difficulty = dropdown.value;
    }
}

function getInput() {
    return document.getElementById('new-guess');
}

function getForm() {
    return document.getElementById('guesser');
}

function getGuesses() {
    return document.getElementsByClassName('guess');
}

function getDifficultyChanger() {
    return document.getElementById('difficulty-changer');
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
    document.getElementById('give-up').classList.remove('initially-hidden');

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
        if (!startTime) {
            startTime = new Date();
        }
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
    const stats = document.getElementById('stats');
    const winTime = new Date();
    stats.innerText = `(${guesses.length} guesses in ${getFormattedTime(startTime, winTime)})`;
    getInput().disabled = true;
    getForm().classList.add('show-win');
}

function getFormattedTime(start, end) {
    let seconds = Math.round((end - start) / 1000);
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
    const guessContainer = document.getElementById(`${comparison}-guesses`);
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
    document.getElementById(`${comparison}-label`).classList.remove('initially-hidden');
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
    getForm().classList.add('gave-up');
}

function changeDifficulty(givenDifficulty) { // eslint-disable-line no-unused-vars
    const haveMadeGuesses = getGuesses().length > 0;
    const formClasses = getForm().classList;
    const haveWonOrGivenUp = formClasses.contains('show-win') || formClasses.contains('gave-up');
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
    return leftPad(date.getDate().toString(), 2);
}

function getMonthDay(date) {
    return leftPad(date.getMonth().toString(), 2);
}

function leftPad(string, desiredLength, character = '0') {
    if (string.length === desiredLength) {
        return string;
    }
    return leftPad(character + string, desiredLength);
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

console.warn('BETA!!!');
/* eslint-enable */

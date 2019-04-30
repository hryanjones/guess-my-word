const possibleWords = {
    // normal words were from 1-1,000 common English words on TV and movies https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/TV/2006/1-1000
    normal: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */                                    ['', '', '','course','against','ready','daughter','working','friends','minutes','though','supposed','honey','point','start','check','alone','matter','office','hospital','three','already','anyway','important','tomorrow','almost','later','found','trouble','excuse','hello','money','different','between','every','party','either','enough','years','house','story','crazy','thinking','break','tonight','person','sister','pretty','trust','funny','taking','change','business','saying','under','close','reason','today','beautiful','brother','since','telling','yourself','without','until','forget','anyone','promise','happy','making','worry','school','afraid','cause','doctor','exactly','second','phone','looking','feeling','somebody','stuff','asked','morning','heard','world','chance','called','watch','whatever','perfect','dinner','family','heart','least','answer','woman','bring','probably','question','stand','truth','problem',],

    // hard words were gotten from a top 100 SAT word list https://education.yourdictionary.com/for-students-and-parents/100-most-common-sat-words.html
    hard: /* DON'T LOOK CLOSELY UNLESS YOU WANT TO BE SPOILED!!! */                                      ['abdicate','empathy','abate','venerable','exemplary','hackneyed','foster','aberration','clairvoyant','extenuating','mundane','forbearance','fortitude','prudent','hypothesis','ephemeral','scrutinize','capitulate','spurious','substantiate','intuitive','tenacious','digression','prosperity','compromise','vindicate','fraught','submissive','ostentatious','boisterous','bias','impetuous','wary','rancorous','deleterious','amicable','reclusive','canny','superficial','emulate','frugal','perfidious','jubilation','brusque','intrepid','sagacity','arid','inconsequential','nonchalant','reconciliation','brazen','prosaic','pretentious','benevolent','aesthetic','adversity','abhor','divergent','fortuitous','conditional','disdain','demagogue','asylum','compassion','hedonist','condescending','querulous','collaborate','inevitable','discredit','renovation','lobbyist','enervating','provocative','florid','convergence','subtle','diligent','surreptitious','orator','superfluous','opulent','capacious','tactful','longevity','restrained','conformist','abstain','pragmatic','reverence','spontaneous','anachronistic','haughty','procrastinate','parched','camaraderie','precocious','evanescent','impute','transient', ],
};
const WIN = 'win';
const BEFORE = 'before';
const AFTER = 'after';
let numberOfGuesses;
let startTime;
let word;
let difficulty = 'normal';

const now = new Date();

setup();

// fix input validation when typing
getInput().addEventListener('input', event => event.target.setCustomValidity(''));

function setup() {
    // focus input
    const input = getInput();
    input.disabled = false;
    input.value = '';
    input.focus();

    // pick word randomly
    const dayOfYear = getDOY(now);
    const index = dayOfYear - 114;
    word = possibleWords[difficulty][index];

    // reset stats
    numberOfGuesses = 0;
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

function getInput() {
    return document.getElementById('new-guess');
}

function getForm() {
    return document.getElementById('guesser');
}

function getGuesses() {
    return document.getElementsByClassName('guess')
}

function getDifficultyChanger() {
    return document.getElementById('difficulty-changer');
}

function resetValidation() {
    const guess = getGuess();
    const invalidReason = getInvalidReason(guess);
    getInput().setCustomValidity(invalidReason);
}

function makeGuess(event) {
    const guess = getGuess();
    const invalidReason = getInvalidReason(guess);
    const input = getInput();
    input.setCustomValidity(invalidReason);
    if (invalidReason) {
        return false;
    }

    updateStats();
    document.getElementById('give-up').classList.remove('initially-hidden');

    const comparison = getComparisonToTargetWord(guess);
    if (comparison === WIN) {
        handleWin();
        return false;
    }
    input.value = ''; // clear input to get ready for next guess

    recordGuess(guess, comparison);
    return false;

    function updateStats() {
        numberOfGuesses += 1;
        if (!startTime) {
            startTime = new Date();
        }
    }
}

function getGuess() {
    const input = getInput();
    return sanitizeGuess(input && input.value || '');

    function sanitizeGuess(guess) {
        return guess.toLowerCase().trim().replace(/[^a-z]/g, '');
    }
}

function getInvalidReason(guess) {
    if (!guess) {
        return "Guess can't be empty.";
    }
    if (!isAValidWord(guess)) {
        return "Guess must be an English word. (Scrabble-acceptable)";
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
    if (guess === word) {
        return WIN;
    }
    return guess > word ? BEFORE : AFTER;
}

function handleWin() {
    const stats = document.getElementById('stats');
    const winTime = new Date();
    stats.innerText = `(${numberOfGuesses} guesses in ${getFormattedTime(startTime, winTime)})`;
    getInput().disabled = true;
    getForm().classList.add('show-win');
}

function getFormattedTime(start, end) {
    let seconds = Math.round((end - start) / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    const formattedTime = [];
    hours && formattedTime.push(hours + 'h');
    minutes && formattedTime.push(minutes + 'm');
    seconds && formattedTime.push(seconds + 's');

    return formattedTime.join(' ') || '0s';
}


function recordGuess(guess, comparison) {
    removeClass('current-guess');

    insertGuess(generateGuessElement(), comparison);
    
    revealLabel(comparison);

    function generateGuessElement() {
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
    const guess = guessElement.dataset.guess;
    const previousGuess = previousGuessElement.dataset.guess;
    return (comparison === AFTER && previousGuess < guess) ||
        (comparison === BEFORE && previousGuess > guess);
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

function giveUp() {
    if (!confirm('Really give up?')) {
        return;
    }
    const input = getInput();
    input.value = word;
    input.disabled = true;
    getForm().classList.add('gave-up');
}

function changeDifficulty(newDifficulty) {
    const haveMadeGuesses = getGuesses().length > 0;
    const formClasses = getForm().classList;
    const haveWonOrGivenUp = formClasses.contains('show-win') || formClasses.contains('gave-up');
    const difficultyChanger = getDifficultyChanger();
    if (haveMadeGuesses && !haveWonOrGivenUp && !confirm('Change difficulty and lose current guesses?')) {
        difficultyChanger.value = difficulty;
        return;
    }
    if (newDifficulty) {
        difficultyChanger.value = newDifficulty;
    } else {
        newDifficulty = difficultyChanger.value;
    }
    difficulty = newDifficulty;
    setup();
}

// Utilities

// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
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

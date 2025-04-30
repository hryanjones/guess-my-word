describe('main game page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    const MOCK_DATE = new Date(1745883217081); // expected normal word is "piano", hard word is "vex"

    describe('basic elements for today', () => {
        it('has basic elements such as title and instructions', () => {
            playPageHasExpectedElements();
        });
    });

    describe('play for specific day', () => {
        beforeEach(() => {
            cy.clock(MOCK_DATE);
        });

        it('should let you make a guess by clicking "submit"', () => {
            makeGuess('open', { useEnter: true });

            assertVisibleGuesses({ expectedAboveWords: 'is after: open' });
        });

        it('should let you make a guess by pressing enter', () => {
            makeGuess('star');

            assertVisibleGuesses({ expectedBelowWords: 'is before: star' });
        });

        it('should sort guesses correctly', () => {
            makeGuess('blue');
            makeGuess('zoo');
            makeGuess('apple');
            makeGuess('open');
            makeGuess('star');
            makeGuess('tart');

            assertVisibleGuesses({
                expectedAboveWords: 'is after: apple blue open',
                expectedBelowWords: 'is before: star tart zoo',
            });
        });

        describe('warnings', () => {
            it('should warn you if the guess is not in the dictionary', () => {
                cy.get('#guess-error').should('not.exist');

                makeGuess('gooberschniggens');
                cy.get('#guess-error').should('be.visible');
                cy.get('#guess-error').should('contain.text', 'Guess must be an English word. (Scrabble-acceptable)');

                typingANewWordShouldClearTheError();
            });

            it('should warn you if the guess is empty', () => {
                cy.get('#guess-error').should('not.exist');

                makeGuess(' ');
                cy.get('#guess-error').should('be.visible');
                cy.get('#guess-error').should('contain.text', "Guess can't be empty");

                typingANewWordShouldClearTheError();
            });

            function typingANewWordShouldClearTheError() {
                cy.get('#guess-error').should('be.visible');

                cy.wait(200);
                makeGuess('valid');
                cy.get('#guess-error').should('not.exist');
            }
        });

        it('should not let you give up before 1 guesses', () => {});

        it('should let you give up after 1 guesses', () => {
            cy.get('#give-up-label').should('not.exist');
            cy.get('#give-up').should('not.exist');

            makeGuess('open');

            cy.get('#give-up').should('be.visible');
            cy.get('#give-up').click();
            cy.get('#give-up-label').should('be.visible');
            cy.get('#give-up-label').should('contain.text', 'My word is:');
            cy.get('#new-guess').should('have.value', 'piano').should('be.disabled');
        });

        it('should allow for winning', () => {
            makeGuess('open');
            makeGuess('star');
            makeGuess('piano');

            cy.get('#win-title').should('contain.text', 'You got it! 🎉🎉🎉');
            cy.get('#win-stats-short').should('contain.text', '(3 guesses in 0s)');

            cy.get('#new-guess').should('have.value', 'piano').should('be.disabled');

            cy.get('.leaderboard-form')
                .should('be.visible')
                .should('contain.text', 'enter your name for the completion board');
        });

        describe('hard word', () => {
            it('should let you change the difficulty', () => {
                changeToHard();
            });

            it('should sort words correctly after changing difficulty', () => {
                changeToHard();

                makeGuess('blue');
                makeGuess('zoo');
                makeGuess('apple');
                makeGuess('open');
                makeGuess('star');
                makeGuess('tart');
                makeGuess('piano');

                assertVisibleGuesses({
                    expectedAboveWords: 'is after: apple blue open piano star tart',
                    expectedBelowWords: 'is before: zoo',
                });
            });

            function changeToHard() {
                const difficultyElement = cy.get('#difficulty-changer');
                difficultyElement.should('be.visible').should('have.value', 'normal');

                difficultyElement.select('hard');

                difficultyElement.should('be.visible').should('have.value', 'hard');
            }
        });
    });
});

function playPageHasExpectedElements() {
    // make sure there's an h1 that says "Guess my word"
    cy.get('h1').should('have.text', 'Guess my word');

    cy.get('#instructions').should(
        'contain.text',
        "I'm thinking of an English word. Make guesses below and I'll tell you if my word is alphabetically before",
    );

    // this happens after loading the dictionary
    cy.get('#new-guess').should('have.attr', 'placeholder', 'type a word then -->');
    cy.get('#submit-guess').should('have.value', 'guess');

    cy.get('#difficulty-changer').should('be.visible').should('have.value', 'normal');
}

function makeGuess(guess, { useEnter } = {}) {
    cy.get('#new-guess').clear().type(guess);
    if (useEnter !== false) {
        cy.get('#new-guess').type('{enter}');
    } else {
        cy.get('#submit-guess').click();
    }
}

function assertVisibleGuesses({ expectedAboveWords, expectedBelowWords }) {
    if (expectedAboveWords) {
        cy.get('#after-guesses-container')
            .invoke('text')
            .then((text) => text.replace(/\s+/g, ' ').trim())
            .should('eq', expectedAboveWords || '');
    } else {
        cy.get('#after-guesses-container').should('not.exist');
    }

    if (expectedBelowWords) {
        cy.get('#before-guesses-container')
            .invoke('text')
            .then((text) => text.replace(/\s+/g, ' ').trim())
            .should('eq', expectedBelowWords || '');
    } else {
        cy.get('#before-guesses-container').should('not.exist');
    }
}

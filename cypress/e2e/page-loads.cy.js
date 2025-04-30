describe('main game page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    const MOCK_DATE = new Date(1745883217081); // expected normal word is "piano"

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
            makeGuess('open');

            assertVisibleGuesses({ expectedAboveWords: 'is after: open' });
        });

        it('should let you make a guess by pressing enter', () => {
            const GUESS = 'star';

            makeGuess(GUESS, { useEnter: true });

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

        it('should allow for winning');
        it('should not let you give up before X guesses');
        it('should let you give up after X guesses');

        it('should let you change the difficulty');

        it('should sort words correctly after changing difficulty');
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
    cy.get('#new-guess').type(guess);
    if (useEnter) {
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

describe('leader board page', () => {
    const MOCK_DATE = new Date(1745883217081); // expected normal word is "piano", hard word is "vex"

    beforeEach(() => {
        cy.clock(MOCK_DATE);
    });

    describe('when the leaderboard is unavailable', () => {
        it('shows a warning if the leaderboard cannot be reached', () => {
            cy.intercept('GET', 'https://192.168.0.144/leaderboard/2025-04-28/wordlist/normal', {
                statusCode: 500,
                times: 1,
            });
            cy.visit('http://localhost:8080/board.html');

            cy.get('.error')
                .should('be.visible')
                .should(
                    'contain.text',
                    'Sorry, the completion board is having trouble right now. Please try again in a little bit. (contact @guessmyword1 on Twitter or @hryanjones on BlueSky if it persists)',
                );
        });
    });

    describe('for normal board', () => {
        beforeEach(() => {
            cy.visit('http://localhost:8080/board.html');
        });

        it('should have expected elements', () => {
            cy.get('h2').should('be.visible').should('contain.text', 'Completion board for "normal"');

            cy.get('#leaderboard-header').should('be.visible').should('contain.text', 'name (251)');

            cy.get('[data-index="0"]')
                .should('be.visible')
                .within(() => {
                    cy.get('.name-cell').should('contain.text', 'jekyll');
                    cy.get('.numberOfGuesses-cell').should('contain.text', '5');
                    cy.get('.time-cell').should('contain.text', '4s');
                    cy.get('.awards-cell').should('contain.text', '🏆 fastest, 🏆 fewest guesses');
                });
        });
    });
});

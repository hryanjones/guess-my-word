describe('page load', () => {
    it('has basic elements such as title', () => {
        cy.visit('http://localhost:8080');

        // make sure there's an h1 that says "Guess my word"
        cy.get('h1').should('have.text', 'Guess my word');

        cy.get('#instructions').should(
            'contain.text',
            "I'm thinking of an English word. Make guesses below and I'll tell you if my word is alphabetically before",
        );
    });
});

describe('OrangeHRM Login - Security Tests', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
  })

  context('SQL Injection Prevention', () => {
    it('Should prevent SQL injection attacks in login fields', () => {
      cy.fixture('loginuser').then((testData) => {
        const testCase = testData.sqlInjection
        cy.log(`**${testCase.testCase}: Testing SQL injection prevention**`)
        
        // Enter SQL injection payloads
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-sql-injection-attempt`)
        
        // Verify fields accept the input (but should not execute)
        cy.get('[name="username"]').should('have.value', testCase.username)
        cy.get('[name="password"]').should('have.value', testCase.password)
        
        // Submit form
        cy.get('[type="submit"]').click()
        
        // Verify SQL injection is prevented
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-injection-prevented`)
        
        // Verify no database errors or SQL syntax displayed
        cy.get('body').should('not.contain', 'SQL')
        cy.get('body').should('not.contain', 'syntax error')
        cy.get('body').should('not.contain', 'mysql')
        cy.get('body').should('not.contain', 'database')
        
        // Verify still on login page (not bypassed)
        cy.url().should('include', '/auth/login')
        cy.get('[name="username"]').should('be.visible')
      })
    })
  })
})
describe('OrangeHRM Login - Failed Login Test', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
  })

  context('Invalid Credentials Tests', () => {
    it('Should show error with invalid username and valid password', () => {
      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[0]
        cy.log(`**${testCase.testCase}: Testing invalid username**`)
        
        // Enter invalid username and valid password
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-credentials-entered`)
        
        // Submit form
        cy.get('[type="submit"]').click()
        
        // Verify error message
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-error-displayed`)
        
        // Verify still on login page
        cy.url().should('include', '/auth/login')
        cy.get('[name="username"]').should('be.visible')
      })
    })

    it('Should show error with valid username and invalid password', () => {
      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[1]
        cy.log(`**${testCase.testCase}: Testing invalid password**`)
        
        // Enter username and password
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-credentials-entered`)
        
        // Submit form
        cy.get('[type="submit"]').click()
        
        // Verify error message
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-error-displayed`)
        
        // Verify fields are still visible for retry
        cy.get('[name="username"]').should('be.visible')
        cy.get('[name="password"]').should('be.visible')
      })
    })

    it('Should show error with both invalid credentials', () => {
      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[2]
        cy.log(`**${testCase.testCase}: Testing both invalid credentials**`)
        
        // Enter invalid credentials
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-credentials-entered`)
        
        // Submit form
        cy.get('[type="submit"]').click()
        
        // Verify error message
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-error-displayed`)
        
        // Verify error styling
        cy.get('.oxd-alert--error').should('be.visible')
        cy.get('.oxd-alert-content--error').should('have.css', 'color')
      })
    })
  })
  context('Empty Fields Validation Tests', () => {
    it('Should show validation error when both fields are empty', () => {
      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.emptyCredentials[0]
        cy.log(`**${testCase.testCase}: Testing empty credentials**`)
        
        // Leave both fields empty and submit
        cy.get('[name="username"]').clear()
        cy.get('[name="password"]').clear()
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-empty-fields`)
        
        // Click submit
        cy.get('[type="submit"]').click()
        
        // Verify validation message
        cy.get('.oxd-input-field-error-message')
          .first()
          .should('contain.text', 'Required')
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-validation-error`)
        
        // Verify still on login page
        cy.url().should('include', '/auth/login')
      })
    })
  })
})
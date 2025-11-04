describe('OrangeHRM Login Failed - With Intercept', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
    
    // Intercept untuk monitoring semua login attempts
    cy.intercept('POST', '**/auth/validate').as('loginAttempt')
  })

  context('Invalid Credentials with Intercept Monitoring', () => {
    it('Monitor invalid username request', () => {
      cy.fixture('loginuser').then((testData) => {
        const testCase = testData.invalidCredentials[0]
        cy.log(`**${testCase.testCase}: Testing invalid username with intercept monitoring**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Monitor the login attempt
        cy.wait('@loginAttempt').then((interception) => {
          expect(interception.request.body.username).to.eq('InvalidUser')
          expect(interception.request.body.password).to.eq('admin123')
          cy.log('Invalid username request monitored successfully')
          cy.log(`Response status: ${interception.response.statusCode}`)
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })

    it('Monitor invalid password request', () => {
      cy.fixture('loginuser').then((testData) => {
        const testCase = testData.invalidCredentials[1]
        cy.log(`**${testCase.testCase}: Testing invalid password with intercept monitoring**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Monitor the login attempt
        cy.wait('@loginAttempt').then((interception) => {
          expect(interception.request.body.username).to.eq('Admin')
          expect(interception.request.body.password).to.eq('wrongpassword')
          cy.log('Invalid password request monitored successfully')
          cy.log(`Response status: ${interception.response.statusCode}`)
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })

    it('Monitor both invalid credentials request', () => {
      cy.fixture('loginuser').then((testData) => {
        const testCase = testData.invalidCredentials[2]
        cy.log(`**${testCase.testCase}: Testing both invalid credentials with intercept monitoring**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Monitor the login attempt
        cy.wait('@loginAttempt').then((interception) => {
          expect(interception.request.body.username).to.eq('InvalidUser')
          expect(interception.request.body.password).to.eq('wrongpassword')
          cy.log('Both invalid credentials request monitored successfully')
          cy.log(`Response status: ${interception.response.statusCode}`)
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })
  })
})
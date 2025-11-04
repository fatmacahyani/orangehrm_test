describe('OrangeHRM Login Failed - With Intercept', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
  })

  context('Invalid Credentials with Intercept', () => {
    it('Invalid username with intercept monitoring', () => {
      // Intercept khusus untuk invalid username
      cy.intercept('POST', '**/auth/validate', (req) => {
        if (req.body.username !== 'Admin') {
          req.reply({
            statusCode: 401,
            body: {
              error: true,
              message: 'Invalid credentials',
              errorCode: 'AUTH_FAILED_USERNAME'
            },
            headers: {
              'X-Auth-Error': 'invalid-username'
            }
          })
        }
      }).as('invalidUsernameRequest')

      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[0]
        cy.log(`**${testCase.testCase}: Testing invalid username with intercept**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Verify intercept caught invalid username
        cy.wait('@invalidUsernameRequest').then((interception) => {
          expect(interception.request.body.username).to.eq('InvalidUser')
          expect(interception.response.statusCode).to.eq(401)
          expect(interception.response.body.errorCode).to.eq('AUTH_FAILED_USERNAME')
          cy.log('Invalid username request intercepted and handled')
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })

    it('Invalid password with intercept monitoring', () => {
      // Intercept khusus untuk invalid password
      cy.intercept('POST', '**/auth/validate', (req) => {
        if (req.body.username === 'Admin' && req.body.password !== 'admin123') {
          req.reply({
            statusCode: 401,
            body: {
              error: true,
              message: 'Invalid credentials',
              errorCode: 'AUTH_FAILED_PASSWORD'
            },
            headers: {
              'X-Auth-Error': 'invalid-password',
              'X-Failed-Attempts': '1'
            }
          })
        }
      }).as('invalidPasswordRequest')

      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[1]
        cy.log(`**${testCase.testCase}: Testing invalid password with intercept**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Verify intercept caught invalid password
        cy.wait('@invalidPasswordRequest').then((interception) => {
          expect(interception.request.body.password).to.eq('wrongpass123')
          expect(interception.response.statusCode).to.eq(401)
          expect(interception.response.body.errorCode).to.eq('AUTH_FAILED_PASSWORD')
          expect(interception.response.headers['x-failed-attempts']).to.eq('1')
          cy.log('Invalid password request intercepted with attempt tracking')
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })

    it('Both invalid credentials with intercept monitoring', () => {
      // Intercept khusus untuk both invalid credentials
      cy.intercept('POST', '**/auth/validate', (req) => {
        if (req.body.username !== 'Admin' && req.body.password !== 'admin123') {
          req.reply({
            statusCode: 401,
            body: {
              error: true,
              message: 'Invalid credentials',
              errorCode: 'AUTH_FAILED_BOTH'
            },
            headers: {
              'X-Auth-Error': 'invalid-both-credentials',
              'X-Security-Level': 'high-risk'
            }
          })
        }
      }).as('bothInvalidRequest')

      cy.fixture('loginTestData').then((testData) => {
        const testCase = testData.invalidCredentials[2]
        cy.log(`**${testCase.testCase}: Testing both invalid credentials with intercept**`)
        
        cy.get('[name="username"]').clear().type(testCase.username)
        cy.get('[name="password"]').clear().type(testCase.password)
        cy.get('[type="submit"]').click()
        
        // Verify intercept caught both invalid credentials
        cy.wait('@bothInvalidRequest').then((interception) => {
          expect(interception.request.body.username).to.eq('wrongpassword')
          expect(interception.request.body.password).to.eq('wrongpassword')
          expect(interception.response.statusCode).to.eq(401)
          expect(interception.response.body.errorCode).to.eq('AUTH_FAILED_BOTH')
          expect(interception.response.headers['x-security-level']).to.eq('high-risk')
          cy.log('Both invalid credentials intercepted with security marking')
        })
        
        cy.verifyLoginFailure(testCase.expectedError)
        cy.takeScreenshotWithTimestamp(`${testCase.testCase}-intercepted`)
      })
    })
  })
})
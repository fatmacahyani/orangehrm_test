describe('OrangeHRM Login Success - With Intercept', () => {
  beforeEach(() => {
    // Intercept khusus untuk login success
    cy.intercept('POST', '**/auth/validate', (req) => {
      // Validasi request body untuk login success
      if (req.body.username === 'Admin' && req.body.password === 'admin123') {
        req.reply({
          statusCode: 302,
          headers: {
            'Location': '/web/index.php/dashboard/index',
            'Set-Cookie': 'orangehrm=valid_session_token; Path=/'
          },
          body: {
            success: true,
            redirect: '/web/index.php/dashboard/index'
          }
        })
      }
    }).as('loginSuccessRequest')

    // Intercept untuk dashboard data setelah login berhasil
    cy.intercept('GET', '**/dashboard/index', {
      statusCode: 200,
      fixture: 'dashboard-data.json'
    }).as('dashboardDataRequest')
  })

  it('Should successfully login with valid credentials using intercept', () => {
    cy.fixture('LoginTest').then((testData) => {
      cy.log('**Testing valid login with intercept monitoring**')
      
      // Verify login page elements
      cy.verifyLoginPageElements()
      cy.takeScreenshotWithTimestamp('TC_001-login-page-loaded')
      
      // Enter valid credentials
      cy.get('[name="username"]').clear().type(testData.validCredentials.username)
      cy.get('[name="password"]').clear().type(testData.validCredentials.password)
      cy.takeScreenshotWithTimestamp('TC_001-credentials-entered')
      
      // Submit form
      cy.get('[type="submit"]').click()
      
      // Wait for and verify login request intercept
      cy.wait('@loginSuccessRequest').then((interception) => {
        expect(interception.request.body).to.deep.include({
          username: 'Admin',
          password: 'admin123'
        })
        expect(interception.response.statusCode).to.eq(302)
        cy.log('Login request intercepted successfully')
      })
      
      // Wait for dashboard data request
      cy.wait('@dashboardDataRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('Dashboard data loaded successfully')
      })
      
      // Verify successful login
      cy.verifyLoginSuccess()
      cy.takeScreenshotWithTimestamp('TC_001-login-success-intercepted')
      
      // Cleanup
      cy.logout()
    })
  })

  it('Should maintain session with intercept validation', () => {
    // Intercept untuk session validation
    cy.intercept('GET', '**/auth/validateSession', {
      statusCode: 200,
      body: { valid: true, user: 'Admin' }
    }).as('sessionValidation')

    cy.fixture('LoginTest').then((testData) => {
      cy.loginWithCredentials(testData.validCredentials.username, testData.validCredentials.password)
      
      // Wait for login success
      cy.wait('@loginSuccessRequest')
      cy.verifyLoginSuccess()
      
      // Navigate and verify session
      cy.get('[href="/web/index.php/admin/viewAdminModule"]').click()
      cy.wait('@sessionValidation')
      
      cy.logout()
    })
  })
})
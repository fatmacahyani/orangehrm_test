describe('OrangeHRM Login Success - With Intercept', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
    
    // Intercept untuk monitoring login requests (tidak mengubah response)
    cy.intercept('POST', '**/auth/validate').as('loginRequest')
    
    // Intercept untuk monitoring dashboard loading
    cy.intercept('GET', '**/dashboard/**').as('dashboardRequest')
  })

  it('Should successfully login with valid credentials using intercept monitoring', () => {
    cy.fixture('loginuser').then((testData) => {
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
      cy.wait('@loginRequest').then((interception) => {
        // Check if request body contains the credentials (form-encoded data)
        const requestBody = interception.request.body
        expect(requestBody).to.include('username=Admin')
        expect(requestBody).to.include('password=admin123')
        cy.log('Login request intercepted and monitored successfully')
        cy.log(`Response status: ${interception.response.statusCode}`)
      })
      
      // Verify successful login
      cy.verifyLoginSuccess()
      cy.takeScreenshotWithTimestamp('TC_001-login-success-intercepted')
      
      // Cleanup
      cy.logout()
    })
  })

  it('Should maintain session with intercept validation', () => {
    cy.fixture('loginuser').then((testData) => {
      cy.loginWithCredentials(testData.validCredentials.username, testData.validCredentials.password)
      
      // Wait for login request
      cy.wait('@loginRequest')
      cy.verifyLoginSuccess()
      
      // Navigate and verify session
      cy.get('[href="/web/index.php/admin/viewAdminModule"]').click()
      cy.url().should('include', '/admin')
      
      cy.logout()
    })
  })
})
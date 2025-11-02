describe('OrangeHRM Login - Login Success Test', () => {
  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.waitForPageLoad()
  })

  context('Valid Login Scenarios', () => {
    it('Should successfully login with valid credentials and redirect to dashboard', () => {
      // Test Data
      cy.fixture('LoginTest').then((testData) => {
        // Test Steps
        cy.log('**Testing valid login credentials**')
        
        // Verify login page is loaded
        cy.verifyLoginPageElements()
        cy.takeScreenshotWithTimestamp('login-page-loaded')
        
        // Enter valid credentials
        cy.get('[name="username"]')
          .should('be.visible')
          .clear()
          .type(testData.validCredentials.username)
          .should('have.value', testData.validCredentials.username)
          
        cy.get('[name="password"]')
          .should('be.visible')
          .clear() 
          .type(testData.validCredentials.password)
          .should('have.value', testData.validCredentials.password)
          
        cy.takeScreenshotWithTimestamp('credentials-entered')

        // Click login button
        cy.get('[type="submit"]')
          .should('be.visible')
          .should('contain.text', 'Login')
          .click()
          
        // Verify successful login
        cy.verifyLoginSuccess()
        cy.takeScreenshotWithTimestamp('login-success')

        // Verify dashboard elements
        cy.get('.oxd-topbar-header-title').should('contain.text', 'Dashboard')
        cy.get('.orangehrm-dashboard-widget').should('have.length.greaterThan', 0)
    
        // Cleanup: Logout
        cy.logout()
        cy.takeScreenshotWithTimestamp('logout-success')
      })
    })

    it('Should maintain session and allow navigation after login', () => {
      cy.fixture('LoginTest').then((testData) => {
        cy.log('**Testing session maintenance**')

        // Login
        cy.loginWithCredentials(testData.validCredentials.username, testData.validCredentials.password)
        cy.verifyLoginSuccess()
        
        // Navigate to different modules
        cy.get('[href="/web/index.php/admin/viewAdminModule"]').click()
        cy.url().should('include', '/admin')
        cy.get('.oxd-topbar-header-breadcrumb-module').should('contain.text', 'Admin')
        
        // Navigate back to dashboard
        cy.get('[href="/web/index.php/dashboard/index"]').click()
        cy.verifyLoginSuccess()
        
        // Verify session is still active
        cy.get('.oxd-userdropdown-name').should('be.visible')
        
        // Cleanup
        cy.logout()
      })
    })
  })
})
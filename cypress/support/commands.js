// Custom command untuk clear session dan cookies
Cypress.Commands.add('clearSession', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})

// Custom command untuk login dengan parameter
Cypress.Commands.add('loginWithCredentials', (username, password) => {
  cy.visit('/web/index.php/auth/login')
  cy.get('[name="username"]').clear().type(username)
  cy.get('[name="password"]').clear().type(password)
  cy.get('[type="submit"]').click()
})

// Custom command untuk verify login success
Cypress.Commands.add('verifyLoginSuccess', () => {
  cy.url().should('include', '/web/index.php/dashboard/index')
  cy.get('.oxd-topbar-header-breadcrumb-module').should('contain.text', 'Dashboard')
  cy.get('.oxd-userdropdown-name').should('be.visible')
})

// Custom command untuk verify login failure
Cypress.Commands.add('verifyLoginFailure', (expectedMessage) => {
  cy.url().should('include', '/web/index.php/auth/login')
  cy.get('.oxd-alert-content--error').should('contain.text', expectedMessage)
})

// Custom command untuk wait page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.orangehrm-login-container').should('be.visible')
  cy.get('[name="username"]').should('be.visible')
  cy.get('[name="password"]').should('be.visible')
  cy.get('[type="submit"]').should('be.visible')
})

// Custom command untuk take screenshot with timestamp
Cypress.Commands.add('takeScreenshotWithTimestamp', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  cy.screenshot(`${name}-${timestamp}`)
})

// Custom command untuk check page elements visibility
Cypress.Commands.add('verifyLoginPageElements', () => {
  cy.get('.orangehrm-login-branding img').should('be.visible') 
  cy.get('.orangehrm-login-title').should('contain.text', 'Login') 
  cy.get('[name="username"]').should('be.visible') 
  cy.get('[name="password"]').should('be.visible') 
  cy.get('[type="submit"]').should('be.visible') 
  cy.get('.orangehrm-copyright').should('be.visible')
})

// Custom command untuk logout
Cypress.Commands.add('logout', () => {
  cy.get('.oxd-userdropdown').click()
  cy.get('[href="/web/index.php/auth/logout"]').click()
  cy.url().should('include', '/web/index.php/auth/login')
})
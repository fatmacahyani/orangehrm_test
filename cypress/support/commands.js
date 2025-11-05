// ***********************************************
// Custom commands for OrangeHRM Test Automation
// Supports both standard and Page Object Model approaches
// ***********************************************

// Import Page Objects for POM commands
let LoginPage, DashboardPage
try {
  LoginPage = require('../page-objects/LoginPage').default
  DashboardPage = require('../page-objects/DashboardPage').default
} catch (e) {
  // POM files not available, skip POM commands
}

// ===============================================
// STANDARD COMMANDS (for original test files)
// ===============================================

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

// ===============================================
// PAGE OBJECT MODEL COMMANDS (for POM test files)
// ===============================================

// POM-based login command
Cypress.Commands.add('loginViaPOM', (username, password) => {
  if (LoginPage && DashboardPage) {
    const loginPage = new LoginPage()
    const dashboardPage = new DashboardPage()
    
    loginPage
      .visit()
      .loginWithCredentials(username, password)
    
    dashboardPage.waitForDashboardLoad()
  } else {
    throw new Error('Page Object files not found. Please ensure LoginPage.js and DashboardPage.js exist.')
  }
})

// POM-based logout command
Cypress.Commands.add('logoutViaPOM', () => {
  if (DashboardPage) {
    const dashboardPage = new DashboardPage()
    dashboardPage.logout()
  } else {
    throw new Error('DashboardPage.js not found.')
  }
})

// Test data loading command
Cypress.Commands.add('loadTestData', (dataType) => {
  return cy.fixture('loginuser').then((data) => {
    return data[dataType]
  })
})

// Page Object factory command
Cypress.Commands.add('getPageObject', (pageName) => {
  if (!LoginPage || !DashboardPage) {
    throw new Error('Page Object files not found.')
  }
  
  switch(pageName.toLowerCase()) {
    case 'login':
      return new LoginPage()
    case 'dashboard':
      return new DashboardPage()
    default:
      throw new Error(`Page object '${pageName}' not found`)
  }
})
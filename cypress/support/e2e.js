// Support file for OrangeHRM Test Automation

import './commands'


require('cypress-xpath')

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Before each test
beforeEach(() => {
  // Clear session before each test
  cy.clearSession()
  
  // Set viewport for consistent testing
  cy.viewport(1280, 720)
})

// After each test
afterEach(() => {
  // Take screenshot if test failed
  if (Cypress.currentTest.state === 'failed') {
    cy.takeScreenshotWithTimestamp(`failed-${Cypress.currentTest.title}`)
  }
})
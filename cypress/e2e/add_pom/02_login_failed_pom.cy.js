import LoginPage from '../../page-objects/LoginPage'
import LoginData from '../../data/LoginData'
import TestScenarios from '../../data/TestScenario'

describe('OrangeHRM Login Negative Tests - POM', () => {
  let loginPage
  let invalidCredentials
  let emptyCredentials

  beforeEach(() => {
    // Initialize Page Objects
    loginPage = new LoginPage()
    
    // Initialize Test Data
    invalidCredentials = LoginData.getInvalidCredentials()
    emptyCredentials = LoginData.getEmptyCredentials()
    
    // Setup intercepts for monitoring
    cy.intercept('POST', '**/auth/validate').as('loginRequest')
    
    // Visit login page
    loginPage.visit()
  })

  context('Invalid Credentials Tests', () => {
    it('TC_002: Should show error with invalid username and valid password', () => {
      const testCase = invalidCredentials[0]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      cy.log(`Scenario: ${testCase.scenario}`)
      
      // Step 1: Enter invalid credentials using POM
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-step1-credentials-entered`)
      
      // Step 2: Submit form
      loginPage.clickLoginButton()
      
      // Step 3: Wait for and verify failed login request
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.body.username).to.eq(testCase.username)
        expect(interception.response.statusCode).to.eq(302) // Redirect with error
        cy.log('Failed login request intercepted')
      })
      
      // Step 4: Verify error message using POM
      loginPage
        .verifyLoginError(testCase.expectedError)
        .verifyStillOnLoginPage()
        .takeScreenshot(`${testCase.testCase}-step4-error-displayed`)
      
      cy.log(`Test ${testCase.testCase} completed - Error handled correctly`)
    })

    it('Should show error with valid username and invalid password', () => {
      const testCase = invalidCredentials[1]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      
      // Use POM for all interactions
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-credentials-entered`)
        .clickLoginButton()
      
      cy.wait('@loginRequest')
      
      loginPage
        .verifyLoginError(testCase.expectedError)
        .verifyFieldsVisible()
        .takeScreenshot(`${testCase.testCase}-error-verified`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })

    it('Should show error with both invalid credentials', () => {
      const testCase = invalidCredentials[2]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      
      loginPage
        .loginWithCredentials(testCase.username, testCase.password)
        .takeScreenshot(`${testCase.testCase}-credentials-entered`)
      
      cy.wait('@loginRequest')
      
      loginPage
        .verifyLoginError(testCase.expectedError)
        .verifyErrorStyling()
        .takeScreenshot(`${testCase.testCase}-error-styling-verified`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })
  })

  context('Empty Fields Validation Tests', () => {
    it('Should show validation error when both fields are empty', () => {
      const testCase = emptyCredentials[0]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      
      // Step 1: Leave fields empty and submit using POM
      loginPage
        .clearCredentials()
        .takeScreenshot(`${testCase.testCase}-empty-fields`)
        .clickLoginButton()
      
      // Step 2: Verify validation error using POM
      loginPage
        .verifyValidationError()
        .verifyStillOnLoginPage()
        .takeScreenshot(`${testCase.testCase}-validation-error`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })

    it('Should show validation error when username is empty', () => {
      const testCase = emptyCredentials[1]
      
      cy.log(`**${testCase.testCase}: Testing empty username validation**`)
      
      loginPage
        .enterUsername(testCase.username) // Empty string
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-empty-username`)
        .clickLoginButton()
      
      loginPage
        .verifyValidationError('username')
        .verifyFieldRetainsValue('password', testCase.password)
        .takeScreenshot(`${testCase.testCase}-username-validation`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })

    it('Should show validation error when password is empty', () => {
      const testCase = emptyCredentials[2]
      
      cy.log(`**${testCase.testCase}: Testing empty password validation**`)
      
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password) // Empty string
        .takeScreenshot(`${testCase.testCase}-empty-password`)
        .clickLoginButton()
      
      loginPage
        .verifyValidationError('password')
        .verifyFieldRetainsValue('username', testCase.username)
        .takeScreenshot(`${testCase.testCase}-password-validation`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })
  })
})
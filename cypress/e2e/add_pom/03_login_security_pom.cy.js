import LoginPage from '../../page-objects/LoginPage'
import LoginData from '../../data/LoginData'
import TestScenarios from '../../data/TestScenario'

describe('OrangeHRM Login Security Tests - POM', () => {
  let loginPage
  let specialCharCredentials
  let sqlInjectionCredentials

  beforeEach(() => {
    // Initialize Page Objects
    loginPage = new LoginPage()
    
    // Initialize Test Data
    specialCharCredentials = LoginData.getSpecialCharacterCredentials()
    sqlInjectionCredentials = LoginData.getSQLInjectionCredentials()
    
    // Setup security monitoring intercepts
    cy.intercept('POST', '**/auth/validate').as('securityTestRequest')
    
    // Visit login page
    loginPage.visit()
  })

  context('Special Characters Handling', () => {
    it('TC_008: Should handle special characters in username gracefully', () => {
      const testCase = specialCharCredentials[0]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      cy.log(`Testing special characters: ${testCase.username}`)
      
      // Step 1: Enter special characters using POM
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-special-chars-entered`)
      
      // Step 2: Verify field accepts special characters
      loginPage.getFieldValue('username').then((value) => {
        expect(value).to.eq(testCase.username)
        cy.log('Special characters accepted in username field')
      })
      
      // Step 3: Submit form
      loginPage.clickLoginButton()
      
      // Step 4: Wait for and verify security handling
      cy.wait('@securityTestRequest').then((interception) => {
        expect(interception.request.body.username).to.include('@#$')
        cy.log('Special characters handled in request')
      })
      
      // Step 5: Verify appropriate error handling
      loginPage
        .verifyLoginError(testCase.expectedError)
        .takeScreenshot(`${testCase.testCase}-error-handling`)
      
      // Step 6: Verify no script execution or security issues
      cy.get('body').should('not.contain', '<script>')
      cy.window().should('not.have.property', 'alert')
      
      cy.log(`Test ${testCase.testCase} completed - Special characters handled securely`)
    })

    it('TC_009: Should handle special characters in password gracefully', () => {
      const testCase = specialCharCredentials[1]
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-special-chars-password`)
      
      // Verify password field is properly masked
      loginPage.elements.passwordField().should('have.attr', 'type', 'password')
      
      loginPage.clickLoginButton()
      
      cy.wait('@securityTestRequest')
      
      loginPage
        .verifyLoginError(testCase.expectedError)
        .takeScreenshot(`${testCase.testCase}-password-error`)
      
      cy.log(`Test ${testCase.testCase} completed successfully`)
    })
  })

  context('SQL Injection Prevention', () => {
    it('TC_010: Should prevent SQL injection attacks in login fields', () => {
      const testCase = sqlInjectionCredentials
      const testCaseInfo = TestScenarios.getTestCaseById(testCase.testCase)
      
      cy.log(`**${testCase.testCase}: ${testCaseInfo.title}**`)
      cy.log(`Testing SQL injection payload: ${testCase.username}`)
      
      // Step 1: Enter SQL injection payloads using POM
      loginPage
        .enterUsername(testCase.username)
        .enterPassword(testCase.password)
        .takeScreenshot(`${testCase.testCase}-sql-injection-entered`)
      
      // Step 2: Verify fields accept the input (but should not execute)
      loginPage.getFieldValue('username').then((value) => {
        expect(value).to.eq(testCase.username)
        cy.log('SQL injection payload accepted in field (for testing)')
      })
      
      // Step 3: Submit form
      loginPage.clickLoginButton()
      
      // Step 4: Wait for and verify SQL injection prevention
      cy.wait('@securityTestRequest').then((interception) => {
        expect(interception.request.body.username).to.include("OR '1'='1")
        cy.log('SQL injection payload sent in request (for prevention testing)')
      })
      
      // Step 5: Verify SQL injection is prevented
      loginPage
        .verifyLoginError(testCase.expectedError)
        .takeScreenshot(`${testCase.testCase}-injection-prevented`)
      
      // Step 6: Verify no database errors or SQL syntax displayed
      cy.get('body').should('not.contain', 'SQL')
      cy.get('body').should('not.contain', 'syntax error')
      cy.get('body').should('not.contain', 'mysql')
      cy.get('body').should('not.contain', 'database')
      
      // Step 7: Verify still on login page (not bypassed)
      loginPage
        .verifyStillOnLoginPage()
        .takeScreenshot(`${testCase.testCase}-security-verified`)
      
      cy.log(`Test ${testCase.testCase} completed - SQL injection prevented successfully`)
    })
  })

  context('Security Monitoring and Logging', () => {
    it('Should log and monitor security attempts', () => {
      cy.log('**Security Monitoring: Testing all security scenarios**')
      
      const allSecurityTests = [
        ...specialCharCredentials,
        sqlInjectionCredentials
      ]
      
      allSecurityTests.forEach((testCase, index) => {
        cy.log(`\n--- Security Test ${index + 1}: ${testCase.scenario || testCase.testCase} ---`)
        
        loginPage
          .clearCredentials()
          .enterUsername(testCase.username)
          .enterPassword(testCase.password)
          .clickLoginButton()
        
        cy.wait('@securityTestRequest')
        
        loginPage.verifyLoginError(testCase.expectedError)
        
        cy.log(`Security test ${index + 1} completed`)
      })
      
      cy.log('All security monitoring tests completed successfully')
    })
  })
})
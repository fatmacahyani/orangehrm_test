import LoginPage from '../../page-objects/LoginPage'
import DashboardPage from '../../page-objects/DashboardPage'
import LoginData from '../../data/LoginData'
import TestScenarios from '../../data/TestScenario'

describe('OrangeHRM Login Positive Tests - POM', () => {
  let loginPage
  let dashboardPage
  let testData

  beforeEach(() => {
    // Initialize Page Objects
    loginPage = new LoginPage()
    dashboardPage = new DashboardPage()
    
    // Initialize Test Data
    testData = LoginData.getValidCredentials()
    
    // Setup intercepts for monitoring
    cy.intercept('POST', '**/auth/validate').as('loginRequest')
    cy.intercept('GET', '**/dashboard/**').as('dashboardRequest')
    
    // Visit login page
    loginPage.visit()
  })

  context('Valid Login Scenarios', () => {
    it('Should successfully login with valid credentials and redirect to dashboard', () => {
      const testCase = TestScenarios.getTestCaseById('TC_001')
      const metadata = LoginData.getTestMetadata(testCase.id)
      
      cy.log(`**${testCase.id}: ${testCase.title}**`)
      cy.log(`Test Environment: ${metadata.environment.baseUrl}`)
      cy.log(`Browser: ${metadata.browser.name} ${metadata.browser.version}`)
      
      // Step 1: Verify login page is loaded properly
      loginPage
        .verifyPageElements()
        .takeScreenshot(`${testCase.id}-step1-page-loaded`)
      
      // Step 2: Enter valid credentials using POM
      loginPage
        .enterUsername(testData.username)
        .enterPassword(testData.password)
        .takeScreenshot(`${testCase.id}-step2-credentials-entered`)
      
      // Step 3: Submit login form
      loginPage.clickLoginButton()
      
      // Step 4: Wait for and verify login request
      cy.wait('@loginRequest').then((interception) => {
        const requestBody = interception.request.body
        expect(requestBody).to.include(`username=${testData.username}`)
        expect(requestBody).to.include(`password=${testData.password}`)
        cy.log('Login request intercepted and validated')
      })
      
      // Step 5: Verify successful login and dashboard access
      dashboardPage
        .waitForDashboardLoad()
        .verifyDashboardElements()
        .takeScreenshot(`${testCase.id}-step5-dashboard-loaded`)
      
      // Step 6: Verify dashboard widgets are present
      dashboardPage.getWidgetCount().then((count) => {
        expect(count).to.be.greaterThan(0)
        cy.log(`Dashboard widgets loaded: ${count} widgets found`)
      })
      
      // Step 7: Verify user information
      dashboardPage.getUserDisplayName().then((displayName) => {
        expect(displayName).to.not.be.empty
        cy.log(`User logged in as: ${displayName}`)
      })
      
      // Cleanup: Logout
      dashboardPage
        .logout()
        .takeScreenshot(`${testCase.id}-cleanup-logout`)
      
      cy.log(`Test ${testCase.id} completed successfully`)
    })

    it('Should maintain session and allow navigation after login', () => {
      const testCase = { id: 'TC_001_Extended', title: 'Session Maintenance Test' }
      
      cy.log(`**${testCase.id}: ${testCase.title}**`)
      
      // Step 1: Login using POM
      loginPage.loginWithCredentials(testData.username, testData.password)
      
      // Step 2: Verify login success
      cy.wait('@loginRequest')
      dashboardPage
        .waitForDashboardLoad()
        .verifySessionActive()
      
      // Step 3: Navigate to Admin module
      dashboardPage
        .navigateToAdmin()
        .takeScreenshot(`${testCase.id}-admin-navigation`)
      
      // Step 4: Navigate back to Dashboard
      dashboardPage
        .navigateToDashboard()
        .verifySessionActive()
        .takeScreenshot(`${testCase.id}-dashboard-return`)
      
      // Cleanup
      dashboardPage.logout()
      
      cy.log(`Session maintenance test completed successfully`)
    })
  })
})
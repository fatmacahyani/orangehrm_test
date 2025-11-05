class LoginPage {
  // Selectors (Locators)
  get elements() {
    return {
      // Form Elements
      usernameField: () => cy.get('[name="username"]'),
      passwordField: () => cy.get('[name="password"]'),
      loginButton: () => cy.get('[type="submit"]'),
      
      // Page Elements
      loginContainer: () => cy.get('.orangehrm-login-container'),
      loginTitle: () => cy.get('.orangehrm-login-title'),
      logoImage: () => cy.get('.orangehrm-login-branding img'),
      copyrightText: () => cy.get('.orangehrm-copyright'),
      
      // Error and Success Messages
      errorAlert: () => cy.get('.oxd-alert--error'),
      errorMessage: () => cy.get('.oxd-alert-content--error'),
      fieldErrorMessage: () => cy.get('.oxd-input-field-error-message'),
      
      // Loading Elements
      loadingSpinner: () => cy.get('.oxd-loading-spinner', { timeout: 5000 }),
    }
  }

  // Page Actions
  visit() {
    cy.visit('/web/index.php/auth/login')
    this.waitForPageLoad()
    return this
  }

  waitForPageLoad() {
    this.elements.loginContainer().should('be.visible')
    this.elements.usernameField().should('be.visible')
    this.elements.passwordField().should('be.visible')
    this.elements.loginButton().should('be.visible')
    return this
  }

  enterUsername(username) {
    this.elements.usernameField()
      .should('be.visible')
      .clear()
      .type(username)
      .should('have.value', username)
    return this
  }

  enterPassword(password) {
    this.elements.passwordField()
      .should('be.visible')
      .clear()
      .type(password)
      .should('have.value', password)
    return this
  }

  clickLoginButton() {
    this.elements.loginButton()
      .should('be.visible')
      .should('contain.text', 'Login')
      .click()
    return this
  }

  clearCredentials() {
    this.elements.usernameField().clear()
    this.elements.passwordField().clear()
    return this
  }

  loginWithCredentials(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLoginButton()
    return this
  }

  // Validations and Verifications
  verifyPageElements() {
    this.elements.logoImage().should('be.visible')
    this.elements.loginTitle().should('contain.text', 'Login')
    this.elements.usernameField().should('be.visible')
    this.elements.passwordField().should('be.visible')
    this.elements.loginButton().should('be.visible')
    this.elements.copyrightText().should('be.visible')
    return this
  }

  verifyLoginError(expectedMessage) {
    cy.url().should('include', '/web/index.php/auth/login')
    this.elements.errorMessage().should('contain.text', expectedMessage)
    return this
  }

  verifyValidationError(fieldType = 'username') {
    this.elements.fieldErrorMessage()
      .first()
      .should('contain.text', 'Required')
    return this
  }

  verifyErrorStyling() {
    this.elements.errorAlert().should('be.visible')
    this.elements.errorMessage().should('have.css', 'color')
    return this
  }

  verifyFieldsVisible() {
    this.elements.usernameField().should('be.visible')
    this.elements.passwordField().should('be.visible')
    return this
  }

  verifyStillOnLoginPage() {
    cy.url().should('include', '/auth/login')
    this.elements.usernameField().should('be.visible')
    return this
  }

  // Utility Methods
  takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    cy.screenshot(`${name}-${timestamp}`)
    return this
  }
}

export default LoginPage
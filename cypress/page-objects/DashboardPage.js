class DashboardPage {
  // Selectors (Locators)
  get elements() {
    return {
      // Header Elements
      headerTitle: () => cy.get('.oxd-topbar-header-title'),
      breadcrumbModule: () => cy.get('.oxd-topbar-header-breadcrumb-module'),
      userDropdown: () => cy.get('.oxd-userdropdown'),
      userDropdownName: () => cy.get('.oxd-userdropdown-name'),
      dropdownMenu: () => cy.get('.oxd-dropdown-menu'),
      
      // Navigation Elements
      adminMenu: () => cy.get('[href="/web/index.php/admin/viewAdminModule"]'),
      dashboardMenu: () => cy.get('[href="/web/index.php/dashboard/index"]'),
      logoutLink: () => cy.get('[href="/web/index.php/auth/logout"]'),
      
      // Dashboard Content
      dashboardWidgets: () => cy.get('.orangehrm-dashboard-widget'),
      quickLaunchWidget: () => cy.get('.oxd-sheet--rounded'),
      timeAtWorkWidget: () => cy.get('[data-v-7d9fa2b6]'),
      
      // Loading Elements
      loadingSpinner: () => cy.get('.oxd-loading-spinner', { timeout: 5000 }),
    }
  }

  // Page Actions
  waitForDashboardLoad() {
    cy.url().should('include', '/web/index.php/dashboard/index')
    this.elements.headerTitle().should('contain.text', 'Dashboard')
    this.elements.userDropdownName().should('be.visible')
    return this
  }

  navigateToAdmin() {
    this.elements.adminMenu().click()
    cy.url().should('include', '/admin')
    this.elements.breadcrumbModule().should('contain.text', 'Admin')
    return this
  }

  navigateToDashboard() {
    this.elements.dashboardMenu().click()
    this.waitForDashboardLoad()
    return this
  }

  openUserDropdown() {
    this.elements.userDropdown().click()
    this.elements.dropdownMenu().should('be.visible')
    return this
  }

  logout() {
    this.openUserDropdown()
    this.elements.logoutLink().click()
    cy.url().should('include', '/web/index.php/auth/login')
    return this
  }

  // Validations and Verifications
  verifyDashboardElements() {
    this.elements.headerTitle().should('contain.text', 'Dashboard')
    this.elements.dashboardWidgets().should('have.length.greaterThan', 0)
    this.elements.userDropdownName().should('be.visible')
    return this
  }

  verifyUserIsLoggedIn() {
    cy.url().should('include', '/web/index.php/dashboard/index')
    this.elements.breadcrumbModule().should('contain.text', 'Dashboard')
    this.elements.userDropdownName().should('be.visible')
    return this
  }

  verifySessionActive() {
    this.elements.userDropdownName().should('be.visible')
    return this
  }

  // Utility Methods
  getWidgetCount() {
    return this.elements.dashboardWidgets().then($widgets => {
      return $widgets.length
    })
  }

  getUserDisplayName() {
    return this.elements.userDropdownName().invoke('text').then(text => {
      return text.trim()
    })
  }

  takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    cy.screenshot(`${name}-${timestamp}`)
    return this
  }
}

export default DashboardPage
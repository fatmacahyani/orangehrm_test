describe('OrangeHRM Login Performance - With Intercept', () => {
  context('Performance Tests with Intercept Monitoring', () => {
    it('TC_011: Page load performance monitoring', () => {
      // Intercept untuk monitoring resource loading
      cy.intercept('GET', '**/*.css').as('cssResources')
      cy.intercept('GET', '**/*.js').as('jsResources')
      cy.intercept('GET', '**/*.png').as('imageResources')

      cy.log('**Testing page load performance with resource monitoring**')
      
      const startTime = Date.now()
      cy.visit('/web/index.php/auth/login')
      
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Performance assertions
      expect(loadTime).to.be.lessThan(10000) // Should load within 10 seconds
      cy.log(`Total page load time: ${loadTime}ms`)
      
      cy.takeScreenshotWithTimestamp('TC_011-performance-monitoring')
    })

    it('TC_012: Login process performance monitoring', () => {
      // Intercept untuk measuring authentication timing
      cy.intercept('POST', '**/auth/validate').as('authRequest')

      cy.visit('/web/index.php/auth/login')
      cy.waitForPageLoad()
      
      const loginStartTime = Date.now()
      
      cy.fixture('loginuser').then((testData) => {
        cy.loginWithCredentials(
          testData.validCredentials.username, 
          testData.validCredentials.password
        )
        
        // Monitor authentication timing
        cy.wait('@authRequest').then((interception) => {
          const authEndTime = Date.now()
          const authDuration = authEndTime - loginStartTime
          
          expect(interception.response.statusCode).to.be.oneOf([200, 302])
          expect(authDuration).to.be.lessThan(5000) // Auth should complete in 5 seconds
          cy.log(`Authentication duration: ${authDuration}ms`)
        })
        
        cy.verifyLoginSuccess().then(() => {
          const totalLoginTime = Date.now() - loginStartTime
          expect(totalLoginTime).to.be.lessThan(15000) // Total login should be under 15 seconds
          cy.log(`Total login process time: ${totalLoginTime}ms`)
          
          cy.takeScreenshotWithTimestamp('TC_012-login-timing-monitoring')
          cy.logout()
        })
      })
    })

    it('TC_013: Network monitoring during login attempts', () => {
      // Intercept untuk monitoring network requests
      cy.intercept('POST', '**/auth/validate').as('networkMonitoring')

      cy.visit('/web/index.php/auth/login')
      cy.waitForPageLoad()
      
      cy.fixture('loginuser').then((testData) => {
        cy.log('**Testing network monitoring during login**')
        
        cy.get('[name="username"]').clear().type(testData.validCredentials.username)
        cy.get('[name="password"]').clear().type(testData.validCredentials.password)
        cy.get('[type="submit"]').click()
        
        // Monitor network request
        cy.wait('@networkMonitoring').then((interception) => {
          expect(interception.request.method).to.eq('POST')
          const requestBody = interception.request.body
          expect(requestBody).to.include('username=Admin')
          expect(requestBody).to.include('password=admin123')
          cy.log('Network request monitored successfully')
          cy.log(`Request size: ${requestBody.length} bytes`)
        })
        
        cy.verifyLoginSuccess()
        cy.takeScreenshotWithTimestamp('TC_013-network-monitoring')
        cy.logout()
      })
    })
  })
})
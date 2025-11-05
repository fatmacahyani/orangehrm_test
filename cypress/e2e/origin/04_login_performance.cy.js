describe('OrangeHRM Login - Performance and Load Tests', () => {
  context('Login Performance Tests', () => {
    it('Should load login page within acceptable time', () => {
      cy.log('**Testing login page load performance**')
      
      const startTime = Date.now()
      
      cy.visit('/web/index.php/auth/login')
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Assert page loads within 5 seconds
      expect(loadTime).to.be.lessThan(5000)
      cy.log(`Page load time: ${loadTime}ms`)
      
      cy.takeScreenshotWithTimestamp('page-load-performance')
    })

    it('Should complete login process within acceptable time', () => {
      cy.log('**Testing login process performance**')
      
      cy.visit('/web/index.php/auth/login')
      cy.waitForPageLoad()
      
      const startTime = Date.now()
      
      cy.fixture('loginuser').then((testData) => {
        cy.loginWithCredentials(
          testData.validCredentials.username, 
          testData.validCredentials.password
        )
        
        cy.verifyLoginSuccess().then(() => {
          const endTime = Date.now()
          const loginTime = endTime - startTime
          
          // Assert login completes within 10 seconds
          expect(loginTime).to.be.lessThan(10000)
          cy.log(`Login process time: ${loginTime}ms`)
          
          cy.takeScreenshotWithTimestamp('login-performance')
          cy.logout()
        })
      })
    })
  })

        // Verify user gets feedback about the error
        cy.url().should('include', '/auth/login')
        
        cy.takeScreenshotWithTimestamp('network-failure-handling')
      })
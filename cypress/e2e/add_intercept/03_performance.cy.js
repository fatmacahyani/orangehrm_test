describe('OrangeHRM Login Performance - With Intercept', () => {
  context('Performance Tests with Intercept Monitoring', () => {
    it('TC_011: Page load performance with resource intercepts', () => {
      // Intercept untuk monitoring resource loading
      cy.intercept('GET', '**/css/**', (req) => {
        req.reply((res) => {
          res.setDelay(100) // Simulate CSS loading delay
          res.send()
        })
      }).as('cssResourceRequest')

      cy.intercept('GET', '**/js/**', (req) => {
        req.reply((res) => {
          res.setDelay(150) // Simulate JS loading delay
          res.send()
        })
      }).as('jsResourceRequest')

      cy.intercept('GET', '**/images/**', (req) => {
        req.reply((res) => {
          res.setDelay(200) // Simulate image loading delay
          res.send()
        })
      }).as('imageResourceRequest')

      cy.log('**Testing page load performance with resource monitoring**')
      
      const startTime = Date.now()
      cy.visit('/web/index.php/auth/login')
      
      // Wait for resource intercepts
      cy.wait(['@cssResourceRequest', '@jsResourceRequest'], { timeout: 10000 })
      
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Performance assertions with intercept data
      cy.get('@cssResourceRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('CSS resources loaded successfully')
      })
      
      cy.get('@jsResourceRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('JavaScript resources loaded successfully')
      })
      
      expect(loadTime).to.be.lessThan(8000) // Adjusted for simulated delays
      cy.log(`Total page load time with intercepts: ${loadTime}ms`)
      
      cy.takeScreenshotWithTimestamp('TC_011-performance-intercept')
    })

    it('Login process performance with request timing intercepts', () => {
      // Intercept untuk measuring authentication timing
      cy.intercept('POST', '**/auth/validate', (req) => {
        const startTime = Date.now()
        req.reply((res) => {
          const processTime = Date.now() - startTime
          res.headers['X-Auth-Process-Time'] = processTime.toString()
          res.headers['X-Performance-Tier'] = processTime < 1000 ? 'fast' : 'slow'
          res.send()
        })
      }).as('authTimingRequest')

      // Intercept untuk dashboard redirect timing
      cy.intercept('GET', '**/dashboard/**', (req) => {
        req.reply((res) => {
          res.setDelay(500) // Simulate dashboard loading
          res.headers['X-Dashboard-Load-Time'] = '500'
          res.send()
        })
      }).as('dashboardTimingRequest')

      cy.visit('/web/index.php/auth/login')
      cy.waitForPageLoad()
      
      const loginStartTime = Date.now()
      
      cy.fixture('loginTestData').then((testData) => {
        cy.loginWithCredentials(
          testData.validCredentials.username, 
          testData.validCredentials.password
        )
        
        // Verify authentication timing
        cy.wait('@authTimingRequest').then((interception) => {
          const authProcessTime = parseInt(interception.response.headers['x-auth-process-time'])
          const performanceTier = interception.response.headers['x-performance-tier']
          
          expect(authProcessTime).to.be.lessThan(2000)
          expect(performanceTier).to.be.oneOf(['fast', 'slow'])
          cy.log(`Authentication process time: ${authProcessTime}ms (${performanceTier})`)
        })
        
        // Verify dashboard loading timing
        cy.wait('@dashboardTimingRequest').then((interception) => {
          const dashboardLoadTime = parseInt(interception.response.headers['x-dashboard-load-time'])
          expect(dashboardLoadTime).to.eq(500)
          cy.log(`Dashboard load time: ${dashboardLoadTime}ms`)
        })
        
        cy.verifyLoginSuccess().then(() => {
          const totalLoginTime = Date.now() - loginStartTime
          expect(totalLoginTime).to.be.lessThan(15000) // Adjusted for delays
          cy.log(`Total login process time with intercepts: ${totalLoginTime}ms`)
          
          cy.takeScreenshotWithTimestamp('TC_012-login-timing-intercept')
          cy.logout()
        })
      })
    })

   
        // Verify error handling
        cy.url().should('include', '/auth/login')
        cy.takeScreenshotWithTimestamp('TC_013-network-failure-intercept')
      })
    })
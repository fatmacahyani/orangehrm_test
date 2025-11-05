class LoginData {
  static getValidCredentials() {
    return {
      username: Cypress.env('validUsername') || 'Admin',
      password: Cypress.env('validPassword') || 'admin123'
    }
  }

  static getInvalidCredentials() {
    return [
      {
        testCase: 'TC_002',
        scenario: 'Invalid username with valid password',
        username: 'InvalidUser',
        password: 'admin123',
        expectedError: 'Invalid credentials'
      },
      {
        testCase: 'TC_003',
        scenario: 'Valid username with invalid password',
        username: 'Admin',
        password: 'wrongpassword',
        expectedError: 'Invalid credentials'
      },
      {
        testCase: 'TC_004',
        scenario: 'Both username and password invalid',
        username: 'InvalidUser',
        password: 'wrongpassword',
        expectedError: 'Invalid credentials'
      }
    ]
  }

  static getEmptyCredentials() {
    return [
      {
        testCase: 'TC_005',
        scenario: 'Both fields empty',
        username: '',
        password: '',
        expectedError: 'Username : Required'
      },
      {
        testCase: 'TC_006',
        scenario: 'Username empty',
        username: '',
        password: 'admin123',
        expectedError: 'Username : Required'
      },
      {
        testCase: 'TC_007',
        scenario: 'Password empty',
        username: 'Admin',
        password: '',
        expectedError: 'Password : Required'
      }
    ]
  }

  static getSQLInjectionCredentials() {
    return {
      testCase: 'TC_010',
      scenario: 'SQL Injection attack prevention',
      username: "' OR '1'='1",
      password: "' OR '1'='1",
      expectedError: 'Invalid credentials'
    }
  }

  static getSpecialCharacterCredentials() {
    return [
      {
        testCase: 'TC_008',
        scenario: 'Special characters in username',
        username: 'Admin@#$%',
        password: 'admin123',
        expectedError: 'Invalid credentials'
      },
      {
        testCase: 'TC_009',
        scenario: 'Special characters in password',
        username: 'Admin',
        password: 'admin@#$%',
        expectedError: 'Invalid credentials'
      }
    ]
  }

  static getTestEnvironment() {
    return {
      baseUrl: Cypress.config('baseUrl'),
      timeout: Cypress.config('defaultCommandTimeout'),
      viewport: {
        width: Cypress.config('viewportWidth'),
        height: Cypress.config('viewportHeight')
      }
    }
  }

  static getBrowserInfo() {
    return {
      name: Cypress.browser.name,
      version: Cypress.browser.version,
      family: Cypress.browser.family
    }
  }

  static getTestMetadata(testCase) {
    const metadata = {
      testCase,
      timestamp: new Date().toISOString(),
      environment: this.getTestEnvironment(),
      browser: this.getBrowserInfo()
    }
    return metadata
  }
}

export default LoginData
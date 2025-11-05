class TestScenarios {
  static getLoginTestSuite() {
    return {
      suiteName: 'OrangeHRM Login Functionality',
      description: 'test cases for login feature using Page Object Model',
    }
  }

  static getPositiveTestCases() {
    return [
      {
        id: 'TC_001',
        title: 'Valid Login with Correct Credentials',
        description: 'Verify user can login with valid username and password using POM',
        priority: 'High',
        type: 'Positive',
        tags: ['smoke', 'login', 'positive'],
        steps: [
          'Navigate to login page',
          'Verify page elements',
          'Enter valid credentials',
          'Click login button',
          'Verify dashboard access'
        ],
        expected: 'User should be redirected to dashboard successfully'
      }
    ]
  }

  static getNegativeTestCases() {
    return [
      {
        id: 'TC_002',
        title: 'Invalid Login with Wrong Username',
        description: 'Verify login fails with invalid username and valid password',
        priority: 'High',
        type: 'Negative',
        tags: ['login', 'negative', 'validation'],
        expected: 'Error message should be displayed'
      },
      {
        id: 'TC_003',
        title: 'Invalid Login with Wrong Password',
        description: 'Verify login fails with valid username and invalid password',
        priority: 'High',
        type: 'Negative',
        tags: ['login', 'negative', 'validation'],
        expected: 'Error message should be displayed'
      },
      {
        id: 'TC_004',
        title: 'Invalid Login with Wrong Credentials',
        description: 'Verify login fails with both invalid username and password',
        priority: 'Medium',
        type: 'Negative',
        tags: ['login', 'negative'],
        expected: 'Error message should be displayed'
      }
    ]
  }

  static getValidationTestCases() {
    return [
      {
        id: 'TC_005',
        title: 'Empty Credentials Login Attempt',
        description: 'Verify login fails when both fields are empty',
        priority: 'Medium',
        type: 'Validation',
        tags: ['login', 'validation', 'required-fields'],
        expected: 'Required field validation should appear'
      },
      {
        id: 'TC_006',
        title: 'Empty Username Login Attempt',
        description: 'Verify login fails when username is empty',
        priority: 'Medium',
        type: 'Validation',
        tags: ['login', 'validation', 'username'],
        expected: 'Username required validation should appear'
      },
      {
        id: 'TC_007',
        title: 'Empty Password Login Attempt',
        description: 'Verify login fails when password is empty',
        priority: 'Medium',
        type: 'Validation',
        tags: ['login', 'validation', 'password'],
        expected: 'Password required validation should appear'
      }
    ]
  }

  static getSecurityTestCases() {
    return [
      {
        id: 'TC_008',
        title: 'Special Characters in Username',
        description: 'Verify login behavior with special characters in username',
        priority: 'Low',
        type: 'Security',
        tags: ['login', 'security', 'special-chars'],
        expected: 'Should handle special characters gracefully'
      },
    ]
  }

  static getAllTestCases() {
    return [
      ...this.getPositiveTestCases(),
      ...this.getNegativeTestCases(),
      ...this.getValidationTestCases(),
      ...this.getSecurityTestCases()
    ]
  }

  static getTestCaseById(id) {
    return this.getAllTestCases().find(testCase => testCase.id === id)
  }

  static getTestCasesByType(type) {
    return this.getAllTestCases().filter(testCase => testCase.type === type)
  }

  static getTestCasesByPriority(priority) {
    return this.getAllTestCases().filter(testCase => testCase.priority === priority)
  }

  static getTestCasesByTag(tag) {
    return this.getAllTestCases().filter(testCase => testCase.tags.includes(tag))
  }
}

export default TestScenarios
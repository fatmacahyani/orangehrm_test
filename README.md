# OrangeHRM Test Automation

This project contains automated test cases for OrangeHRM login functionality using Cypress.

## Project Overview

This test automation project focuses on comprehensive testing of the OrangeHRM login feature, including positive, negative, and security test scenarios.

## Features Tested

- ✅ Valid login with correct credentials
- ✅ Invalid login scenarios (wrong username/password)
- ✅ Empty field validations
- ✅ Special characters handling
- ✅ SQL injection prevention

## Test Framework

- **Framework**: Cypress
- **Language**: JavaScript
- **Test Data**: JSON fixtures

## Project Structure

```
orangehrm_test/
├── cypress/
│   ├── e2e/
│   │   └── spec.cy.js          # Main test specifications
│   ├── fixtures/
│   │   ├── loginuser.json      # Test credentials data
│   │   ├── testscenario.json   # Test scenarios documentation
│   │   └── example.json        # Sample data
│   └── support/
│       ├── commands.js         # Custom Cypress commands
│       └── e2e.js             # Support configurations
├── cypress.config.js           # Cypress configuration
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Test Cases

### High Priority Tests
- **TC_001**: Valid Login with Correct Credentials
- **TC_002**: Invalid Login with Wrong Username  
- **TC_003**: Invalid Login with Wrong Password
- **TC_010**: SQL Injection Attack Prevention

### Medium Priority Tests
- **TC_004**: Invalid Login with Wrong Credentials
- **TC_005**: Empty Credentials Login Attempt

### Low Priority Tests
- **TC_008**: Special Characters in Username

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd orangehrm_test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
npx cypress open
```

### Headless Mode (Command Line)
```bash
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

## Test Data

The project uses JSON fixtures to manage test data:

- `loginuser.json`: Contains valid/invalid credentials and expected results
- `testscenario.json`: Documents all test scenarios with descriptions and priorities

## Configuration

Cypress configuration can be modified in `cypress.config.js` file to:
- Set base URL
- Configure viewport settings
- Set timeout values
- Define custom folders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your test cases
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## License

This project is licensed under the ISC License.

## Author

Test automation project for OrangeHRM application.
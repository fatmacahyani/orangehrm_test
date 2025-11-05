# OrangeHRM Test Automation

This project contains automated test cases for OrangeHRM login functionality using Cypress.

## Project Overview

This test automation project focuses on comprehensive testing of the OrangeHRM login feature, including positive, negative, and security test scenarios.

## Test Framework

- **Framework**: Cypress
- **Language**: JavaScript
- **Test Data**: JSON fixtures

## Test Cases

- **TC_001**: Valid Login with Correct Credentials
- **TC_002**: Session validation
- **TC_003**: Invalid Login with Wrong Username
- **TC_004**: Invalid Login with Wrong Password
- **TC_005**: Both invalid credentials
- **TC_006**: Security check
- **TC_007**: Resource loading monitoring
- **TC_008**: Resource loading monitoring

### Medium Priority Tests

- **TC_004**: Invalid Login with Wrong Credentials
- **TC_005**: Empty Credentials Login Attempt

## Prerequisites

- Node.js
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
npm run test:open
```

### Headless Mode (Command Line)

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run login success tests
npm run test:success

# Run login failure tests
npm run test:failed

# Run intercept monitoring tests
npm run test:intercept

# Run performance tests
npm run test:performance

# Run with specific browser
npm run test:chrome
npm run test:firefox
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

# ParaBank Test Automation Framework

## 🚀 Overview
The **ParaBank Test Automation Framework** is a robust end-to-end (E2E) testing solution for validating both UI and API functionality of the [ParaBank Application](https://parabank.parasoft.com/parabank). Built using [Playwright](https://playwright.dev), the framework ensures full coverage of key application flows, delivering fast and reliable feedback with each test run.

---

## 📁 Project Structure
```
├── tests
│   ├── ui-cases               # UI Test cases
│   ├── api-cases              # API Test cases
├── Pages                      # Page Object Models
├── Utils                      # Utility functions (API helpers, etc.)
├── .env                       # Environment config structure
├── fixture                    # Test data files
├── playwright.config.ts       # Playwright configuration file
└── README.md                  # Project documentation
```

---

## ✅ Features
- 🔹 Modular Page Object Model (POM)
- 🔹 Dynamic user registration for each run
- 🔹 API validation using Playwright’s `request` context
- 🔹 Reusable helper methods and locators
- 🔹 Supports CI/CD integration from github
- 🔹 Configurable environments

---

## 🧪 Test Scenarios Covered
### UI Tests
1. Navigate to ParaBank app
2. Register a new user with a randomly generated username
3. Login with registered user
4. Validate global navigation menu
5. Open a new savings account
6. Check account balance in overview
7. Transfer funds between accounts
8. Pay bills
9. Assertions after every critical action

### API Tests
1. Search transactions by amount
2. Validate JSON response for payment-related transactions

---

## 🛠 Setup Instructions
1. **Clone the repo:**
```bash
git clone https://github.com/sagar-qa007/para-bank-assignement.git
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run UI tests:**
```bash
npx playwright test tests/ui-cases --headed
```

4. **Run API tests:**
```bash
npx playwright test tests/api-cases --headed
```

5. **View report:**
```bash
npx playwright show-report
```

---

## ⚙️ Environment Config
Add and manage different environment configurations in `env-config/`. These can be selected dynamically during execution using CLI args or custom scripts.

---

## 🤝 Contributing
- Fork this repo
- Create a new branch (`feature/your-feature-name`)
- Submit a PR with clear description

---

## 📄 License
This project is licensed under the MIT License.


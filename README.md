# Expense-Tracker

> This web app is a web-based application designed to help individuals manage their finances by recording and categorizing expenses. These app is typically used to keep track of spending, credits, and gain insights into financial habits.


## Features

   * Secure login, sign-up, and authentication using bcrypt.
   * Track both credit (e.g., salary) and spending.
   * Password change functionality with SendGrid integration.
   * Access premium account features, including Dark mode and PDF reports for financial transactions and gains.

## Database: 
     
   * User Table: Stores all User Credentials.
   * Expenses Table: Stores all Users spendings.
   * CreditExpenses Table: Stores all Users gains(e.g Salary).
   * Order Table: Premium membership's payment details.
   * FileRecords Table: Stores user generated file pdf links/location. 

## Tech Stack

  * Frontend: Html, Css and Javascript
  * Backend: Express.js, MySQL, Sequelize and bcrypt
  * Other: Sendgrid, Razorpay, cors, handlebars and puppeteer

## Setup
     
   ```bash
     $ git clone https://github.com/vinayak1809/Expense-Tracker.git
     $ cd Expense-Tracker   
     $ npm install
     $ npm start
   ```
     
## Tools

  * Visual Studio Code
  * Postman
  * Git

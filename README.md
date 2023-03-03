# Inventory Management System

## Overview

This is a basic inventory management system that allows you to add, and edit items from a database. It also allows you to search through items and update the stock.

## Requirements

1. [node](https://nodejs.org/en/)
2. [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
3. [Python 3.9+](https://www.python.org/downloads/)
4. [Poetry](https://python-poetry.org/docs/)

## Installation

1. Clone the repository
2. Server setup
   1. Run `cd backend` to go to the backend directory
   2. Run `poetry install` to install the dependencies
   3. Run `poetry shell` to activate the virtual environment
   4. Run `python main.py` to start the server
3. Client setup
   1. Run `cd frontend` to go to the frontend directory
   2. Run `npm install` to install the dependencies
   3. Run `npm start` to start the web application
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. Logging in
   1. When opening the website for the first time, you are automatically brought to the login page. The database is seeded with a few default users.
   2. Admin credentials:
      1. Username: `test1@gmail.com`
      2. Password: `password`
   3. Normal user credentials:
      1. Username: `test2@gmail.com`
      2. Password: `password`
2. Viewing items
   1. When you log in, you are brought to the home page. This page shows all the items in the database. You can also search for items using the search bar, and filter specific fields using the menu beside it.
   2. You can click on an item to see individual inventory statistics and update the item's information.
   3. You can also click on the `Add Item` button to add a new item to the database.
3. Viewing transactions
   1. You can click on the `Transactions` button on the top right to view all the transactions in the database.
   2. You can also click on the `Add Transaction` button to add a new transaction to the database.
4. Viewing employees
   1. When logged in as the admin employee, you can click on the `Employees` button on the top right to view all the employees in the database.
   2. You can also click on the `Add Employee` button to add a new employee to the database.
   3. You can edit an individual employee's information by clicking on the employee in the table.
5. Logging out
   1. You can click on the `Logout` button on the top right to log out of the system.
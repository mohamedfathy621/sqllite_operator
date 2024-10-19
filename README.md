# SQLite3 Mini Tool

A user-friendly CLI tool designed for basic SQLite database operations. This project allows you to create, manage, and manipulate SQLite databases without needing to write manual SQL queries.

## Features

### Database Operations

1. **Create Database Files**
2. **Delete Database Files**
3. **Open Database Files**
   - A. **Display Data in the Database**
     - I. Display all the tables in the database
       - * Display all rows in the specified table
       - * Display columns of the specified table
       - * Search the table for certain rows
   - B. **Delete Data in the Database**
     - I. Delete data from a table
       - * Delete all data in a table
       - * Delete certain rows in the table
     - II. Drop a table from the database
   - C. **Modify Data in the Database**
     - I. Modify a table in the database
       - * Change table name
       - * Insert a new column
     - II. Modify a row in the database
       - * Search for rows in the database and change their data
     - III. Create a table
     - IV. Insert data into a table

## User Interface

This project features a simple Command Line Interface (CLI) that is very user-friendly. It requires minimal knowledge of SQLite, as it does not necessitate manual SQL query writing.

### Navigation

The tool follows a screen-based navigation system, where users are prompted to enter a letter or a number corresponding to the desired operation. For example, the home screen displays:

```
1. Create a new database
2. Open a database
3. Delete a database
4. Close
```

Simply enter the option number to proceed.

## Future Plans

The functionality of this project is encapsulated in classes, allowing for easy reuse in other projects. I plan to continue enhancing this tool, with current efforts focused on developing a simple schema-based database creator similar to Prisma.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamedfathy621/sqllite_operator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sqlite3-mini-tool
   ```
3. Install any required dependencies:
   ```bash
   npm install
   ```

## Usage

To run the tool, execute the following command in your terminal:
```bash
node main.js
```

## Contribution

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.


## Acknowledgments

- Inspired by the need for easier database management.


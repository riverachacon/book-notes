# BookNotes Web Application

BookNotes is a web application that allows users to track and review books. Users can add new books to their collection, write reviews, rate books, and view the latest cat pictures!

## Features

- Add new books to your collection
- Write reviews and rate books
- View the latest cat pictures

## Technologies Used
* Express.js: Web application framework for Node.js
* PostgreSQL: Database for storing book information
* EJS: Templating engine for rendering views
* Axios: HTTP client for making API requests

## Setup
- Install dependencies: npm i
- Set up PostgreSQL database:
- Create a database named booknotes
- Run the SQL script in database.sql to create the necessary table
my table:

CREATE TABLE books (
    id SERIAL PRIMARY KEY
    title VARCHAR(155),
    cover VARCHAR(500),
    author VARCHAR(155),
    review VARCHAR (800),
    date DATE,
    rate SMALLINT
)

- Start the server: node index.js
Access the application at http://localhost:3000

## Add a new book:

Click on the "Add Book" button
Enter the book's title, review, rating, and publication date
Click "Submit" to add the book to your collection
View your book collection:
Your added books will appear on the homepage
Click on a book to view its details
Edit a book:
Click on the "Edit" button next to a book
Update the review
Click "Save" to update the book's review
Delete a book:
Click on the "Delete" button next to a book
Confirm the deletion
### Contributing
Contributions are welcome! Please fork the repository and submit a pull request. Let me know where i can make changes and improvements. 

# THANKS 
# 🙏🏼
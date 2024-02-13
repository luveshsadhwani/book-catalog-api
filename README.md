## Requirements

-   Auth
-   Logging
-   Read/writes
-   Error handling
-   Testing

## Use case

-   List out books that I am currently reading and track their percentage
-   Track my daily reading habits
-   Log in (requires user management)

### Things I want to see

-   Progress (% or fraction of days) of reading books
-   Stats of read books
-   Days left to target
-   Book name
-   Reading progression
-   Pages read in a month

## DB Design

### Book

title: Book title
isbn: Unique identifier for a book
author:
genre:
number_of_pages
publication_year

### reading_goals

Can do application level checks to prevent multiple reading goals for the same book. Scale is still fine because we don't need real-time knowledge of user's reading goals

id integer
start_reading_date:
finished_reading_date
book_isbn
target_days
is_active:
user_id

### progressions

A book in reading has progression

id
book_isbn
pages_read
date
goal_id
user_id

### users

id
first_name
last_name
email
password

## Development

-   `npm run dev`

## DB Setup

-   Create database in psql `create database DB_NAME`
-   Switch to database `\c book_catalog`
-   Created books, users
-   For user ID, add unique constraint
-   Add constraints ALTER TABLE table_name ADD CONSTRAINT constraint_name condition
-   Then add reading_goals (don't forget to make ID primary key!)
-   Finally add progressions table

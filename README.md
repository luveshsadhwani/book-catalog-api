## Requirements

-   Auth
-   Logging
-   Read/writes
-   Error handling
-   Testing

## Use case

-   List out reading goals based on the book i want to read or am currently reading
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

Reading goals are added for books that I am reading.

Once a goal is added, it has technically started (can't add future goals).

Goals should be strict where you can't edit the start date once it is keyed in. If it is a typo, then the goal must be deleted.

You can always apply reading goals for the same books, but not overlapping with the same start/finish date

Goals have a status - 'ongoing' or 'completed'. We can add more status' over time (eg user wants to pause)

You can have multiple reading goals for the multiple books you read at a time

id integer
start_reading_date: non-nullable date field
completed_reading_date: nullable date field
book_isbn: string
target_complete_date: non-nullable date field
status: string
user_id: integer

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

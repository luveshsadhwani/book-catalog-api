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

## Authentication

Using passport and google auth

1. Client is redirected to an OAuth server to verify credentials, showing Google's authentication page
2. Once a client is authenticated, Google redirects request to another endpoint in our server with an authorized code. The redirect is a callback in our API. The authorized code permits our server to ask google for user credentials
3. . In the callback route, the authorized code will be used to make a request for user profile and access tokens
4. (This is not part of Oauth) Our server now has accessToken, refreshToken and user profile info. A verify callback will be invoked. This can be used to add the user to the DB. The verify callback is declared when setting up the passport strategy.
5. (Passport + Session) With passport, we need to store user data as a session for future requests so we don't have to keep calling Google's auth server. Sessions can manage data storage in different ways (client side as cookies, server side in memory, or a DB). Passport has a session method that will make it easier to retrieve session data

### Implementation

1. Install passport and google auth strategy, `npm install passport passport-google-oauth20`
2. Set up strategy with verify callback - requires some config on the google console.

-   Create new project
-   Go to APIs and Services, select Credentials > Create Credentials
-   Configure consent screen
-   Add new client ID - for now using browser for testing purposes

3. Add auth callback endpoint
4. Decide on session data storage method and install relevant packages
5. Add session storage middleware
6. Add serialization and deserialization + session management from passport middleware

## Auth Routes

| Route                    | Method | Body                                  | Purpose                          |
|--------------------------|--------|---------------------------------------|----------------------------------|
| `/api/users/signup`      | POST   | `{ email: string, password: string }` | Sign up for an account           |
| `/api/users/signin`      | POST   | `{ email: string, password: string }` | Sign in to an existing account   |
| `/api/users/signout`     | POST   | `{}`                                  | Sign out                         |
| `/api/users/currentuser` | GET    | -                                     | Return info about the user       |


## Difficulty in Error Handling

| #  | Explanation                                                                                                                                     |
|----|-------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | We must have a consistently structured response from _all_ servers, no matter what went wrong                                                  |
| 2  | A billion things can go wrong, not just validation of inputs to a request handler. Each of these need to be handled consistently              |


## Solutions

- **Write an error handling middleware** to process errors, give them a consistent structure, and send back to the browser.
- **Make sure we capture all possible errors** using Express's error handling mechanism (call the `next` function!)

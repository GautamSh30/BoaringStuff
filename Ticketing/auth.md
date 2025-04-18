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

## Cookies vs JWTs

| Topic                  | Cookies                                                 | JWTs                                            |
|-------------------------|----------------------------------------------------------|-------------------------------------------------|
| **Storage Location**    | Usually stored by browser automatically                  | Client manually stores (e.g., in localStorage)  |
| **Sent Automatically?** | Yes, with every request if `withCredentials` is true     | No, must manually send token in headers         |
| **Ease of Use**         | Easy; handled by browser                                | More flexible, but manual                      |
| **Cross-Site Security** | Vulnerable to CSRF attacks unless properly configured   | Vulnerable to XSS attacks if stored improperly  |
| **Server-Side Storage** | Session info may be stored on server                    | Server only needs secret key to verify          |


## Auth Requirements

| Topic                | Details                                                                 |
|----------------------|-------------------------------------------------------------------------|
| **Authentication**   | The process of identifying who the user is                             |
| **Authorization**    | The process of identifying what the user can and cannot access         |
| **Stateless Auth**   | Server does **not** store session info; client holds necessary auth info |
| **Token-Based Auth** | Client holds a token (JWT) to identify itself to the server             |
| **JWT**              | JSON Web Token; contains user info; digitally signed and verified      |
| **Session-Based Auth**| Server stores session info and gives client a session ID (cookie)       |

<br>

## Best Practices for Authentication and Token Storage in SSR Apps

## Key Approach

- Use **HTTP-only, Secure cookies** to store authentication tokens.
- Server reads tokens from cookies on **every request** to authenticate before rendering.

---

## Why Not LocalStorage?

- **Vulnerable to XSS**: Malicious scripts can easily steal tokens from LocalStorage.
- **Manual token management** needed for every request.
- **Cookies** are safer (with HttpOnly) and automatic.

---

## Flaws of Cookies (and Fixes)

| Flaw | Mitigation |
|:---|:---|
| CSRF attacks | Use `SameSite=Strict` or CSRF tokens |
| Size limit (~4KB) | Keep tokens small (JWTs optimized) |
| CORS issues | Properly configure credentials in CORS |

Always set cookies with:  
- `Secure`
- `HttpOnly`
- `SameSite=Strict` or `SameSite=Lax`

---

## Best Token Strategy

- **Access Token** (short-lived, e.g., 15 min) → HttpOnly cookie.
- **Refresh Token** (longer-lived, e.g., 7 days) → HttpOnly cookie.

### Flow:

1. Server sets `access_token` and `refresh_token` cookies on login.
2. Server reads `access_token` on each SSR request.
3. If expired, use `refresh_token` to silently issue new `access_token`.

---

## Summary

| Aspect | Recommendation |
|:---|:---|
| Token storage | HttpOnly Secure Cookies |
| Token refresh | Refresh token rotation |
| Avoid | Storing tokens in LocalStorage |
| Protect | CSRF via SameSite or CSRF tokens |

## 🔐 Creating a Secret in Kubernetes

To create a secret named `jwt-secret` with a key `jwt` and value `asdf`, use the following command:

```bash
kubectl create secret generic jwt-secret --from-literal=jwt=asdf
# and some code in .yaml files in depl u want to use this variable
```

## 🧪 Levels of Testing and Examples

| **Testing Goal**                                      | **Example**                                                                 |
|--------------------------------------------------------|------------------------------------------------------------------------------|
| Test a single piece of code in isolation               | ✅ Single middleware                                                         |
| Test how different pieces of code work together        | 🔄 Request flowing through multiple middlewares to a request handler        |
| Test how different components work together            | 📥 Make request to service, ensure write to database was completed          |
| Test how different services work together              | 🔁 Creating a 'payment' at the 'payments' service should affect 'orders'    |


## How to run tests?

| Test Level                                      | Example                                                                 |
|------------------------------------------------|-------------------------------------------------------------------------|
| Test a single piece of code in isolation       | Single middleware                                                       |
| Test how different pieces of code work together| Request flowing through multiple middlewares to a request handler      |
| Test how different components work together     | Make request to service, ensure write to database was completed         |
| Test how different services work together       | Creating a 'payment' at the 'payments' service should affect the 'orders' service |

## Test Flow

1. **npm run test**
    - Triggers **Jest**

2. **Jest**
    - Starts an in-memory copy of MongoDB  
    - Starts up the Express app  
    - Uses `supertest` to make fake requests to the Express app  
    - Runs assertions to make sure the request did the right thing

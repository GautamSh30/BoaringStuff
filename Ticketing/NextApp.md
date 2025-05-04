### React (Client-Side Rendering) Flow

1. **GET ticketing.dev** → Browser requests the page.

2. **HTML Response** → Server sends an HTML file with script tags.

3. **JS Request** → Browser requests the JavaScript files mentioned in the script tags.

4. **JS Response** → Server responds with JS files.

5. **React App Runs** → React app renders the UI in the browser (client-side).

> All rendering happens on the **client**. Initial load is slower; good for SPAs.


### Why Server-Side Rendering (SSR)?

1. **Faster Initial Content Load**  
   The server sends a fully rendered HTML page, allowing users to see meaningful content faster, even before JavaScript loads.

2. **Improved Mobile Experience**  
   On slower devices or networks, SSR helps content load quicker, since the browser doesn’t need to wait for all JavaScript to execute before displaying content.

3. **Better SEO (Search Engine Optimization)**  
   Search engine crawlers can easily index server-rendered HTML, which improves visibility in search results—especially important for public-facing websites.

4. **Performance on Low-Powered Devices**  
   Devices with limited processing power (e.g., older phones) benefit from SSR because the server does the heavy lifting of rendering.

5. **Faster Time to Interactive (TTI)**  
   Users can see and interact with content sooner, reducing bounce rates and improving user engagement.

6. **Consistent Previews on Social Media**  
   SSR ensures accurate meta tags and Open Graph data for social platforms to generate rich link previews.

7. **Enhanced Accessibility**  
   Screen readers and assistive technologies can interpret server-rendered HTML more effectively before hydration.

> SSR improves load speed, SEO, accessibility, and user experience—especially on slower devices or networks.

### How to Create Custom Hooks in React

1. **Start with `use` Prefix**  
   The function name must start with `use` (e.g., `useFetch`, `useToggle`) to follow React’s rules of hooks.

2. **Use Built-in Hooks Inside**  
   Custom hooks can call other hooks like `useState`, `useEffect`, `useRef`, etc., to encapsulate logic.

3. **Encapsulate Reusable Logic**  
   Extract stateful logic or side effects from components into reusable functions.

4. **Return Values Needed by Component**  
   Return state, setters, or any relevant values so components can consume them.

5. **Keep It Pure and Stateless**  
   A custom hook should not produce side effects outside React’s lifecycle or depend on external mutable state.

6. **Example Structure:**

   ```js
   import { useState, useEffect } from 'react';

   function useFetch(url) {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetch(url)
         .then((res) => res.json())
         .then((data) => {
           setData(data);
           setLoading(false);
         });
     }, [url]);

     return { data, loading };
   }

   export default useFetch;
    ```

### What Happens When We Visit a Website Using Next.js (SSR)

1. **Request is Made**  
   The browser sends a GET request to the URL (e.g., `GET ticketing.dev`).

2. **Next.js Inspects the URL**  
   Determines which components should be rendered based on the route.

3. **Call `getInitialProps` Method**  
   For each required component, Next.js calls the optional static method `getInitialProps` to fetch necessary data.

4. **Render Components Server-side**  
   Each component is rendered **once** with the fetched data on the server.

5. **Assemble Final HTML**  
   The server combines all the rendered HTML from components.

6. **Send Response to Client**  
   The final HTML page is sent back to the browser, which is quickly displayed.

> This approach helps improve performance, SEO, and load times compared to client-side rendering alone.


## Request Handling in Next.js

### Request from a Component

- Always issued from the **browser**  
- Use a domain of `""` (relative path)


### Request from `getInitialProps`

- Might be executed from the **client or the server**  
- Need to detect the **environment** to use the correct domain

### Requests that cause **server-side execution** of `getInitialProps`:
- Hard refresh of page  
- Clicking link from different domain  
- Typing URL into address bar  

➡️ **`getInitialProps` executed on the server**

---

### Requests that cause **client-side execution** of `getInitialProps`:
- Navigating from one page to another **_while in the app_**

➡️ **`getInitialProps` executed on the client**

---

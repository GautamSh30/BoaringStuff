### Lessons
---

- The **big challenge** in microservices is **data**.
- There are different ways to share data between services. This guide focuses on **async communication**.
- **Async communication** focuses on communicating changes using **events** sent to an **event bus**.
- Async communication encourages each service to be **100% self-sufficient**.  
  It is relatively easy to handle temporary downtime or new service creation.
- **Docker** makes it easier to package up services.
- **Kubernetes** is a pain to setup, but makes it really easy to **deploy and scale** services.

### Painful Things
---

- Lots of **duplicated code**!
- _Really hard_ to picture the **flow of events** between services.
- _Really hard_ to remember what **properties** an event should have.
- _Really hard_ to **test** some event flows.
- _My machine is getting laggy_ running **Kubernetes** and everything else...
- _What if someone created a comment after editing 5 others after editing a post while balancing on a tight rope..._

### Solutions!
---

- Build a central library as an **NPM module** to share code between our different projects.
- Precisely define all of our **events** in this shared library.
- Write _everything_ in **TypeScript**.
- Write **tests** for as much as possible/reasonable.
- Run a **k8s (Kubernetes) cluster** in the cloud and develop on it _almost as quickly as local_.
- Introduce a lot of code to handle **concurrency issues**.

## Ticketing App

- Users can list a ticket for an event (concert, sports) for sale.
- Other users can purchase this ticket.
- Any user can list tickets for sale and purchase tickets.
- When a user attempts to purchase a ticket, the ticket is _'locked'_ for **15 minutes**.  
  The user has 15 minutes to enter their payment info.
- While locked, no other user can purchase the ticket.  
  After 15 minutes, the ticket should _unlock_.
- Ticket prices can be edited if they are **not locked**.

## Database Schema


#### 🧑 User

| Name     | Type   |
|----------|--------|
| email    | string |
| password | string |

---

#### 🎫 Ticket

| Name   | Type        |
|--------|-------------|
| title  | string      |
| price  | number      |
| userId | Ref to User |
| orderId| Ref to Order|

---

#### 🧾 Order

| Name      | Type                           |
|-----------|--------------------------------|
| userId    | Ref to User                    |
| status    | Created \| Cancelled \| AwaitingPayment \| Completed |
| ticketId  | Ref to Ticket                  |
| expiresAt | Date                           |

---

#### 💳 Charge

| Name           | Type                           |
|----------------|--------------------------------|
| orderId        | Ref to Order                   |
| status         | Created \| Failed \| Completed |
| amount         | number                         |
| stripeId       | string                         |
| stripeRefundId | string                         |

## 🧩 Services


#### 🔐 `auth`
- Handles everything related to user authentication:
  - Signup
  - Signin
  - Signout

---

#### 🎫 `tickets`
- Responsible for:
  - Ticket creation and editing
  - Validating whether a ticket can be updated

---

#### 🧾 `orders`
- Manages:
  - Order creation and editing

---

#### ⏱️ `expiration`
- Watches for newly created orders
- Cancels orders after **15 minutes** if not completed

---

#### 💳 `payments`
- Handles credit card payments
- Cancels orders if payment **fails**
- Marks orders as **completed** if payment **succeeds**

## 📡 Events


- `UserCreated`
- `UserUpdated`

---

- `OrderCreated`
- `OrderCancelled`
- `OrderExpired`

---

- `TicketCreated`
- `TicketUpdated`

---

- `ChargeCreated`

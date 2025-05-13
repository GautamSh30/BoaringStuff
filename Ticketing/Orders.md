# Orders Service Architecture Notes

## 📦 Tickets Service

### 🎟️ Ticket Model

| Prop    | Type                                         |
|---------|----------------------------------------------|
| title   | Title of event this ticket is for            |
| price   | Price of the ticket in USD                   |
| userId  | ID of the user who is selling this ticket    |
| version | Version of this ticket. <br>Incremented every time this ticket is changed |

### 🔁 Events Emitted

- **`ticket:created`** → Sent when a new ticket is created.
- **`ticket:updated`** → Sent when an existing ticket is updated.

---

## 📦 Orders Service

### 🎟️ Ticket Model (replica of Tickets Service)

| Prop    | Type                                          |
|---------|-----------------------------------------------|
| title   | Title of event this ticket is for             |
| price   | Price of the ticket in USD                    |
| version | Ensures we don't process events twice or out of order |

### 📝 Order Model

| Prop      | Type                                                                 |
|-----------|----------------------------------------------------------------------|
| userId    | User who created this order and is trying to buy a ticket           |
| status    | Whether the order is `expired`, `paid`, or `pending`                |
| expiresAt | Time at which this order expires (user has 15 minutes to pay)       |
| ticketId  | ID of the ticket the user is trying to buy                          |

---

## 🔄 Event Flow

- `ticket:created` event from Tickets Service → updates Ticket model in Orders Service
- `ticket:updated` event from Tickets Service → updates Ticket model in Orders Service

---

## 🧾 Orders API Endpoints

| Route             | Method  | Body                         | Purpose                                                                 |
|------------------|---------|------------------------------|-------------------------------------------------------------------------|
| `/api/orders`     | GET     | -                            | Retrieve all active orders for the given user making the request        |
| `/api/orders/:id` | GET     | -                            | Get details about a specific order                                      |
| `/api/orders`     | POST    | `{ ticketId: string }`       | Create an order to purchase the specified ticket                        |
| `/api/orders/:id` | DELETE  | -                            | Cancel the order                                                        |

---

## Associating Tickets and Orders in MongoDB

### Using Mongoose Ref/Populate

- **Order Document** stores a reference to the **Ticket Document** using `ticket` field.
- Use `.populate('ticket')` to retrieve full ticket data.

✅ Keeps data normalized and clean.


---

## Order Statuses

- **Created**: Order is made, but ticket is not yet reserved.
- **Cancelled**: Ticket was reserved by someone else, or user cancelled, or order expired.
- **AwaitingPayment**: Ticket is reserved, waiting for user to pay.
- **Complete**: Ticket reserved and payment is successful.

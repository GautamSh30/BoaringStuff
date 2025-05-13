## 🔄 Event Flow: `order:created`

### 1. 📦 Orders Service
- Publishes `order:created` when a user places a new order for a ticket.
- Sets a 15-minute expiration time for the order.

### 2. 📢 Consumers of `order:created`

#### 🎟 Tickets Service
- **Reason**: Prevent further edits to a reserved ticket.
- **Action**: Marks the ticket as "reserved" by associating it with an order.

#### 💳 Payments Service
- **Reason**: Prepares for potential payment submission by user.
- **Action**: Stores metadata related to the new order (amount, user, etc).

#### ⏱ Expiration Service
- **Reason**: Begins a countdown to automatically expire the order.
- **Action**: Starts a 15-minute timer; will later emit `order:expired`.

---

## 🧠 Summary
The `order:created` event ensures:
- Ticket can't be double-booked (Tickets Service).
- Payment infrastructure is aware of the pending order (Payments Service).
- Auto-cancellation is scheduled (Expiration Service).

> This decoupled architecture enables **event-driven microservices**, improving scalability and fault tolerance.

# NATS Streaming Server


**NATS** and **NATS Streaming Server** are two different things

---

**NATS Streaming** implements some extraordinarily important design decisions that will affect our app

---

We are going to run the official `'nats-streaming'` docker image in Kubernetes.  
Need to read the image's docs.


## 📘 Overview

NATS Streaming (also known as STAN) is a message streaming system built on top of NATS that provides:

- At-least-once delivery
- Message durability
- Replayability
- Message acknowledgments
- Channel-based pub/sub

It is widely used in microservices for reliable communication, event-driven architecture, and decoupled services.

---

## 🧱 Key Concepts

### 1. Channels

- Like topics in Kafka/RabbitMQ
- Each channel stores messages independently

### 2. Messages

- Can be persisted
- Require acknowledgment

### 3. Subscribers

Can be:
- Durable
- Queue groups
- Manual acknowledgment
- Start at last/newest/first/time

### 4. Publishers

- Push messages to a named channel

---

## ⚙️ Setup

Install NATS Streaming:

```bash
docker run -p 4222:4222 -p 8222:8222 nats-streaming
```


---

## 🔌 Node.js Example Using node-nats-streaming

### 📤 Publisher


```bash
const nats = require('node-nats-streaming');

const stan = nats.connect('clusterID', 'publisher', {
url: 'http://localhost:4222',
});

stan.on('connect', () => {
console.log('Publisher connected to NATS');

const data = JSON.stringify({ id: '123', title: 'New Event' });

stan.publish('ticket:created', data, () => {
console.log('Event published');
});
});
```


### 📥 Subscriber

```bash
const nats = require('node-nats-streaming');

const stan = nats.connect('clusterID', 'subscriber', {
url: 'http://localhost:4222',
});

stan.on('connect', () => {
console.log('Subscriber connected to NATS');

const options = stan
.subscriptionOptions()
.setManualAckMode(true)
.setDeliverAllAvailable()
.setDurableName('ticket-service');

const subscription = stan.subscribe('ticket:created', 'queue-group', options);

subscription.on('message', (msg) => {
const data = msg.getData();
console.log(Received event: ${data});
msg.ack(); // manually acknowledge
});
});
```


---

## 🛡️ Reliability Features

- **Manual Acks:** Ensures a message isn't lost before processing
- **Durable Subscriptions:** Resumes from last acknowledged message
- **Queue Groups:** Load balancing between multiple service instances

---

## 📐 Microservices Use Case

- Use NATS Streaming as the backbone of event-based communication
- Services publish domain events (e.g. order:created)
- Other services subscribe and react to these events
- Enables loose coupling and scalability

---

## 🆚 NATS Streaming vs JetStream (NATS 2.0+)

| Feature             | NATS Streaming | JetStream           |
|---------------------|:--------------:|:-------------------:|
| Project Status      | Deprecated     | Actively Maintained |
| Persistence         | Yes            | Yes                 |
| Ordering            | Yes            | Yes                 |
| Advanced Retention  | Limited        | Supported           |

> ⚠️ **NATS Streaming is deprecated in favor of JetStream. Use NATS + JetStream for new projects.**


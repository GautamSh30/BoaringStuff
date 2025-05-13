# NATS JetStream: Listener & Publisher Guide (TypeScript)

This document explains two abstractions built on NATS JetStream:
1. **Listener** — subscribes to a stream and processes messages.  
2. **Publisher** — ensures a stream exists and publishes messages.

---

## 🔹 Shared NATS Concepts

- **NATS**: Fast, lightweight messaging system  
- **JetStream**: Persistence layer with at‑least‑once delivery, durable consumers, and acknowledgments  
- **Stream**: Named log of messages (like a Kafka topic)  
- **Consumer**: Durable subscriber that pulls messages from a stream  
- **Subject**: Topic name used when publishing/subscribing  

---

## 📡 Listener (Subscriber) Abstraction

```bash
import {
  AckPolicy,
  ConsumerInfo,
  DeliverPolicy,
  JetStreamClient,
  JsMsg,
  JetStreamManager,
  NatsConnection
} from "nats";

export abstract class Listener {
  private nc: NatsConnection;           // NATS connection
  private js: JetStreamClient;          // JetStream client
  private jsm!: JetStreamManager;       // JetStream admin client

  abstract name: string;               // Stream name, e.g. "tickets"
  abstract durableName: string;        // Consumer name for offset tracking
  abstract onMessage(m: JsMsg): void;  // User‑defined message handler

  constructor(nc: NatsConnection) {
    this.nc = nc;
    this.js = nc.jetstream();
  }

  // Initialize the JetStreamManager for stream/consumer ops
  async init(): Promise<void> {
    this.jsm = await this.nc.jetstreamManager();
  }

  // Ensure a durable consumer exists (or create it)
  async createConsumer(): Promise<ConsumerInfo> {
    try {
      return await this.jsm.consumers.info(this.name, this.durableName);
    } catch (e: any) {
      if (e.code === "404") {
        return await this.jsm.consumers.add(this.name, {
          deliver_policy: DeliverPolicy.All,   // replay all messages
          durable_name: this.durableName,      // durable offset
          ack_policy: AckPolicy.Explicit       // manual ack
        });
      }
      throw e;
    }
  }

  // Pull messages and process them
  async listen() {
    await this.init();
    const con  = await this.createConsumer();
    const sub  = await this.js.consumers.get(this.name, con.name);
    const iter = await sub.fetch();        // async iterable of JsMsg

    try {
      for await (const msg of iter) {
        try {
          this.onMessage(msg);              // user handler
          msg.ack();                        // acknowledge processing
        } catch (err) {
          console.error("Message handler error:", err);
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Listener stopped gracefully.");
      } else {
        console.error("Fetch loop error:", err);
      }
    }
  }
}

```

## 🚀 Publisher (Producer) Abstraction

```bash
import {
  JetStreamManager,
  NatsConnection,
  JetStreamClient
} from "nats";

export abstract class Publisher {
  abstract name: string;            // Stream name, e.g. "tickets"
  abstract subject: string[];       // Array of subjects, e.g. ["ticket:created"]

  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm!: JetStreamManager;

  constructor(nc: NatsConnection) {
    this.nc = nc;
    this.js = nc.jetstream();
  }

  // Initialize the JetStreamManager
  async init(): Promise<void> {
    this.jsm = await this.nc.jetstreamManager();
  }

  // Ensure the stream exists (or create it)
  async createStream() {
    await this.init();
    try {
      return await this.jsm.streams.info(this.name);
    } catch (e: any) {
      if (e.code === "404") {
        return await this.jsm.streams.add({
          name: this.name,
          subjects: this.subject
        });
      }
      throw e;
    }
  }

  // Publish a message under a subject
  async publish(publishId: string, data: any) {
    try {
      await this.createStream();                      // ensure stream
      await this.js.publish(
        publishId,                                    // subject, e.g. "ticket:created"
        Buffer.from(JSON.stringify(data))             // payload as Buffer
      );
    } catch (err) {
      console.error("Publishing error:", err);
      throw err;
    }
  }
}

```

### Key Points

createStream() auto‑creates the stream if missing.

Use Buffer.from(JSON.stringify(data)) to serialize payload


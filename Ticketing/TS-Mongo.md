# 🧠 Mongoose + TypeScript Model Structure Guide

When using **Mongoose with TypeScript**, a clean and type-safe pattern involves defining four key components:

---

## 🔹 1. `Attrs Interface`

Defines the required properties to create a new document.

```ts
interface EntityAttrs {
  field1: string;
  field2: number;
  relatedDoc: RelatedDoc;
}
```

> 💡 Think of this as the constructor input for creating a document.

---

## 🔹 2. `Doc Interface`

Describes the properties of a document returned from MongoDB.

```ts
import mongoose from "mongoose";

interface EntityDoc extends mongoose.Document {
  field1: string;
  field2: number;
  relatedDoc: RelatedDoc;
}
```

> 💡 Used when interacting with data from the database (`find()`, `save()`, etc.).

---

## 🔹 3. `Model Interface`

Adds custom static methods (like `.build()`) to the Mongoose model.

```ts
interface EntityModel extends mongoose.Model<EntityDoc> {
  build(attrs: EntityAttrs): EntityDoc;
}
```

> 💡 This enables type-safe custom statics on the model itself.

---

## 🔹 4. Full Model Implementation

Putting it all together with a Mongoose schema and attaching the `build` method.

```ts
import mongoose, { Schema } from "mongoose";

// Step 1: Define the interfaces
interface EntityAttrs {
  field1: string;
  field2: number;
  relatedDoc: mongoose.Types.ObjectId;
}

interface EntityDoc extends mongoose.Document {
  field1: string;
  field2: number;
  relatedDoc: mongoose.Types.ObjectId;
}

interface EntityModel extends mongoose.Model<EntityDoc> {
  build(attrs: EntityAttrs): EntityDoc;
}

// Step 2: Define the schema
const entitySchema = new Schema({
  field1: {
    type: String,
    required: true,
  },
  field2: {
    type: Number,
    required: true,
  },
  relatedDoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Related",
    required: true,
  },
});

// Step 3: Add the custom build method
entitySchema.statics.build = (attrs: EntityAttrs) => {
  return new Entity(attrs);
};

// Step 4: Create the model
const Entity = mongoose.model<EntityDoc, EntityModel>("Entity", entitySchema);

// Step 5: Export
export { Entity };
```

---

## ✅ Summary Table

| Part            | Description                                     | Purpose                              |
|-----------------|-------------------------------------------------|--------------------------------------|
| `Attrs`         | Input required to create a new document         | Used in `.build()` for type safety   |
| `Doc`           | Structure of MongoDB document                   | Used when interacting with documents |
| `Model`         | Custom static methods on the model              | Add statics like `.build()`          |
| `Model Instance`| The actual model created from schema            | Used to query and interact with DB   |

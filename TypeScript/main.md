## Overview
TypeScript = Javascript + {A type system}

Type system helps in: 
- Helps us catch errors during developement
- Uses 'type annotations' to analyze our code
- Only active during developement
- Doesn't provide any performance optimization

**Types**
- Primitive Types
- Object Types

**Type Annotations**

Code we add to tell TS what type of value a variable will refer to

**Type Inference**

TS tries to figure out what type of value a variable refers to

**Object Literal**
```bash
let point: { x: number; y: number } = {
    x: 10,
    y: 10
};
```

**Function Annotation**

```bash
const logNumber: (i: number) => void = (i: number) => {
    console.log(i);
};

# Main problem is when we declaration and initialization on different lines, then due to infrence we can mess up
```

When to use type annotations
- When a function returns the 'any' type and we need to clarify the value // JSON.parse()
- When we declare a variable on one line and initialize it later
- When we want a variable to have a type that can't be inferred

**Object Annotation**
```bash
const profile = {
    name: 'alex',
    age: 20,
    coords: {
        lat: 0,
        long: 15
    },
    setAge(age: number): void {
        this.age = age;
    }
};

const { age, name }: { age: number; name: string } = profile;
const {
    coords: { lat, long }
}: { coords: { lat: number; long: number } } = profile;
```

## Arrays

Why do we care?
- TS can do type inference when extracting values from an array
- TS can prevent us from adding incompatible values to the array
- We can get help with map, forEach, reduce functions
- Flexible - arrays can still contain multiple different types

## Tuple
Array like structure where each element represents some property of a record.
Used when we use csv files
```bash

# tuple 
const pepsi: [string, boolean, number] = ['brown', true, 4];

# alias structure
type Drink = [string, boolean, number];
const pepsi: Drink = ['brown', true, 4];

# object
const pepsi = {
    color: 'brown',
    carbonated: true,
    sugar: 40
};
```


## Interfaces
Creates a new type, describing the property names and value types of an object
```bash
interface Vehicle {
    name: string;
    year: number;
    broken: boolean;
}

const oldCivic = {
    name: 'civic',
    year: 2000,
    broken: true
};

const printVehicle = (vehicle: Vehicle): void => {
    console.log(`Name: ${vehicle.name}`);
};
printVehicle(oldCivic);
```

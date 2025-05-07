## Tickets Service Routes

| Route               | Method | Body                                  | Goal                             |
|---------------------|--------|----------------------------------------|----------------------------------|
| /api/tickets        | GET    | -                                      | Retrieve all tickets             |
| /api/tickets/:id    | GET    | -                                      | Retrieve ticket with specific ID |
| /api/tickets        | POST   | { title: string, price: string }       | Create a ticket                  |
| /api/tickets        | PUT    | { title: string, price: string }       | Update a ticket                  |


## Deployment Flow

1. Create `package.json`, install dependencies
2. Write `Dockerfile`
3. Create `index.ts` to run project
4. Build image, push to Docker Hub
5. Write Kubernetes (k8s) file for deployment and service
6. Update `skaffold.yaml` to enable file sync for tickets
7. Write k8s file for MongoDB deployment and service


## Ticket Interfaces & Model Structure

### TicketAttrs
_Properties that are required to build a new Ticket_

| Field   | Type   |
|---------|--------|
| title   | string |
| price   | number |
| userId  | string |


### TicketDoc
_Properties that a Ticket has_

| Field     | Type   |
|-----------|--------|
| title     | string |
| price     | number |
| userId    | string |
| createAt  | string |


### TicketModel
_Properties tied to the Model_

| Method | Type            |
|--------|-----------------|
| build  | (attrs) => Doc  |

---


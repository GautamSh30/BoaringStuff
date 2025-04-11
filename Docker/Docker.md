## Why Docker

- Running our app right now makes big assumptions about our enviorment (like - npm is already installed to run)
- Running our app requires precise knowledge of how to start it (npm start)
- Docker solces both issues. Containers wrap up everything that is needed for a program + how to start and run it

**.dockerfile**

| Instruction              | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `FROM node:alpine`       | Specify the base image (lightweight Node.js based on Alpine Linux)         |
| `WORKDIR /app`           | Set working directory to `/app` in the container                           |
| `COPY package.json ./`   | Copy only the `package.json` file to the container                         |
| `RUN npm install`        | Install all dependencies listed in `package.json`                          |
| `COPY ./ ./`             | Copy the remaining source code into the container                          |
| `CMD ["npm", "start"]`   | Set the default command to run the app when the container starts           |


**Basic Commands**

| Command                                        | Description                                                                 |
|------------------------------------------------|-----------------------------------------------------------------------------|
| `docker build -t sharmaaggautam/posts .`        | Build an image based on the Dockerfile in the current directory. Tag it as `sharmaaggautam/posts` |
| `docker run [image id or image tag]`           | Create and start a container based on the provided image ID or tag         |
| `docker run -it [image id or image tag] [cmd]` | Create and start a container, but also override the default command        |
| `docker ps`                                     | Print out information about all of the running containers                   |
| `docker exec -it [container id] [cmd]`         | Execute the given command in a running container                           |
| `docker logs [container id]`                   | Print out logs from the given container                                    |

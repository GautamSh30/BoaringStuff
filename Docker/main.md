# Docker: A Quick Introduction

## Why Docker?

Docker simplifies installing and running software by packaging code and dependencies into isolated containers.

- No more "works on my machine" issues  
- Easily replicate environments across systems  
- Lightweight and efficient  

---

## What Is Docker?

Docker is a platform for building, shipping, and running applications inside containers.

### Core Components

- **Docker CLI** – Command-line interface to interact with Docker  
- **Docker Daemon (Server)** – Manages Docker containers, images, networks, and volumes  
- **Docker Machine** – Tool for managing Docker hosts  
- **Docker Images** – Read-only templates used to create containers  
- **Docker Hub** – Central registry to store and share images  
- **Docker Compose** – Tool for defining and running multi-container apps  

---

## Images vs Containers

| Concept     | Description |
|-------------|-------------|
| **Image**   | Snapshot containing app code, dependencies, and startup commands |
| **Container** | A running instance of an image (isolated, lightweight process) |

A **container**:
- Runs your app in isolation  
- Can be started/stopped independently  
- Shares the host OS kernel  

---

## First Docker Command

```bash
docker run hello-world

# What happens:
# 1. CLI sends command to Docker Daemon
# 2. Daemon checks for 'hello-world' image locally
# 3. If missing, downloads it from Docker Hub
# 4. Creates a container from the image
# 5. Runs the container which prints "Hello from Docker!" and exits
# 6. Image gets cached locally for future runs
```

## Container Internals
- Namespaces – Isolate process views (network, PID, mount, etc.)

- Control Groups (cgroups) – Limit and monitor resources (CPU, memory, disk)

- Image = File system snapshot + default startup command

- Container = Process running in an isolated environment

## Basic Docker Commands
```bash

docker run busybox echo hi there
# Overrides the default command, prints 'hi there'

docker run busybox ls
# Lists directory contents in the image filesystem

docker ps
# Lists currently running containers

docker ps --all
# Lists all containers ever created (running + stopped)
```

## Container Lifecycle
```bash
docker run               # = docker create + docker start
docker create <image>    # Creates container, returns container ID
docker start -a <id>     # Starts container and attaches output

docker system prune      # Removes stopped containers, unused images, cache

docker logs <id>         # Fetch logs of a container

docker stop <id>         # Graceful stop using SIGTERM
docker kill <id>         # Forcefully kill the container using SIGKILL
``` 

## Running Commands Inside Containers
```bash
docker exec -it <container-id> bash
# Opens a bash terminal inside the running container

# Flags:
# -i: Keep STDIN open
# -t: Allocate a pseudo-terminal (pretty formatting)

# Examples of common shells:
# bash, sh, zsh, powershell
```

## Creating Custom Docker Images
To create your own Docker image, use a Dockerfile:

### Dockerfile Steps:
1. Specify base image (e.g., FROM node, FROM python)

2. Install dependencies using RUN commands

3. Set working directory, copy files using WORKDIR, COPY

4. Define default command using CMD or ENTRYPOINT

### Build and Run:
```bash
docker build -t my-image-name .
docker run my-image-name
```

## Building a Dockerfile
```bash
FROM alpine
RUN apk add --update redis
CMD ["redis-server"]

# then run this command
docker build .

# When we change command, new dockerfile will run from below that changed line only
RUN apk add --update gcc
```

## Tagging an Image
```bash
docker build -t sharmaaggautam/redis:latest .
```

## Installing Dependencies
```bash
COPY ./ ./ 
# Copy everything from the current directory on the host to the current working directory inside the Docker image.
RUN npm install
```

## Port Mapping
```bash
docker run -p localPort:dockerPort imageName
```
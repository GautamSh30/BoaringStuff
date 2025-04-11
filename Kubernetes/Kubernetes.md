## Overview

- Kubernetes is a tool for running a bunch of different containers
- We give it some configuration to describe how we want our containers to run and interact with each other

## Kubernetes Components Overview

| Component            | Description                                                                                      | Communication Role                                                                 |
|----------------------|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Kubernetes Cluster   | A collection of nodes (VMs or physical machines) managed by a master                            | Master node manages all nodes and orchestrates scheduling                          |
| Node                 | A virtual machine that runs containers                                                           | Runs pods; receives instructions from the Master                                   |
| Pod                  | Smallest deployable unit in Kubernetes (wraps one or more containers)                           | Pods communicate via Services; each runs inside a Node                             |
| Deployment           | Ensures a specified number of Pods are running; handles rolling updates and pod restarts       | Talks to the Master to maintain desired Pod state                                  |
| Service              | Provides a stable IP/URL to access a Pod                                                         | Acts as a gateway/load balancer to route traffic to appropriate Pods               |

---

### Kubernetes Flow Summary

1. **Master** manages the **Nodes** and schedules Pods to run on them.
2. Each **Node** hosts one or more **Pods** (e.g., containers running your Posts service or Event Bus).
3. **Deployment** ensures that the correct number of Pods are up and healthy.
4. **Service** abstracts access to the Pods by exposing a consistent network endpoint.
5. All Pods running the same service (e.g., `Posts`) can scale across Nodes.
6. The Event Bus and Posts containers may communicate internally within the cluster via Services.

---

### Example:
- `Deployment for Posts` creates multiple Pods running the `Posts` image on different Nodes.
- `Service` helps route traffic to any of these Pods.
- Another Pod (e.g., `Event Bus`) might talk to the `Posts` Pods via this Service.

## Kubernetes Config Files

| Key Point | Description |
|-----------|-------------|
| Purpose   | Tells Kubernetes about the different Deployments, Pods, and Services (collectively called "Objects") to create |
| Syntax    | Written in **YAML** syntax |
| Best Practice | Always store these config files with your project source code — they act as **documentation** |
| Without Config Files | You *can* create objects without config files — **do not do this**. They provide a precise, repeatable definition of what your cluster is running. |
| Warnings  | - Kubernetes docs may show commands to directly create objects — **only use for testing purposes**<br>- Blog posts may suggest skipping config files — **don’t follow that, use proper config files** |

> ✅ Use YAML config files to maintain clarity, consistency, and documentation of your Kubernetes setup.

## Pod Configuration Breakdown

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: sharmaaggautam/posts:0.0.1
```

| YAML Field                 | Description |
|---------------------------|-------------|
| `apiVersion: v1`          | Specifies the version of the Kubernetes API to use — Kubernetes is extensible and allows defining custom objects. |
| `kind: Pod`               | Declares the type of object we want to create — here it's a Pod. |
| `metadata:`               | Provides configuration metadata for the object. |
| `name: posts`             | Names the Pod as `posts`. |
| `spec:`                   | Defines the specification — the actual desired state of the object. |
| `containers:`             | Lists the containers to run inside the pod. |
| `- name: posts`           | Names the container `posts`. Multiple containers can run inside a single pod. |
| `image: sharmaaggautam/posts:0.0.1` | Specifies the Docker image to use for this container. |

> ✅ This configuration is minimal but functional — it's the building block for deploying containers in Kubernetes.

## Docker vs Kubernetes Command Comparison

| 🐳 **Docker World**                        | ☸️ **Kubernetes (K8s) World**                          | Description |
|-------------------------------------------|-------------------------------------------------------|-------------|
| `docker ps`                                | `kubectl get pods`                                   | Lists all running containers / pods |
| `docker exec -it [container_id] [cmd]`     | `kubectl exec -it [pod_name] [cmd]`                  | Execute a command inside a container/pod |
| `docker logs [container_id]`              | `kubectl logs [pod_name]`                            | View logs from a container/pod |
| _N/A_                                      | `kubectl delete pod [pod_name]`                      | Deletes a pod |
| _N/A_                                      | `kubectl apply -f [config file name]`                | Applies a config file (e.g., YAML) to create/update resources |
| _N/A_                                      | `kubectl describe pod [pod_name]`                    | Displays detailed information about a pod |

> 🚀 Tip: In Kubernetes, a pod can contain multiple containers, so you can also specify the container name using `-c [container_name]` with some commands (like `logs` and `exec`).

## 📦 Kubernetes Deployment Commands Cheat Sheet

| Command                                                       | Description                                          |
|---------------------------------------------------------------|------------------------------------------------------|
| `kubectl get deployments`                                     | List all the running deployments                     |
| `kubectl describe deployment [depl_name]`                     | Print out details about a specific deployment        |
| `kubectl apply -f [config_file_name]`                         | Create or update a deployment using a config file    |
| `kubectl delete deployment [depl_name]`                       | Delete a deployment                                  |

> 📘 Note: Deployment config files are written in YAML and define how pods should be created, scaled, and updated.

## Updating the Image 

**Steps**

1. The deployment must be using the `'latest'` tag in the pod spec section
2. Make an update to your code
3. Build the image
4. Push the image to Docker Hub
5. Run the command:

```bash
docker build -t sharmaaggautam/posts .

docker push sharmaaggautam/posts

kubectl rollout restart deployment posts-depl
```

## Types of Services

### Cluster IP
Sets up an easy to remember URL to access a pod. Only exposes pods in the cluster

### Load Balancer
Makes a pod accessible from outside the cluster. This is the right way to expose a pod to the outside world

### Node Port
Makes a pod accessible from outside the cluster. Usually only used for dev purposes

## 📦 posts Deployment and ClusterIP Service

```bash
# posts-depl.yaml - Deployment for Posts service
apiVersion: apps/v1          # Specifies the API version for Deployments (apps/v1)
kind: Deployment             # Defines this as a Deployment resource that manages Pod replicas
metadata:
  name: posts-depl           # Names this deployment "posts-depl" for easy identification
spec:                        # Begins the specification section for the Deployment
  replicas: 1                # Sets the desired number of Pod replicas to 1
  selector:                  # Defines how the Deployment finds which Pods to manage
    matchLabels:             # Uses label selection to identify Pods
      app: posts             # Manages Pods with the label "app: posts"
  template:                  # Defines the Pod template used to create new Pods
    metadata:                # Pod metadata configuration
      labels:                # Labels attached to the Pod
        app: posts           # Labels this Pod with "app: posts" so the Deployment can find it
    spec:                    # Begins the Pod specification
      containers:            # List of containers in the Pod
        - name: posts        # Names this container "posts"
          image: stephengrider/posts  # Uses the Docker image "stephengrider/posts" from Docker Hub

---
# posts-clusterip-srv.yaml - ClusterIP Service for Posts
apiVersion: v1               # Specifies the API version for Services (v1)
kind: Service                # Defines this as a Service resource for network access
metadata:
  name: posts-clusterip-srv  # Names this service "posts-clusterip-srv"
spec:                        # Begins the specification section for the Service
  selector:                  # Defines which Pods the Service will target
    app: posts               # Targets Pods with the label "app: posts"
  ports:                     # Defines the ports this Service will expose
    - name: posts            # Names this port "posts"
      protocol: TCP          # Uses TCP protocol for communication
      port: 4005             # The Service will be accessible on port 4005
      targetPort: 4005       # Routes traffic to port 4005 on the target Pods
  # This is a ClusterIP Service (default type) which means it's only 
  # accessible within the Kubernetes cluster, not from external networks
```

### Load Balancer Service
Tells Kubernetes to reach out to its provider and provision a load balancer. Gets traffic in to a single pod

### Ingress Controller
A pod with a set of routing rules to distribute traffic to other services

# ShopHaven-ECommerce AI (Next.js + NestJS + GitOps)

A production-style e-commerce platform built with a modern full-stack architecture (Next.js frontend + NestJS API), deployed via GitOps, and designed to be extended with AI features like review summaries and product Q&A.

**Highlights**

- **Hybrid app**: traditional CRUD (rate limits, validation, logging)
- **Production deployment**: Docker images + GitHub Actions CI + GitOps CD (ArgoCD) to Kubernetes
- **Infra as Code**: Terraform-managed cloud infrastructure (networking, cluster, registry, secrets)
  "Coming Soon AI endpoints (summaries / Q&A / chat over docs) with guardrails "

---

## Live Demo
“Coming soon — run locally in 5 minutes (see Quickstart).”

---

## Screenshots / GIFs
https://github.com/user-attachments/assets/c635dfee-cebc-4acf-8f8e-6c01f6c22c79

# Database Diagram 

<img width="1470" height="970" alt="Screenshot 2026-01-20 at 8 03 17 PM" src="https://github.com/user-attachments/assets/46a032e4-1d82-48db-bb5b-24702cb818d1" />

# Aws Architecture Diagram

<img width="1392" height="958" alt="Screenshot 2026-01-20 at 8 16 13 PM" src="https://github.com/user-attachments/assets/e09ee988-4225-47db-99e3-584abc34d731" />

## Tech Stack

### 🖥️ Frontend
- Next.js (React), TypeScript
- TailwindCSS 

### 🧠 Backend
- NestJS (TypeScript)
- REST API: `/api/v1`
- Validation: `class-validator`

### 🗄️ Data
- PostgreSQL
- TypeORM

### ☁️ Infra / Platform
- Docker, Docker Compose (local)
- Terraform (IaC)
- AWS EKS (Kubernetes)
- ArgoCD (GitOps CD)

### ✅ Observability & Quality
- Logging: Pino/Winston
- ESLint, Prettier


## Quickstart (Local)

### Prerequisites
- Node.js (LTS)
- Docker + Docker Compose

### Run

# 1) Clone
```bash
git clone https://github.com/Gisselle546/next-ecommerce-ai.git
```
cd next-ecommerce-ai

# 2) start local stack
docker compose up -d

# 4) Backend
cd backend
npm install
npm run start:dev

# 5) Frontend 
cd client
npm install
npm run dev


Client: http://localhost:4200

API: http://localhost:3000/api/v1

## Repo Map

> Start here, then jump into the area you care about.

- ✅ **Root docs:** you are here
- 🧠 **Backend:** [`/backend`](./backend)  
  API, DB, auth, domain logic
- 🎨 **Client:** [`/client`](./client)  
  UI, pages, client state, integration
- 🚀 **GitOps:** [`/gitops`](./gitops)  
  ArgoCD apps, manifests, Helm/Kustomize
- 🏗️ **Infra:** [`/infra`](./infra)  
  Terraform, environments, cluster & networking


## CI/CD Overview

### CI (GitHub Actions)
**Goals:** keep `main` healthy + publish deployable artifacts.

- ✅ Lint + typecheck
- 🐳 Build Docker images
- 📦 Push to registry 

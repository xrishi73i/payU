# PayU

A full-stack digital payments application built to explore how modern payment platforms are architected.

The project focuses on secure authentication, transactional money transfers, user discovery, and a responsive frontend backed by a scalable REST API. Rather than replicating the visual design of existing products, the goal is to build production-style application architecture while keeping the codebase clean, modular, and maintainable.

This repository is under continuous development and new features are added incrementally.

---

## Features

### Authentication

- User registration
- User login
- JWT based authentication
- Password hashing with bcrypt
- Protected API routes

### Dashboard

- Personalized landing page
- Account overview
- Responsive navigation

### User Search

- Username based search
- Real-time filtering
- Backend powered search using Prisma
- Optimized request flow

### Money Transfer

- Secure account-to-account transfers
- Database transactions
- Atomic balance updates

### Transaction History

- Incoming and outgoing payments
- Chronological ordering
- Transaction metadata
- Clean timeline interface

### Profile

- User information
- Account details
- Profile management

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT
- bcrypt

### Database

- PostgreSQL

### Deployment

- Railway

---

## Project Structure

```
backend/
    routes/
    middleware/
    prisma/
    lib/

frontend/
    components/
    pages/
    services/
    api/
```

---

## API

### User

```
POST   /signup
POST   /signin
PUT    /update
GET    /bulk
```

### Account

```
GET    /balance
POST   /transfer
GET    /transactions
```

---

## Engineering Focus

The primary objective of this project is not UI replication but understanding the engineering behind financial applications.

Some areas explored include:

- Stateless authentication
- REST API design
- Database transactions
- Prisma ORM
- Route protection
- State management
- Modular project architecture
- Client-server communication
- Error handling
- Component composition

---

## Planned Improvements

- Real-time messaging
- Payment requests
- Notifications
- Receipt generation
- Analytics dashboard
- User activity logs
- Search optimizations
- End-to-end testing

---

## Local Development

```bash
git clone https://github.com/xrishi73i/payU.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables


## Status

This project is actively maintained. Features are added as they are designed, implemented, and tested.


## Design Inspiration

The interface is inspired by modern fintech applications with a focus on simplicity, readability, and responsive interactions.

Key design influences include:

- Glassmorphism and minimal dark UI principles
- Modern payment applications
- Dashboard layouts from contemporary fintech products
- Motion and micro-interactions inspired by Framer Motion examples

The objective was not to replicate any existing application, but to build a clean, production-style user experience while implementing the frontend from scratch using React, Tailwind CSS, and Framer Motion.

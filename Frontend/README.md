# Care Connect Hub

Shared Project Context

I am building a production-style Doctor Appointment Management System for my software development internship.

This is my first Java Spring Boot and React full-stack project, so the code must be clean, understandable and properly explained.

Required technology stack

Frontend:

React

Vite

React Router

Axios

Responsive UI

Deployment on Vercel

Backend:

Java

Spring Boot

Maven

Spring Security

JWT authentication

Spring Data JPA

Hibernate

Jakarta Validation

Bucket4j rate limiting

Swagger/OpenAPI

Deployment on Railway

Database:

PostgreSQL hosted on Supabase

Flyway migrations

Proper indexes, constraints and relationships

Testing:

Postman

JUnit

Mockito

AI chatbot:

Groq API as the primary provider

Gemini API as fallback

RAG using verified clinic documents

The chatbot must not diagnose diseases or prescribe medicines

Architecture

Use a modular monolith with these modules:

authentication

users

doctors

specializations

availability

appointments

chatbot

admin

Use this backend flow:

Controller → Service → Repository → PostgreSQL

Do not expose entities directly. Use DTOs.

Roles

PATIENT:

Register and log in

Search doctors

View doctor availability

Book, view, reschedule and cancel appointments

Use the chatbot

DOCTOR:

Manage profile

Create availability slots

View assigned appointments

Confirm, reject or complete appointments

ADMIN:

Manage doctors

Manage patients

Monitor appointments

Core requirements

At least 10 working REST APIs

JWT authentication

Role-based authorization

API rate limiting

HTTP 429 handling

Input validation

Global exception handling

Pagination

Double-booking prevention

Swagger documentation

Postman collection

Real database integration

Deployment-ready configuration

No hard-coded API keys or database credentials

Deployment architecture

React frontend on Vercel

Spring Boot backend on Railway

PostgreSQL database on Supabase

React must communicate only with the Spring Boot backend. React must not directly access the database.

Every output must follow this architecture unless I explicitly approve a change.

Using the shared project context above, act only as the React frontend engineer and healthcare UI designer.

Do not create a backend.

Do not connect React directly to Supabase.

Do not place Groq, Gemini, database or JWT secret keys in the frontend.

The React application must communicate only with the Spring Boot backend using REST APIs.

Technology requirements

Use:

React

Vite

React Router

Axios

React Hook Form

Zod validation

Context API

Tailwind CSS

Responsive and accessible components

Required pages

Create:

Landing page

Patient registration page

Login page

Doctor search page

Doctor profile page

Available slot selection page

Appointment booking confirmation page

Patient dashboard

Doctor dashboard

My appointments page

Doctor availability management page

Profile page

Admin dashboard

AI assistant panel

Unauthorized page

Not-found page

Design requirements

Use a clean, trustworthy and professional healthcare design.

Include:

responsive navigation

mobile layout

doctor cards

specialization filters

location filters

consultation fee filters

pagination controls

loading skeletons

empty states

form validation

success notifications

error notifications

accessible labels

keyboard navigation

confirmation dialog before cancellation

rate-limit error message

Do not use fake medical claims, ratings or testimonials.

API integration

Create a centralized Axios client.

Use:

VITE_API_BASE_URL

The Axios client must:

attach the JWT token

normalize backend errors

handle HTTP 401

handle HTTP 403

handle HTTP 409

handle HTTP 429

read the Retry-After header

display how long the user should wait

redirect unauthenticated users to login

Create:

AuthContext

ProtectedRoute

RoleBasedRoute

reusable loading component

reusable error component

reusable pagination component

Backend endpoints

Integrate with:

POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/doctors

GET /api/v1/doctors/{doctorId}

POST /api/v1/doctors/availability

GET /api/v1/doctors/{doctorId}/availability

POST /api/v1/appointments

GET /api/v1/appointments/my

PATCH /api/v1/appointments/{appointmentId}/status

PATCH /api/v1/appointments/{appointmentId}/reschedule

DELETE /api/v1/appointments/{appointmentId}

POST /api/v1/assistant/chat

Initially use mock JSON data through a dedicated mock service.

Keep the service layer replaceable so mock functions can later be replaced with real Axios calls without rewriting UI components.

AI assistant UI

Create a floating assistant panel.

The assistant can:

answer application navigation questions

explain clinic policies

help find a specialization

show source title and evidence strength

The assistant must display:

a disclaimer that it does not provide diagnosis

source details

evidence strength

an insufficient-evidence message

provider-unavailable error

HTTP 429 retry message

Do not allow the assistant to claim that an appointment has been booked unless the booking API confirms it.

Output order

Start with:

Design system

Page map

Component tree

Routing structure

Folder structure

API service interfaces

Mock data format

Then generate the application page by page.

Do not generate backend or database code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://appt-aid-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2086c847-52c5-4db2-be91-7e17c06b103c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

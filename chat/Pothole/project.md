# Pothole Detection Platform

**Full-Stack Pothole Detection & Monitoring Platform**

Full-Stack • Computer Vision • Smart City

GitHub: https://github.com/abdullah-habeeb/pothole

---

# Overview

A full-stack platform for detecting and managing potholes from uploaded dashcam video, combining a React dashboard, a Node/Express/MongoDB backend, and a dedicated FastAPI machine-learning microservice that calls a Roboflow-hosted YOLOv11 model to do the actual detection. Built as a production-ready foundation for smart-city and road-infrastructure monitoring, not a one-off demo.

---

# The Problem

Identifying and tracking road hazards like potholes is normally manual and reactive, with no unified system to detect, verify, and visualize them at scale. Cities and commuters have no central, data-backed view of where hazards are and how severe they are.

---

# Solution

Users upload dashcam footage through the React frontend. The backend orchestrates the request; a separate FastAPI ML microservice samples every 5th frame of the video with OpenCV, sends frames to a Roboflow-hosted YOLOv11 model (`cpecog1-potholes-uwzi8/2`) via the Roboflow Inference SDK, and returns a severity rating (high/medium/none) plus up to 5 detections — each with a confidence score, bounding box, and a base64 preview image. Results are stored and surfaced on an interactive map (React Leaflet) and a dashboard with charts (Recharts), behind JWT-authenticated, role-gated routes.

---

# Architecture

React 18 + TypeScript frontend (Vite, TanStack Query, Axios, Tailwind, React Leaflet, Recharts)

↓ upload video

Node.js + Express + MongoDB backend (JWT auth, Mongoose models, protected routes)

↓ delegates analysis

FastAPI ML microservice (`ml-server`) — samples every 5th frame with OpenCV → Roboflow YOLOv11 via InferenceHTTPClient → returns `{ severity, potholes: [{ confidence, x, y, width, height, preview_image }], preview_image }`

Three services run independently: frontend (3000), backend (5000), ml-server (8000).

---

# Core Capabilities

- JWT-based authentication with protected routes (`/dashboard`, `/map`, `/upload`, `/admin`)
- Dashcam video upload and analysis via a dedicated ML microservice
- Roboflow-hosted YOLOv11 pothole detection with per-detection confidence, bounding box, and preview image
- Severity classification (high / medium / none) per video
- Interactive map visualization of detected hazards (React Leaflet)
- Admin dashboard with charts (Recharts)

---

# Technology Stack

Frontend

- React 18, TypeScript, Vite
- React Router, TanStack Query, Axios
- Tailwind CSS, React Leaflet, Recharts

Backend

- Node.js, Express, MongoDB (Mongoose)
- JWT authentication, bcrypt password hashing, CORS

ML Service

- FastAPI, Uvicorn
- Roboflow Inference SDK (YOLOv11 model), OpenCV (frame sampling)

---

# Engineering Decisions

Why a separate FastAPI microservice instead of running detection inside the Node backend?

Keeps the ML/Python ecosystem (OpenCV, the Roboflow inference SDK) fully decoupled from the Node/Express API layer — the detection service can be scaled, redeployed, or swapped independently of the main app, and each service stays in the language best suited to it.

Why a Roboflow-hosted model instead of self-hosting inference?

Avoids managing GPU infrastructure for a project at this stage — a hosted inference endpoint lets the rest of the system (auth, storage, map, dashboard) be the focus while still getting real YOLOv11 detections.

Why sample every 5th frame instead of every frame?

A deliberate speed/coverage tradeoff — running inference on every frame of a video is expensive and mostly redundant given how slowly pothole framing changes between adjacent frames; every 5th frame keeps detection responsive without materially losing coverage.

Why JWT with protected routes?

Dashboard, map, upload, and admin views are all gated — the platform isn't a public detector, it's meant to support an authenticated monitoring workflow (e.g. city staff or fleet operators), so auth had to be first-class from the start.

---

# Challenges

- Keeping the response shape (`severity`, `potholes[]`, `preview_image`) consistent across three independently developed services
- Coordinating three separate local dev servers (frontend, backend, ml-server) during development
- Balancing frame-sampling rate against detection coverage and response latency
- Designing protected-route auth that cleanly separates public (login/signup) from gated (dashboard/map/upload/admin) surfaces

---

# Future Work

- Persist detections with geolocation for longitudinal hazard tracking, not just per-upload results
- Move from client-triggered video upload to background/async processing for larger files
- Expand the admin dashboard with historical severity trends over time

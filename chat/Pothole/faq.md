# Pothole Detection Platform FAQ

## What is this project?

A full-stack platform for detecting potholes from uploaded dashcam video — a React dashboard and map, a Node/Express/MongoDB backend with JWT auth, and a separate FastAPI ML microservice that calls a Roboflow-hosted YOLOv11 model to do the actual detection.

---

## How does the detection actually work?

A video is uploaded through the frontend, the backend hands it to a dedicated FastAPI `ml-server`, which samples every 5th frame with OpenCV, sends frames to a Roboflow-hosted YOLOv11 model via the Roboflow Inference SDK, and returns a severity rating plus up to 5 detections — each with a confidence score, bounding box, and preview image.

---

## Why three separate services instead of one app?

Each layer plays to a different strength: React/TypeScript for the dashboard and map UI, Node/Express/MongoDB for auth and data, and a dedicated FastAPI service for the Python-based ML inference pipeline (OpenCV, Roboflow SDK). Splitting them means the ML service can be redeployed or scaled independently of the main app.

---

## Why Roboflow instead of a self-hosted model?

It avoids managing GPU infrastructure for a project at this stage — a hosted YOLOv11 endpoint gives real detections while the rest of the system (auth, storage, map, dashboard) stays the focus.

---

## Why sample every 5th frame?

Running inference on every frame is expensive and largely redundant since pothole framing doesn't change much between adjacent frames — sampling every 5th frame keeps the pipeline responsive without materially losing detection coverage.

---

## What's protected behind authentication?

The dashboard, map, upload, and admin routes all require a valid JWT. Only login and signup are public.

---

## What's the tech stack?

React 18 + TypeScript + Vite on the frontend (with React Leaflet for maps and Recharts for the dashboard), Node.js + Express + MongoDB on the backend, and FastAPI + OpenCV + the Roboflow Inference SDK for the ML service.

---

## Biggest engineering challenge?

Keeping the detection response shape consistent across three independently developed services, and coordinating three separate dev servers during development.

---

## What would you improve today?

Persist detections with geolocation for longitudinal hazard tracking instead of just per-upload results, and move video analysis to a background/async job for larger uploads.

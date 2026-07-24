# Bengaluru Auto Fare Calculator

**Official Auto-Rickshaw Fare Calculator for Bengaluru**

Web • Google Maps API • Vanilla JavaScript

GitHub: https://github.com/abdullah-habeeb/bengaluru-auto-fare-calculator

---

# Overview

A clean, focused web app that calculates the official auto-rickshaw fare for any trip in Bengaluru, so commuters can verify what they should be paying instead of guessing. Built as a one-week "mini-mini project" specifically to practice API integration, DOM manipulation, and modern CSS without any framework overhead.

---

# The Problem

Auto-rickshaw fares in Bengaluru are often inconsistent in practice, which leads to confusion and overcharging. There was no quick, official way for a rider to check what a trip should actually cost before getting in.

---

# Solution

The app uses Google Places Autocomplete so a rider can quickly enter a start and end location, then calls the Google Maps Distance Matrix API to get the precise road distance between them — not a straight-line estimate. It applies the official Bengaluru fare structure (₹35 minimum for the first 2 km, ₹17/km after that) and automatically applies the 1.5x night surcharge for trips between 10 PM and 5 AM.

---

# Core Capabilities

- Google Places Autocomplete for real-time location suggestions
- Real road-distance calculation via the Google Maps Distance Matrix API
- Official fare logic: ₹35 minimum fare for the first 2 km, ₹17/km beyond that
- Automatic 1.5x night-charge surcharge between 10 PM and 5 AM
- Clean, responsive, mobile-friendly UI with no build step

---

# Technology Stack

- HTML5, CSS3 (Flexbox layout)
- Vanilla JavaScript (no framework)
- Google Maps JavaScript API — Places API, Distance Matrix API

---

# Engineering Decisions

Why vanilla JavaScript instead of a framework?

This was scoped as a one-week project specifically to practice core web fundamentals — API integration and DOM manipulation — without build tooling getting in the way. A framework would have been overhead for a single-page calculator.

Why the Distance Matrix API instead of straight-line distance?

Fare depends on actual road distance, not as-the-crow-flies distance — using the Distance Matrix API keeps the calculated fare accurate to what a rider would really be charged.

---

# Challenges

- Getting real, road-accurate distances (not straight-line) to keep the fare calculation trustworthy
- Implementing the night-surcharge time window correctly across the 10 PM–5 AM boundary
- Keeping the UI clean and mobile-friendly with plain CSS/Flexbox and no framework

---

# Notes

Fare data is based on the official rates for Bengaluru as of September 2025. This was a small, deliberately scoped project — a contrast to the larger multi-service platforms, showing the same care applied to a focused, single-purpose tool.

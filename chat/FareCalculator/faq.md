# Bengaluru Auto Fare Calculator FAQ

## What is this project?

A simple web app that calculates the official auto-rickshaw fare for a trip in Bengaluru, using the Google Maps API to get real road distance and applying the official fare structure — so riders can check what they should actually be charged.

---

## How is the fare calculated?

₹35 minimum fare for the first 2 km, then ₹17/km for the remaining distance, with a 1.5x surcharge automatically applied for trips between 10 PM and 5 AM.

---

## Why vanilla JavaScript instead of React or another framework?

It was scoped as a one-week project specifically to practice API integration and DOM manipulation directly — a framework would have added build-tooling overhead for what's a single-page calculator.

---

## Why the Distance Matrix API instead of just straight-line distance?

Fares are based on actual road distance, not straight-line distance — using Google's Distance Matrix API keeps the calculated fare accurate to what a rider would really be charged.

---

## What's the tech stack?

HTML5, CSS3 with Flexbox, vanilla JavaScript, and the Google Maps JavaScript API (Places API for autocomplete, Distance Matrix API for distance).

---

## Is the fare data current?

It's based on the official rates for Bengaluru as of September 2025.

---

## What would you improve today?

Keep the fare structure configurable rather than hardcoded, so rate changes don't require a code update.

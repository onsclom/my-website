---
title: 'Input Latency Measurements'
pubDate: 2026-04-28
---

Each trial was filmed on an **iPhone SE** in 240 fps slow-motion mode, then the frames
between the spacebar starting to depress and the on-screen response were counted.
One frame ≈ **4.17 ms**. Every runtime/configuration was sampled **20 times**.

Hardware:
- **OSX**: M1 MacBook (built-in display)
- **Windows**: gaming PC paired with a gaming monitor

## OSX / Fullscreen

| Runtime | Min (frames / ms) | Max (frames / ms) | Mean (frames / ms) | Median (frames / ms) |
|---------|------------------:|------------------:|-------------------:|---------------------:|
| raylib | 8 / 33.33 | 9 / 37.50 | 8.15 / 33.96 | 8 / 33.33 |
| chrome | 10 / 41.67 | 15 / 62.50 | 11.90 / 49.58 | 12 / 50.00 |
| safari | 8 / 33.33 | 13 / 54.17 | 10.15 / 42.29 | 10 / 41.67 |
| firefox | 9 / 37.50 | 12 / 50.00 | 10.95 / 45.63 | 11 / 45.83 |

## OSX / Windowed

| Runtime | Min (frames / ms) | Max (frames / ms) | Mean (frames / ms) | Median (frames / ms) |
|---------|------------------:|------------------:|-------------------:|---------------------:|
| raylib | 7 / 29.17 | 9 / 37.50 | 8.10 / 33.75 | 8 / 33.33 |
| chrome | 9 / 37.50 | 15 / 62.50 | 12.00 / 50.00 | 12 / 50.00 |

## Windows / Fullscreen

| Runtime | Min (frames / ms) | Max (frames / ms) | Mean (frames / ms) | Median (frames / ms) |
|---------|------------------:|------------------:|-------------------:|---------------------:|
| raylib | 1 / 4.17 | 2 / 8.33 | 1.15 / 4.79 | 1 / 4.17 |
| chrome | 2 / 8.33 | 3 / 12.50 | 2.35 / 9.79 | 2 / 8.33 |

## Cross-comparison (mean latency, ms)

| Runtime | OSX Fullscreen | OSX Windowed | Windows Fullscreen |
|---------|---------------:|-------------:|-------------------:|
| raylib | 33.96 | 33.75 | 4.79 |
| chrome | 49.58 | 50.00 | 9.79 |
| safari | 42.29 | — | — |
| firefox | 45.63 | — | — |

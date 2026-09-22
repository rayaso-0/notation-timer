# notation-timer

A minimalist, offline-first desktop speedcubing timer designed for deep focus and competitive performance. 

Built for speedcubers who want a distraction-free environment, Notation features a focus mode that fades out the UI during solves, backed by a lightning-fast local SQLite database for instantaneous solve logging

## Current Features
* **Distraction-Free Focus Mode:** Letterboxes, dropdowns, and UI elements smoothly fade away the moment you begin a solve, keeping your eyes purely on the puzzle.
* **Precision Timing Engine:** Hardware-accurate spacebar mechanics (press to ready, release to start, press to stop) with strict event handling to prevent UI lag or ghost timers.
* **Offline-First Storage:** Powered by a synchronous C++ SQLite engine (`better-sqlite3`), ensuring zero-latency data persistence directly to your local machine without relying on external web servers.
* **Secure Architecture:** Built as a modern Electron desktop application utilizing a strict IPC (Inter-Process Communication) bridge to keep the React frontend sandboxed from the Node.js backend.

## Roadmap
* **Cascading Configurations:** Dynamic database-driven dropdowns linking specific puzzles to their relevant solving methods and hardware.
* **Dynamic Split Tracking:** Phase-by-phase time breakdowns (e.g., Cross, F2L, OLL, PLL) that adapt automatically based on the selected solving method.
* **Analytics Dashboard:** Comprehensive data visualization using Recharts to track solve trends, moving averages (Ao5, Ao12), and historical performance.
* **Community Feedback UI:** Integrated Formspree modal allowing users to submit requests for missing puzzles and obscure methods.
* **Seamless Auto-Updates:** Background application updates delivered automatically via GitHub Releases using `electron-updater`.
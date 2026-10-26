# Smart Elevator Prototype

**IoT-Based Floor Detection, Load Monitoring, and Web-Based Status Tracking**

## Project Objective

This project is a software prototype of a smart elevator system with 3 floors. It simulates elevator movement, floor sensors, load sensors, door sensors, and motor control through software — designed so real ESP32 hardware can be connected later.

The main goal is a functional, attractive web dashboard that demonstrates smart elevator monitoring and control for educational purposes.

## Features

- **3-Floor Elevator Simulation** — Step-by-step movement (1→2→3 or 3→2→1) with visual animation
- **Real-Time Dashboard** — Current floor, target floor, direction, status, door, and load
- **Floor Selection Controls** — Destination buttons with validation
- **Load Monitoring** — Simulated load sensor with +/- controls and random load
- **Overload Detection** — Disables movement when load exceeds 100 kg
- **Sensor Monitoring** — Floor, load, door, and motor sensor simulation
- **Emergency Stop** — Immediately halts movement and locks controls
- **System Reset** — Returns elevator to initial state
- **Trip History** — Records completed trips in memory
- **Responsive UI** — Modern IoT dashboard design

## Technology Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite, JavaScript, CSS, Axios, Lucide React |
| Backend  | Node.js, Express.js, CORS           |
| Database | In-memory (no database required)    |

## Project Structure

```
Smart-Elevator/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # Axios API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
├── backend/
│   ├── routes/             # API route handlers
│   ├── services/           # Elevator & sensor simulation logic
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## How to Start

Open two terminal windows:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

The backend runs at `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173`

Open `http://localhost:5173` in your browser.

## How Elevator Simulation Works

1. User selects a destination floor (1, 2, or 3).
2. Backend validates the request (not current floor, not moving, not overloaded, not in emergency).
3. Elevator status becomes `MOVING`, motor turns `ON`, direction is set to `UP` or `DOWN`.
4. Current floor updates every **1 second** until the target is reached.
5. On arrival: status becomes `ARRIVED`, door opens.
6. After **2.5 seconds**, door closes and status returns to `IDLE`.

## How Load Monitoring Works

- Load is simulated in software (0–100+ kg).
- Use **+** / **-** buttons to change load by 5 kg increments.
- **Random Load** generates a random value between 0–120 kg.
- The load sensor section updates automatically with the current value.

## How Overload Detection Works

- Maximum allowed load: **100 kg**
- If load > 100 kg:
  - Status becomes `OVERLOAD`
  - Floor buttons are disabled
  - A warning is displayed
- When load returns to 100 kg or below:
  - Status returns to `IDLE`
  - Elevator becomes ready for movement

## API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/elevator/status` | Get elevator state       |
| POST   | `/api/elevator/move`   | Move to a floor          |
| POST   | `/api/elevator/reset`  | Reset system             |
| POST   | `/api/elevator/emergency` | Emergency stop        |
| GET    | `/api/sensors/status`  | Get all sensor data      |
| GET    | `/api/sensors/load`    | Get load sensor data     |
| POST   | `/api/sensors/load`    | Update load              |
| GET    | `/api/trips`           | Get trip history         |

## Future ESP32 Integration

The sensor logic is abstracted in backend services:

- `getCurrentFloor()` — Floor detection
- `getLoad()` — Weight sensor
- `getDoorStatus()` — Door sensor
- `getMotorStatus()` — Motor control

Currently these return simulated values. To connect ESP32 hardware later, replace the simulation functions in `backend/services/elevatorService.js` and `backend/services/sensorService.js` with serial/WiFi communication that reads real sensor data from the microcontroller.

## License

Educational prototype — free to use for college projects.

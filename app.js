const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let events = [];
let nextId = 1;

// GET: View all events
app.get("/events", (req, res) => {
  res.json(events);
});

// POST: Create an event
app.post("/events", (req, res) => {
  const {
    name,
    date,
    location,
    attendees,
    reusable,
    water,
    digital,
    materials,
    transport,
  } = req.body;

  if (!name || !date || !location || !attendees) {
    return res.status(400).json({
      message: "Please enter all required event details",
    });
  }

  const event = {
    id: nextId++,
    name,
    date,
    location,
    attendees: Number(attendees),
    reusable: Boolean(reusable),
    water: Boolean(water),
    digital: Boolean(digital),
    materials: Number(materials || 0),
    transport: transport || "Public Transport",
  };

  let score = 0;

  if (event.reusable) score += 25;
  if (event.water) score += 20;
  if (event.digital) score += 15;

  if (event.transport === "Walking" || event.transport === "Cycling") {
    score += 25;
  } else if (
    event.transport === "Public Transport" ||
    event.transport === "Carpool"
  ) {
    score += 20;
  } else {
    score += 5;
  }

  if (event.materials > 0) score += 15;

  event.score = score;
  events.push(event);

  res.status(201).json({
    message: "Event created successfully",
    event,
  });
});

// PUT: Update an event
app.put("/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((event) => event.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events[index] = {
    ...events[index],
    ...req.body,
    id,
  };

  res.json({
    message: "Event updated successfully",
    event: events[index],
  });
});

// DELETE: Remove an event
app.delete("/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = events.some((event) => event.id === id);

  if (!exists) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events = events.filter((event) => event.id !== id);

  res.json({
    message: "Event deleted successfully",
  });
});

app.get("/", (req, res) => {
  res.send("GreenRoute API is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`GreenRoute backend running at http://localhost:${PORT}`);
});

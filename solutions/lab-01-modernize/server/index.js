// Importing the necessary modules
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './routes/user.js';
dotenv.config();
const port = process.env.SERVER_PORT || 8081;

// Connecting to the database. MONGO_URI defaults to a local install so
// students don't have to create a .env file just to run the chat server.
// useNewUrlParser was deprecated in Mongoose 6+ and removed in 8 — dropping
// it silences the warning and works on either version.
const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
mongoose
  .connect(`${mongoUri}/real-time-chat`)
  .then(() => {
    console.log(`Connected to ${mongoUri}/real-time-chat`);
  })
  .catch((e) => {
    console.log(e);
    console.log('Connection failed!');
  });

// Initialize the Express app
const app = express();
app.use(cors());
app.use(express.static('public'));
// Setting up the headers for the CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting up the routes
app.use('/api/user', userRoutes);

// Initialize the HTTP server
const httpServer = createServer(app);

// Initialize Socket.io server
const io = new Server(httpServer, {
  // Socket.io options here
  cors: {
    origin: '*',
  },
});

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle message events
  socket.on('message', (message) => {
    console.dir(message.text);
    io.emit('message', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

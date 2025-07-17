
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI ;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/profile', profileRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});
app.set('io', io); 

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
const app = express();
import * as http from "http"
import * as path from 'path';
const server = http.createServer(app);
import { Server } from "socket.io"
const io = new Server(server,{path:"/api/socket.io"});


app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});
io.on('connection', (socket) => {
  console.log('a user connected');
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

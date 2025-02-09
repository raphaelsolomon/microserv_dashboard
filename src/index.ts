import { Request, Response } from "express";
import Database from "./database";
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express()
const database = new Database();

app.use(express.json());
app.use(cors());

// Create a new project
app.use('/api', );

database.connectToMongoDB().then(async (_) => {
  if (_ instanceof Error) {
    console.error(_.message);
    return;
  }
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
})
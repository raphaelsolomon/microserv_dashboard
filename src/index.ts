import Database from "./database";
const crypto = require('crypto');
import cors from 'cors';
import express from 'express';
import projectRoutes from "./routes/project.route";
import lamdaRoutes from "./routes/lamda.route";
// import routes from "./routes/project.route";

const app = express()
const database = new Database();

app.use(express.json());
app.use(cors());

// Create a new project
app.use('/api', projectRoutes);
app.use('/api', lamdaRoutes);

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
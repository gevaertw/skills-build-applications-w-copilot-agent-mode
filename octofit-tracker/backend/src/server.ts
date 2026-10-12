import express from 'express';
import { connectToDatabase } from './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models/index.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().sort({ name: 1 }));
});

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().sort({ name: 1 }));
});

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().sort({ date: -1 }));
});

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ rank: 1 }));
});

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().sort({ title: 1 }));
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

export async function startServer(): Promise<void> {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening at ${apiBaseUrl}`);
  });
}

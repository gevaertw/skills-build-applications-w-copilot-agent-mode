import mongoose from 'mongoose';
import { startServer } from './server.js';

void startServer().catch((error: unknown) => {
  console.error('Error starting OctoFit API:', error);
  process.exitCode = 1;
  void mongoose.disconnect();
});

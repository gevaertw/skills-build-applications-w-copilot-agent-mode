import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await connectToDatabase();

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      { name: 'Avery Chen', email: 'avery@example.com' },
      { name: 'Jordan Patel', email: 'jordan@example.com' },
      { name: 'Morgan Rivera', email: 'morgan@example.com' },
    ]);

    const teams = await Team.create([
      {
        name: 'Trail Blazers',
        description: 'Outdoor runners building consistency together.',
        memberIds: [users[0]._id, users[1]._id],
      },
      {
        name: 'Peak Performers',
        description: 'A well-rounded team focused on strength and endurance.',
        memberIds: [users[2]._id],
      },
    ]);

    await User.bulkWrite([
      { updateOne: { filter: { _id: users[0]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[1]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[2]._id }, update: { teamId: teams[1]._id } } },
    ]);

    const now = new Date();
    await Activity.create([
      { userId: users[0]._id, type: 'running', durationMinutes: 35, calories: 320, date: now },
      { userId: users[1]._id, type: 'cycling', durationMinutes: 50, calories: 410, date: now },
      { userId: users[2]._id, type: 'strength', durationMinutes: 40, calories: 280, date: now },
    ]);

    await Leaderboard.create([
      { userId: users[0]._id, points: 1240, rank: 1, period: 'weekly' },
      { userId: users[1]._id, points: 980, rank: 2, period: 'weekly' },
      { userId: users[2]._id, points: 760, rank: 3, period: 'weekly' },
    ]);

    await Workout.create([
      {
        title: 'Steady-State Run',
        type: 'cardio',
        durationMinutes: 30,
        difficulty: 'beginner',
        description: 'Build aerobic fitness with a conversational-pace run.',
      },
      {
        title: 'Full-Body Strength',
        type: 'strength',
        durationMinutes: 45,
        difficulty: 'intermediate',
        description: 'Train major muscle groups with a balanced strength circuit.',
      },
      {
        title: 'Mobility Reset',
        type: 'recovery',
        durationMinutes: 20,
        difficulty: 'beginner',
        description: 'Restore range of motion with gentle guided mobility work.',
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedDatabase();

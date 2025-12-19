const { connectToDatabase } = require('./lib/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase();

    const server = app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      if (process.env.NODE_ENV !== 'production') {
        try {
          // seed if no topics exist
          const Topic = require('./models/Topic');
          const seedConnected = require('./seedConnected');
          const cnt = await Topic.countDocuments();
          if (cnt === 0) {
            console.log('No topics in DB — running dev-only seedConnected()');
            await seedConnected();
          } else {
            console.log('Topics already exist — skipping dev seed');
          }
        } catch (err) {
          console.error('Dev seed check failed', err);
        }
      }
    });

    // graceful shutdown
    process.on('SIGINT', () => server.close(() => process.exit(0)));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

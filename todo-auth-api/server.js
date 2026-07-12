require('dotenv').config({ quiet: true });

const express = require('express');
const routes = require('./src/routes');
const { connectDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  try {
    await connectDatabase();
    console.log('Connected to MySQL and ensured tables exist');
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
  }
}

main();

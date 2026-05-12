const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

start();

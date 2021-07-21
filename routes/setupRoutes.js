const myselfRouter = require('./myself');

const setupRoutes = (app) => {
  app.use('/myself', myselfRouter);
};
  
module.exports = {
  setupRoutes,
};
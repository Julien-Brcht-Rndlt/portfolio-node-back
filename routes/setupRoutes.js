const myselfRouter = require('./myself');
const projectsRouter = require('./myself');

const setupRoutes = (app) => {
  app.use('/myself', myselfRouter);
  app.use('/projects', projectsRouter);
};
  
module.exports = {
  setupRoutes,
};
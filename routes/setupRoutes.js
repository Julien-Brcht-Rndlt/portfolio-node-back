const myselfRouter = require('./myself');
const projectsRouter = require('./myself');
const skillsRouter = require('./myself');

const setupRoutes = (app) => {
  app.use('/myself', myselfRouter);
  app.use('/projects', projectsRouter);
  app.use('/skills', skillsRouter);
};
  
module.exports = {
  setupRoutes,
};
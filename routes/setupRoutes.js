const myselfRouter = require('./myself');
const projectsRouter = require('./projects');
const skillsRouter = require('./skills');

const setupRoutes = (app) => {
  app.use('/myself', myselfRouter);
  app.use('/projects', projectsRouter);
  app.use('/skills', skillsRouter);
};
  
module.exports = {
  setupRoutes,
};
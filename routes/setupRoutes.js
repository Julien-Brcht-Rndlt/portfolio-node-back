const myselfRouter = require('./myself');
const projectsRouter = require('./projects');
const skillsRouter = require('./skills');
const hobbiesRouter = require('./hobbies');
const loginRouter = require('./login');
const registerRouter = require('./register');

const setupRoutes = (app) => {
  app.use('/myself', myselfRouter);
  app.use('/projects', projectsRouter);
  app.use('/skills', skillsRouter);
  app.use('/hobbies', hobbiesRouter);
  app.use("/auth/login", loginRouter);
  app.use("/auth/register", registerRouter);
};
  
module.exports = {
  setupRoutes,
};
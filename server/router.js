const AuthenticationController = require('./controllers/authentication'),
      ErrorController = require('./controllers/error'),
      DNLController = require('./controllers/dnl'),
      CMSController = require('./controllers/cms'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport'),
      config = require('config'),
      path = require('path');


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
const requireLogin  = passport.authenticate('local', { session: false });

// Role types enum: ['sysadmin', 'user'],
const REQUIRE_SYSADMIN = "sysadmin",
      REQUIRE_USER = "user";

module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        authRoutes = express.Router(),
        cmsRoutes = express.Router(),
        dnlRoutes = express.Router();
  // Set auth and game routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/dnl', dnlRoutes);
  apiRoutes.use('/cms', cmsRoutes);
  // Set a common fallback for /api/*; 404 for invalid route
  apiRoutes.all('*', ErrorController.error);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */

  // Register a user
  if (config.util.getEnv('NODE_ENV') !== 'production') {
    authRoutes.post('/register', AuthenticationController.register);
  }

  // Login a user
  authRoutes.post('/login', requireLogin, AuthenticationController.login);


  // Request a new token
  authRoutes.get('/token', requireAuth, AuthenticationController.token);


  // Request to update password
  authRoutes.post('/updatepassword', requireAuth, AuthenticationController.updatepassword);


  /*
   |--------------------------------------------------------------------------
   | CMS routes
   |--------------------------------------------------------------------------
  */

  // Get content
  cmsRoutes.get('/:contentId', CMSController.getContent);


  // Patch content
  cmsRoutes.patch('/:contentId', requireAuth, CMSController.patchContent);


  // Create content
  cmsRoutes.post('/', requireAuth, CMSController.createContent);


  // Get content structure
  cmsRoutes.get('/', CMSController.getContentStructure);

  /*
   |--------------------------------------------------------------------------
   | DNL routes
   |--------------------------------------------------------------------------
  */


  dnlRoutes.get('/query', DNLController.getServerData);

  app.use('/api', apiRoutes);
};

'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke ProblemWall Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['prowall'],
    allows: [{
      resources: '/api/problemWall',
      permissions: '*'
    }, {
      resources: '/api/problemWall/:problemWallId',
      permissions: '*'
    }, {
      resources: '/api/problemWallRec',
      permissions: '*'
    }, {
      resources: '/api/problemWallRec/:problemWallRecId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If ProblemWall Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
  /*
   var roles = (req.user) ? req.user.roles : ['guest'];

   // Check for user roles
   acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
   if (err) {
   // An authorization error occurred
   return res.status(500).send('Unexpected authorization error');
   } else {
   if (isAllowed) {
   // Access granted! Invoke next middleware
   return next();
   } else {
   return res.status(403).json({
   message: 'User is not authorized'
   });
   }
   }
   });*/
};
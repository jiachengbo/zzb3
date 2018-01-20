(function (app) {
  'use strict';

  app.registerModule('core');
  app.registerModule('core.services');
  //首先加载global路由
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
}(ApplicationConfiguration));

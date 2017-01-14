import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createHistory, useBasename } from 'history';

import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from '../../router/routes.js';
import MainLayout from '../../ui/containers/MainLayout.jsx';

const rootRoute = {
  component: MainLayout,
  childRoutes: routes,
};

Meteor.startup(() => {
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('link');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.hrep = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  head.appendChild(style);

  injectTapEventPlugin();

  ReactDOM.render(
    <Router history={browserHistory} routes={rootRoute} />,
    document.getElementById('app')
  );
});

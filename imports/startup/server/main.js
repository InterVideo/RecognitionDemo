import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

console.log("Starting server...");

import '../../api/api';
import './video-uploading-rules';


Meteor.startup(() => {
    Meteor.call('counters.initialize', 'videos');
    WebApp.rawConnectHandlers.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return next();
    });
});

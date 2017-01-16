import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

console.log("Starting server...");

import '../../api/api';
import './video-uploading-rules';


Meteor.startup(() => {
    WebApp.rawConnectHandlers.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        return next();
    });

    WebApp.connectHandlers.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        return next();
    });

    Meteor.call('counters.initialize', 'videos');
});

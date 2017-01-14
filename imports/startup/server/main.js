import { Meteor } from 'meteor/meteor';

console.log("Starting server...");

import '../../api/api';
import './video-uploading-rules';


Meteor.startup(() => {
    Meteor.call('counters.initialize', 'videos');
});

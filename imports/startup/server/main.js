import { Meteor } from 'meteor/meteor';

console.log("Starting server...");

import '../../api/api';
import './video-uploading-rules';

Meteor.call('counters.initialize', 'videos');

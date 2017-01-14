import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Videos = new Mongo.Collection('videos');
export const Counters = new Mongo.Collection('counters');

const getNextSequence = name => Counters.applyAndModify({
    query: { _id: name },
    update: { $inc: { seq: 1 } },
    new: true
}).seq;

Meteor.methods({
    'counters.initialize'(name) {
        check(name, String);
        counter = Counters.findOne(name);

        if (counter) {
            console.log('COUNTER EXISTS!!!');
            Counters.update(name, {
                $set: { seq: 0 }
            });
        } else {
            console.log('CREATING NEW COUNTER!!!');
            Counters.insert({
                _id: name,
                seq: 0
            });
        }
    },

    'videos.insert'(name, recognitionObjectPoints=[], recognitionObjectClass='__background__') {
        check(name, String);
        check(recognitionObjectPoints, Array);
        check(recognitionObjectClass, String);

        Videos.insert({
            id: getNextSequence('videos'),
            name,
            recognitionObjectPoints, recognitionObjectClass,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },

    'videos.updateRecognition'(id, recognitionObjectPoints, recognitionObjectClass) {
        check(id, String);
        check(recognitionObjectPoints, Array);
        check(recognitionObjectClass, String);

        Videos.update(id, {
            $set: {
                recognitionObjectClass,
                recognitionObjectPoints
            }
        });
    },

    'videos.remove'(id) {
        check(id, String);
        Videos.remove(id);
    }
});


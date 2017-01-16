import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Videos = new Mongo.Collection('videos');
export const Counters = new Mongo.Collection('counters');


// if (Meteor.isServer) {
//     Meteor.publish('videos', () => Videos.find({}));
// }


const getNextSequence = name => {
    Counters.update(name, {
        $inc: { seq: 1 }
    }, {
        upsert: true
    });

    return Counters.find({"_id": name}).fetch()[0].seq;
};

Meteor.methods({
    'counters.initialize'(name) {
        check(name, String);
        counter = Counters.findOne(name);

        if (counter) {
            Counters.update(name, {
                $set: { seq: 0 }
            });
        } else {
            Counters.insert({
                _id: name,
                seq: 0
            });
        }
    },

    'videos.insert'(name, url, preview, recognitionObjectPoints=[], recognitionObjectClass='__background__') {
        check(name, String);
        check(url, String);
        check(preview, String);
        check(recognitionObjectPoints, Array);
        check(recognitionObjectClass, String);

        Videos.insert({
            id: getNextSequence('videos'),
            name,
            url,
            recognitionObjectPoints, recognitionObjectClass,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },

    'videos.updateRecognition'(id, recognitionObjectPoints, recognitionObjectClass) {
        check(id, Number);
        check(recognitionObjectPoints, Array);
        check(recognitionObjectClass, String);

        Videos.update({id: parseInt(id)}, {
            $set: {
                recognitionObjectClass,
                recognitionObjectPoints,
                updatedAt: new Date()
            }
        });
    },

    'videos.remove'(id) {
        check(id, Number);
        Videos.remove({id: parseInt(id)});
    }
});


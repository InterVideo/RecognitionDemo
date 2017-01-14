import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.createDirective("uploadToS3", Slingshot.S3Storage, {
    bucket: Meteor.settings.private.AWSBucket,
    acl: "public-read",
    maxSize: 100 * 1024 * 1024 * 1024,
    allowedFileTypes: ["video/mp4"],
    authorize: () => {
        if (!this.userId) {
            const message = "Please, login before uploading files";
            throw new Meteor.Error("Login Required", message);
        }
    },
    key: (file, metaContext) => {
        const user = Meteor.users.findOne(this.userId);
        return user.username + '/' + file.name;
    }
})

import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';


Slingshot.fileRestrictions("uploadToS3", {
    maxSize: null,
    allowedFileTypes: ["video/mp4"]
});

Slingshot.createDirective("uploadToS3", Slingshot.S3Storage, {
    bucket: Meteor.settings.AWSBucket,
    region: "us-west-2",
    AWSAccessKeyId: Meteor.settings.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.AWSSecretAccessKey,
    acl: "public-read",
    authorize: () => {
        // if (!this.userId) {
        //     const message = "Please, login before uploading files";
        //     throw new Meteor.Error("Login Required", message);
        // }
        return true;
    },
    key: (file, metaContext) => {
        // const user = Meteor.users.findOne(this.userId);
        // return `${user.username}/${file.name}`;
        return `testing/${file.name}`;
    }
});

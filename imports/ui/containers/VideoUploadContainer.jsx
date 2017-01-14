import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Tracker } from 'meteor/tracker';


class VideoUploadContainer extends Component {
    constructor(props, context) {
        super(props, context);
    }

    onDrop(quality, files) {
        console.log(quality);
        console.log(files);

        const uploader = new Slingshot.Upload("uploadToS3");

        console.log(uploader);

        const error = uploader.validate(files[0]);

        if (error) {
            console.error(error);
        }

        uploader.send(files[0], (error, url) => {
            computation.stop();

            if (error) {
                this.setState({
                    ...this.state,
                    progress: 0
                });
                console.error('Error uploading', uploader.xhr.response);
                Materialize.toast(uploader.xhr.response, 4000);
            } else {
                this.setState({
                    ...this.state,
                    url
                });
                // Meteor.users update Meteor.userId()....
            }
        });

        const computation = Tracker.autorun(() => {
            if (!isNaN(uploader.progress())) {
                this.setState({
                    ...this.state,
                    progress: uploader.progress() * 100
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={::this.onDrop}>
                    <div>Drop your video here or click to select files to upload.</div>
                </Dropzone>
            </div>
        );
    }
}

export default createContainer(() => ({}), VideoUploadContainer);

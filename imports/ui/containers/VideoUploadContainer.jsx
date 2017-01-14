import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Dropzone from 'react-dropzone';
import LinearProgress from 'material-ui/LinearProgress';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Tracker } from 'meteor/tracker';


class VideoUploadContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            progress: 0,
            url: '',
            isUploading: false
        };
    }

    componentWillMount() {
        Slingshot.fileRestrictions("uploadToS3", {
            maxSize: null,
            allowedFileTypes: ["video/mp4"]
        });
    }

    onDrop(files) {
        console.log(files);

        let uploader = new Slingshot.Upload("uploadToS3");

        const error = uploader.validate(files[0]);

        if (error) {
            console.log('ERROR HEPPENED IN onDrop()');
            console.error(error);
        }

        this.setState({
            ...this.state,
            isUploading: true
        });

        uploader.send(files[0], (error, url) => {
            computation.stop();

            if (error) {
                console.log('ERROR HEPPENED IN uploader.send()');
                this.setState({
                    ...this.state,
                    progress: 0,
                    isUploading: false
                });
                console.error('Error uploading', uploader.xhr.response);
                Materialize.toast(uploader.xhr.response, 4000);
            } else {
                this.setState({
                    ...this.state,
                    url,
                    isUploading: false
                });
                // Meteor.users update Meteor.userId()....
            }
        });

        let computation = Tracker.autorun(() => {
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
            <div className='container'>
                <h4>Upload a video</h4>
                <br/>
                <Dropzone onDrop={::this.onDrop}>
                    <div>Drop your video here or click to select files to upload.</div>
                </Dropzone>
                <br/>
                {
                    this.state.isUploading
                    ? <LinearProgress mode='determinate' value={this.state.progress} />
                    : ''
                }
            </div>
        );
    }
}

export default createContainer(() => ({}), withRouter(VideoUploadContainer));

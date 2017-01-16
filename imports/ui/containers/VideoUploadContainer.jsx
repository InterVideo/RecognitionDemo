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
            videoName: '',
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
            isUploading: true,
            videoName: files[0].name.replace(/\..+$/, '')
        });

        uploader.send(files[0], (error, url) => {
            computation.stop();

            if (error) {
                this.setState({
                    ...this.state,
                    progress: 0,
                    isUploading: false
                });
                Materialize.toast(uploader.xhr.response, 4000);
            } else {
                this.setState({
                    ...this.state,
                    url,
                    isUploading: false
                });
                const preview = this.getVideoPreview(this.state.url);
                console.log('PREVIEW:');
                console.log(preview);
                Materialize.toast('Uploading complete!', 4000);
                Meteor.call('videos.insert', this.state.videoName, this.state.url, preview);
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

    getVideoPreview(url) {
        const video = document.createElement('video');
        video.src = url;
        video.currentSrc = url;
        video.crossOrigin = 'anonymous';
        video.width = 640;
        video.height = 480;
        video.currentTime = 3;

        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 1.0); 
    }

    render() {
        return (
            <div className='container'>
                <div className="row">
                    <div className="col s12" style={{textAlign: 'center'}}>
                        <h4>Upload a video</h4>
                        <br/>
                        <Dropzone
                            onDrop={::this.onDrop}
                            className="dropzone"
                            activeClassName="active-dropzone">
                            <div className="container">
                                <div
                                    className="card-panel waves-effect waves-block waves-green pt0 hovicon"
                                    id="zdrop">
                                    Drop your video here or click to select files to upload.
                                </div>
                                <div className="collection" id="previews">
                                    <div
                                        className="collection-item clearhack valign-wrapper item-template"
                                        id="zdrop-template">
                                        <div className="left pv zdrop-info" data-dz-thumbnail="">
                                            <div>
                                                <span data-dz-name=""></span>
                                                <span data-dz-size=""></span>
                                            </div>
                                        </div>
                                        <div className="secondary-content actions col s12">
                                            <a
                                                style={{marginRight: '35px'}}
                                                className="btn waves-effect waves-light start">
                                                Upload
                                            </a>
                                            <a
                                                style={{marginLeft: '35px'}}
                                                className="btn ph red white-text waves-effect waves-light">
                                                <i className="material-icons">close</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dropzone>
                        <br/>
                        {
                            this.state.isUploading
                            ? (
                                <div className="row">
                                    <LinearProgress mode='determinate' value={this.state.progress} />
                                    <span>{` ${this.state.progress.toFixed(2)}%`}</span>
                                </div>
                            ) : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default createContainer(() => ({}), withRouter(VideoUploadContainer));

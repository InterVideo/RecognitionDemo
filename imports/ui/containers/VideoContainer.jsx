import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import axios from 'axios';

import { Videos, Actions } from '../../api/api';
import { AWSRemoteAddress, AWSLapis } from '../../startup/both/config';
import CanvasVideo from '../components/CanvasVideo';


class VideoContainer extends Component {

    constructor(props, context) {
        super(props, context);

        this.axios = axios.create({
            baseURL: AWSRemoteAddress,
            timeout: 150000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

        this.axiosLapis = axios.create({
            baseURL: AWSLapis,
            timeout: 150000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

        this.state = {
            recognitionInProgress: false,
            recognitionCorrect: false,
            mouseX: 0,
            mouseY: 0,
            detectionResult: ''
        }
    }

    componentDidMount() {
        if (!this.validateIdParam(this.props.params.id)) {
            // this.props.router.goBack();
            this.props.router.push('/');
        }
    }

    startRecognitionProcess(e) {
        console.log('Starting recognition process...');
        e.persist();


        this.setState({
            ...this.state,
            recognitionInProgress: true,
            mouseX: e.X,
            mouseY: e.Y
        });

        const canvas = this.refs.video.getCanvas();
        const image = canvas.toDataURL();

        this.axios.post('/detect', {
            image: image.substr('data:image/png;base64,'.length)
        })
        .then(({data}) => {
            const mousePoint = this.getCanvasMouseCoordinates(e, canvas);
            const mouseX = mousePoint.x;
            const mouseY = mousePoint.y;

            if (data.detections) {
                let detectionsOnMouseLocation = [];

                for (let { x, y, width, height, prediction, score } of data.detections) {
                    const boundingBox = [x, y, width, height];
                    // if (this.checkIfPointInBoundingBox(mouseX, mouseY, boundingBox)) {
                        detectionsOnMouseLocation.push({ x, y, width, height, prediction, score });
                    // }
                }

                let neededDetection = detectionsOnMouseLocation[0];

                for (let detection of detectionsOnMouseLocation) {
                    if (detection.prediction === this.props.video.recognitionObjectClass) {
                        neededDetection = detection;
                        break;
                    }
                }

                console.log('Checking detection...', neededDetection);

                if (neededDetection) {
                    const croppedDetectionImage =
                        this.getCroppedCanvasScreenshot(
                            neededDetection.x, neededDetection.y,
                            neededDetection.width, neededDetection.height,
                        ).substr('data:image/png;base64,'.length);

                    console.log('Starting to predict...');

                    const wait = ms => {
                        const start = new Date().getTime();
                        let end = start;
                        while (end < start + ms) {
                            end = new Date().getTime();
                        }
                    }

                    // wait(5000);


                    // // SIFT/ResNet switch
                    // return this.axiosLapis.post('/run-svm', {
                    //     image: croppedDetectionImage
                    // })
                    // .then(data => {
                    //     console.log(data);
                    // })
                    // .catch(console.log);




                    return this.axios.post('/predict', {
                        image: croppedDetectionImage
                    })
                    .then(({data}) => {
                        if (data.error) {
                            Materialize.toast(data.error, 4000);
                        } else {
                            console.log('SVM RESULTS ARRIVED:');
                            console.log(data);

                            this.setState({
                                ...this.state,
                                detectionResult: neededDetection.prediction,
                                recognitionInProgress: false,
                                recognitionCorrect: data.result[0] === 1 ? true : false
                            });

                            // TODO fire action (switch this.props.action);
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        this.setState({
                            ...this.state,
                            recognitionInProgress: false
                        });
                        Materialize.toast('There was a comparison error', 4000);
                    });
                } else {
                    this.setState({
                        ...this.state,
                        recognitionInProgress: false
                    });
                    Materialize.toast('There was a detection error', 4000);
                }
            }
        })
        .catch(e => {
            console.log(e)
            Materialize.toast('Recognition error.', e.reason);
            this.setState({
                ...this.state,
                recognitionInProgress: false,
                recognitionCorrect: false
            });
        });
    }

    checkIfPointInBoundingBox(x, y, boundingBox) {
        const [bLeftX, bTopY, bWidth, bHeight] = boundingBox;
        const bRightX = bLeftX + bWidth;
        const bBottomY = bTopY + bHeight;

        return bLeftX <= x && x <= bRightX && bTopY <= y && y <= bBottomY;
    }

    getCanvasMouseCoordinates(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }

    getCroppedCanvasScreenshot(x, y, width, height) {
        const canvas = this.refs.video.getCanvas();
        const context = canvas.getContext('2d');

        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        const image = document.createElement('img');
        image.src = canvas.toDataURL();

        tempCanvas.width = Math.abs(width);
        tempCanvas.height = Math.abs(height);
        tempContext.drawImage(
            image,
            x, y,
            width, height,
            0, 0, width, height
        );
        return tempCanvas.toDataURL();
    }

    validateIdParam(id) {
        const n = Math.floor(Number(id));
        return String(n) === id && n >= 0;
    }

    openOptionsModal() {
        $('.modal').openModal();
    }

    closeOptionsModal() {
        $('.modal').closeModal();
    }

    onPlayBtnClick(e) {
        const { video } = this.refs;

        if (video && typeof video.play === 'function') {
            video.play();
        }
    }

    onPauseBtnClick(e) {
        const { video } = this.refs;

        if (video && typeof video.pause === 'function') {
            video.pause();
        }
    }

    renderLoader() {
        return (
            <div className="preloader-wrapper big active" style={{margin: '20% 10% 0% 25%'}}>
                <div className="spinner-layer spinner-blue">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>

                <div className="spinner-layer spinner-red">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>

                <div className="spinner-layer spinner-yellow">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>

                <div className="spinner-layer spinner-green">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>
            </div>
        );
    }

    render() {

        const videoSrc = {
            // src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            src: this.props.video.url,
            type: 'video/mp4'
        };

        const formattedName = this.props.video.name
            .toLowerCase()
            .split('_')
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(' ');

        return (
            <div className="canvas-video-editor row" style={{paddingLeft: '50px'}}>
                <div className="col s6">
                    <div className="canvas-wrapper" style={{position: 'relative'}}>
                        <CanvasVideo
                            onClick={::this.startRecognitionProcess}
                            autoPlay={true}
                            height={480}
                            width={640}
                            loop={true}
                            muted={false}
                            ref='video'
                            src={videoSrc}
                            style={{position: 'absolute', top: 0, left: 0, zIndex: 0}}
                        />
                    </div>
                    <button
                        style={{margin: '0 5%'}}
                        className='waves-effect waves-light btn'
                        onClick={::this.onPlayBtnClick}>
                        Play
                    </button>
                    <button
                        style={{margin: '0 5%'}}
                        className='waves-effect waves-light btn'
                        onClick={::this.onPauseBtnClick}>
                        Pause
                    </button>
                    <button
                        data-target="modal-options"
                        style={{margin: '0 5%'}}
                        className='waves-effect waves-light btn'
                        onClick={::this.openOptionsModal}>
                        Options
                    </button>

                    <div id="modal-options" className="modal bottom-sheet">
                        <div className="modal-content">
                            <h4>Video Options</h4>
                            <div className="row">
                                <div className="col c6">
                                    <button
                                        style={{margin: '0 10px'}}
                                        className="waves-effect waves-light btn">
                                        Update
                                    </button>
                                    <Link to={`/edit-video/${this.props.video.id}`}>
                                        <button
                                            onClick={::this.closeOptionsModal}
                                            style={{margin: '0 10px'}}
                                            className="waves-effect waves-light btn">
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        style={{margin: '0 10px'}}
                                        className="waves-effect waves-light btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a
                                onClick={::this.closeOptionsModal}
                                className="modal-action modal-close waves-effect waves-green btn-flat">
                                Close
                            </a>
                        </div>
                    </div>

                </div>
                {
                    !this.state.recognitionInProgress
                    ? (<div className="col s6" style={{paddingLeft: '5%'}}>
                        <h2>{formattedName}</h2>
                        <h3>Recognition Results</h3>
                        <p className="flow-text">
                            Detection class: {this.state.detectionResult}
                        </p>
                        <p className="flow-text">
                            Comparison result: {
                                this.state.recognitionCorrect ? 'Success!' : ''
                            }
                        </p>
                    </div>)
                    : (::this.renderLoader())
                }
            </div>
        );
    }
}

export default withRouter(VideoContainer);

// export default createContainer(({params}) => ({
//     video: Videos.findOne({id: parseInt(params.id)})
// }), withRouter(VideoContainer));


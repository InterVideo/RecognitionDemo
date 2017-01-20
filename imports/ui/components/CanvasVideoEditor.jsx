import React, { Component } from 'react';
import axios from 'axios';
import { Meteor } from 'meteor/meteor';

import { AWSRemoteAddress } from '../../startup/both/config';
import CanvasVideo from './CanvasVideo';


class CanvasVideoEditor extends Component {

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

        this.onRecognitionActions = [
            'popup', 'modal', 'redirect'
        ];

        this.state = {
            currentClass: '__background__',
            dragSelection: false,
            currentRecognitionAction: 'popup',
            detections: null,
            processingVideo: false
        };
    }

    componentDidMount() {
        const canvas = this.refs.topCanvas;

        canvas.addEventListener('mousedown', ::this.mouseDown, false);
        canvas.addEventListener('mouseup', ::this.mouseUp, false);
        canvas.addEventListener('mousemove', ::this.mouseMove, false);
    }

    getCroppedCanvasScreenshot() {
        const canvas = this.refs.video.getCanvas();
        const context = canvas.getContext('2d');

        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        const image = document.createElement('img');
        image.src = canvas.toDataURL();

        tempCanvas.width = Math.abs(this.state.rectW);
        tempCanvas.height = Math.abs(this.state.rectH);
        tempContext.drawImage(
            image,
            this.state.rectStartX, this.state.rectStartY,
            this.state.rectW, this.state.rectH,
            0, 0, this.state.rectW, this.state.rectH
        );
        return tempCanvas.toDataURL('image/jpeg', 1.0);
    }

    mouseDown(e) {
        this.setState({
            ...this.state,
            dragSelection: true,
            rectStartX: e.pageX - this.refs.topCanvas.offsetLeft - 70,
            rectStartY: e.pageY - this.refs.topCanvas.offsetTop - 70
        });
    }

    mouseUp() {
        this.setState({
            ...this.state,
            dragSelection: false
        });
        console.log(
            this.state.rectStartX, this.state.rectStartY,
            this.state.rectW, this.state.rectH
        );
    }

    mouseMove(e) {
        const ctx = this.refs.topCanvas.getContext('2d');

        if (this.state.dragSelection) {
            ctx.clearRect(0, 0, 640, 480);
            this.setState({
                ...this.state,
                rectW: e.pageX - this.refs.topCanvas.offsetLeft - this.state.rectStartX,
                rectH: e.pageY - this.refs.topCanvas.offsetTop - this.state.rectStartY
            });
            ctx.strokeStyle = 'red';
            const { rectStartX, rectStartY, rectW, rectH } = this.state;
            ctx.lineWidth = 5;
            ctx.strokeRect(rectStartX, rectStartY, rectW, rectH);
        }
    }

    saveRecognitionAction() {

        const actionFields = $(this.refs.actionFormData).serializeArray();

        const allFull = actionFields.some(
            action => action.hasOwnProperty('value') && action.value
        );

        if (!allFull) {
            Materialize.toast('Please, fill in all the fields', 4000);
            return;
        } else {

            if (this.state.detections) {

                this.axios('/train-svm', {
                    // TODO
                    // detections: []
                    // image: base64 str
                    // positive_crop: base64 str
                    // use_dense_sift: true,
                    // clustering: 'kmeans'
                })
                .then(data => {
                    if (data.error) {
                        Materialize.toast('Error occured on a detection server');
                        throw new Meteor.Error('/train-svm returned error object');
                    } else {
                        this.setState({
                            ...this.state,
                            processingVideo: false
                        });

                        Meteor.call(
                            'actions.saveAction',
                            parseInt(this.props.video.id),
                            this.state.currentRecognitionAction,
                            actionFields
                        );
                    }
                })
                .catch(e => Materialize.toast(`Error occured while training SVM: ${e.message}`, 4000))
            } else {
                Materialize('Choose a detection object, please!', 4000);
                return;
            }
        }
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

    renderClassListItems() {
        return this.props.classes.map((item, index) =>
            <li key={index}><a>{item}</a></li>
        );
    }

    handleDropDownClick(e) {
        this.setState({
            ...this.state,
            currentClass: e.target.innerHTML
        });
    }

    handleSelectionDetection() {
        console.log('Start detection process');
        this.axios.post('/detect', {
            image: this.getCroppedCanvasScreenshot().substr('data:image/jpeg;base64,'.length)
        }).then(({data}) => {
            if (data.detections) {
                for (let { x, y, width, height, prediction, score } of data.detections) {
                    Meteor.call(
                        'videos.updateRecognition',
                        this.props.video.id,
                        [x, y, width, height],
                        prediction
                    );
                }

                this.setState({
                    ...this.state,
                    currentClass: data.detections[0].prediction,
                    detections: data.detections[0]
                });
            }
        });
    }

    renderOnRecognitionItems() {
        return this.onRecognitionActions.map((item, index) =>
            <li key={index}><a>{item}</a></li>
        );
    }

    renderActionInputFields() {
        return (
            <div className="row">
                <form className="col s12" ref='actionFormData'>
                    {
                        this.state.currentRecognitionAction == 'popup'
                        ? (
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text" id="popup-text"/>
                                    <label htmlFor="popup-text">Popup Text</label>
                                </div>
                            </div>
                        ) : this.state.currentRecognitionAction == 'modal'
                        ? (
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text" id="modal-header"/>
                                    <label htmlFor="modal-header">Modal Header</label>
                                </div>
                                <div className="input-field col s12">
                                    <input type="text" id="modal-header"/>
                                    <label htmlFor="modal-header">Modal Header</label>
                                </div>
                            </div>
                        ) : this.state.currentRecognitionAction == 'redirect'
                        ? (
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text" id="redirect-url"/>
                                    <label htmlFor="redirect-url">Redirect URL</label>
                                </div>
                            </div>
                        ) : ''
                    }
                </form>
            </div>
        );
    }

    handleActionsDropDownClick(e) {
        this.setState({
            ...this.state,
            currentRecognitionAction: e.target.innerHTML
        });
    }

    render() {

        const videoSrc = {
            src: this.props.video.url,
            type: 'video/mp4'
        };

        const cursor = {
            cursor: this.state.dragSelection ? 'crosshair' : 'default'
        };

        return (
            <div className="canvas-video-editor row" style={{paddingLeft: '50px'}}>
                <div className="col s6">
                    <div className="canvas-wrapper" style={{position: 'relative'}}>
                        <CanvasVideo
                            autoPlay={true}
                            height={480}
                            width={640}
                            loop={true}
                            muted={false}
                            ref='video'
                            src={videoSrc}
                            style={{...cursor, position: 'absolute', top: 0, left: 0, zIndex: 0}}
                        />
                        <canvas
                            width={640}
                            height={480}
                            id="top-canvas"
                            ref="topCanvas"
                            style={{...cursor, position: 'absolute', top: 0, left: 0, zIndex: 1}}
                        />
                    </div>
                    <button
                        className="waves-effect waves-light btn"
                        style={{margin: '0 10%'}}
                        onClick={::this.onPlayBtnClick}>
                        Play
                    </button>
                    <button
                        className="waves-effect waves-light btn"
                        style={{margin: '0 10%'}}
                        onClick={::this.onPauseBtnClick}>
                        Pause
                    </button>
                </div>
                <div className="col s6" style={{paddingLeft: '10%'}}>
                    <h3>Recognition Setup</h3>
                    <p className="flow-text">Class: {this.state.currentClass}</p>
                    <a className="dropdown-button btn" data-activates="classes-dropdown">
                        Choose a class to track
                    </a>
                    <ul
                        id="classes-dropdown"
                        className="dropdown-content"
                        onClick={::this.handleDropDownClick}
                    >
                        {::this.renderClassListItems()}
                    </ul>
                    <br />
                    <br />
                    <button
                        onClick={::this.handleSelectionDetection}
                        className="waves-effect waves-light btn">
                        Run Detection
                    </button>
                    <br/>
                    <br/>
                    <div className="recognition-actions">
                        <h4>Choose onRecognition action</h4>
                        <ul
                            id="classes-dropdown"
                            className="dropdown-content"
                            onClick={::this.handleActionsDropDownClick}
                        >
                            {::this.renderOnRecognitionItems()}
                        </ul>
                    </div>
                    {::this.renderActionInputFields()}
                    <br/>
                    <button
                        onClick={::this.saveRecognitionAction}
                        className="waves-effect waves-light btn">
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default CanvasVideoEditor;

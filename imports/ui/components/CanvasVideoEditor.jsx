import React, { Component } from 'react';
import axios from 'axios';

import { AWSRemoteAddress } from '../../startup/both/config';
import CanvasVideo from './CanvasVideo';


class CanvasVideoEditor extends Component {

    constructor(props, context) {
        super(props, context);

        this.axios = axios.create({
            baseURL: AWSRemoteAddress,
            timeout: 100000
        });

        this.state = {
            currentClass: '__background__',
            dragSelection: false
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

        const data = context.getImageData(
            this.state.rectStartX, this.state.rectStartY,
            this.state.rectW, this.state.rectH
        );

        const compositeOperation = context.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#fff';
        context.fillRect(
            this.state.rectStartX, this.state.rectStartY,
            this.state.rectW, this.state.rectH
        );

        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        tempCanvas.width = this.state.rectW;
        tempCanvas.height = this.state.rectH;
        tempContext.drawImage(canvas, 0, 0);
        return tempCanvas.toDataURL('image/jpeg', 1.0);
    }

    mouseDown(e) {
        this.setState({
            ...this.state,
            dragSelection: true,
            rectStartX: e.pageX - this.refs.topCanvas.offsetLeft,
            rectStartY: e.pageY - this.refs.topCanvas.offsetTop
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
            ctx.strokeRect(rectStartX - 70, rectStartY - 70, rectW, rectH);
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

        console.log(this.getCroppedCanvasScreenshot());
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

    render() {

        const src = 'https://s3-us-west-2.amazonaws.com/intervideo-demo/testing/ted_talk.mp4?X-Amz-Date=20170116T002650Z&X-Amz-Expires=300&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=08ca9d102514e1e2c8ab9d76748b8d5f2e026df5efed0924dce67d3d14cee7ec&X-Amz-Credential=ASIAIYB73ETPEMZS3RVA/20170116/us-west-2/s3/aws4_request&X-Amz-SignedHeaders=Host&x-amz-security-token=FQoDYXdzEPn//////////wEaDNHDEaCNGDfZYidToSL6Aa%2BEJy/G2Lo/ZjMsmIgn5dZITsx3Ssw%2B06X1%2BER4meFmU7LfpJcgZwNPhr%2B6VL8sSqqA1mxuc6EYdeCvxDFNd6Nw2ECPLiYyCnU3g1KWghdTwBfARaXGbdMy9MrZLC8FJ8mL/MXpSmxh2bpiGFtlVqDjfolA4Hok8yBQnkGNDz/BaCfiGbZicMfKHYSAXiJajMWB6CuB35JouLTKRrhRy0yOJLiQnVDFLZ8Aa5TCzNmQP%2BXgW6PY4zwo0ayanUI1GutDAWu6Hh/dUcRqkT7xeOy3gAh21TJZxRlvb8am%2BBXxjo0xPvo2oMm5qF%2BHIC4QEX4nwd1MJFB5Jiwo5qHwwwU%3D';
        const videoSrc = {
            // src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            src,
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
                            muted={true}
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
                </div>
            </div>
        );
    }
}

export default CanvasVideoEditor;

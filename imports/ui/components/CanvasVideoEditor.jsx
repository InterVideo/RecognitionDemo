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
            ctx.strokeRect(rectStartX, rectStartY, rectW, rectH);
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

    render() {
        const videoSrc = {
            src: 'http://www.w3schools.com/html/mov_bbb.mp4',
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

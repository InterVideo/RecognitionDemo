import React, { Component } from 'react';

import CanvasVideo from './CanvasVideo';


class CanvasVideoEditor extends Component {

    constructor(props, context) {
        super(props, context);

        this.mouse = {
            x: 0, y: 0,
            startX: 0,
            startY: 0
        };

        this.state = {
            currentClass: '__background__'
        };
    }

    componentDidMount() {
        const { video } = this.refs;
        const canvas = video.getCanvas();

        this.initSelection(canvas);
    }

    setMousePosition(e) {
        this.mouse.x = e.pageX + window.pageXOffset;
        this.mouse.y = e.pageY + window.pageYOffset;
    }

    initSelection(canvas) {
        this.mouse = {
            x: 0, y: 0,
            startX: 0,
            startY: 0
        };

        let element = null;

        canvas.onmousemove = e => {
            this.setMousePosition(e);

            if (element !== null) {
                element.style.width = Math.abs(this.mouse.x - this.mouse.startX) + 'px';
                element.style.height = Math.abs(this.mouse.y - this.mouse.startY) + 'px';
                element.style.left = (this.mouse.x - this.mouse.startX < 0)
                    ? this.mouse.x + 'px'
                    : this.mouse.startX + 'px';
                element.style.top = (this.mouse.y - this.mouse.startY < 0)
                    ? this.mouse.y + 'px'
                    : this.mouse.startY + 'px';
            }
        }

        canvas.onclick = e => {
            if (element !== null) {
                element = null;
                canvas.style.cursor = 'default';
                console.log('finished.');
            } else {
                console.log('begun.');
                this.mouse.startX = this.mouse.x;
                this.mouse.startY = this.mouse.y;
                element = document.createElement('div');
                element.className = 'rectangle';
                element.style.left = this.mouse.x + 'px';
                element.style.top = this.mouse.y + 'px';
                canvas.appendChild(element);
                canvas.style.cursor = 'crosshair';
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
    
    render() {
        const videoSrc = {
            src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            type: 'video/mp4'
        };

        return (
            <div className="canvas-video-editor row" style={{paddingLeft: '50px'}}>
                <div className="col s6">
                    <CanvasVideo
                        autoPlay={true}
                        height={480}
                        width={640}
                        loop={true}
                        muted={true}
                        ref='video'
                        src={videoSrc}
                    />
                    <button onClick={::this.onPlayBtnClick}>Play</button>
                    <button onClick={::this.onPauseBtnClick}>Pause</button>
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

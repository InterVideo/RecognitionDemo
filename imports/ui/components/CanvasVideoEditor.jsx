import React, { Component } from 'react';

import CanvasVideo from './CanvasVideo';


class CanvasVideoEditor extends Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        console.log(this.refs.video);
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
    
    render() {
        const videoSrc = [{
            src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            type: 'video/mp4'
        }];

        return (
            <div className="canvas-video-editor">
                <CanvasVideo
                    autoPlay={false}
                    height={480}
                    width={640}
                    loop={false}
                    muted={true}
                    ref='video'
                    src={videoSrc}
                />
                <button onClick={::this.onPlayBtnClick}>Play</button>
                <button onClick={::this.onPauseBtnClick}>Pause</button>
            </div>
        );
    }
}

export default CanvasVideoEditor;

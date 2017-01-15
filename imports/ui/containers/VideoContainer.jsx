import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import { AWSRemoteAddress } from '../../startup/both/config';
import CanvasVideo from '../components/CanvasVideo';


class VideoContainer extends Component {

    constructor(props, context) {
        super(props, context);

        this.axios = axios.create({
            baseURL: AWSRemoteAddress,
            timeout: 100000
        });
    }

    componentDidMount() {
        if (!this.validateIdParam(this.props.params.id)) {
            // this.props.router.goBack();
            this.props.router.push('/');
        }
    }

    validateIdParam(id) {
        const n = Math.floor(Number(id));
        return String(n) === id && n >= 0;
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

        const videoSrc = {
            src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            type: 'video/mp4'
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
                            style={{position: 'absolute', top: 0, left: 0, zIndex: 0}}
                        />
                    </div>
                    <button onClick={::this.onPlayBtnClick}>Play</button>
                    <button onClick={::this.onPauseBtnClick}>Pause</button>
                </div>
                <div className="col s6" style={{paddingLeft: '10%'}}>
                    <h2>Video ID: </h2>
                    <h3>Recognition Results</h3>
                    <p className="flow-text">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Doloremque dolorum, consequuntur, ut excepturi eum est ullam
                        saepe quos impedit voluptates necessitatibus quisquam ratione
                        rerum quia cupiditate maiores sapiente distinctio nisi?
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(VideoContainer);

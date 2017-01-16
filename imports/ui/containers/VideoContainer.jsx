import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import axios from 'axios';

import { Videos } from '../../api/api';
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

    render() {

        console.log('PROOPS')
        console.log(this.props);

        const videoSrc = {
            // src: 'http://www.w3schools.com/html/mov_bbb.mp4',
            src: this.props.video.url,
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
                <div className="col s6" style={{paddingLeft: '5%'}}>
                    <h2>{this.props.video.name}</h2>
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

export default createContainer(({params}) => ({
    video: Videos.findOne({id: parseInt(params.id)})
}), withRouter(VideoContainer));


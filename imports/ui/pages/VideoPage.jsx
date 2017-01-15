import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

import VideoContainer from '../containers/VideoContainer';


class VideoPage extends Component {
    render() {

        const {
            params: { id },

        } = this.props;

        const style = {
            paddingTop: '15px'
        };

        return (
            <div style={style}>
                <VideoContainer {...this.props}/>
            </div>
        );
    }
}

export default withRouter(VideoPage);
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Videos, Actions } from '../../api/api';
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
                {
                    this.props.video
                    ? <VideoContainer {...this.props} />
                    : ''
                }
            </div>
        );
    }
}

export default createContainer(({params}) => ({
    video: Videos.findOne({id: parseInt(params.id)}),
    action: Actions.findOne({videoId: parseInt(params.id)})
}), withRouter(VideoPage));

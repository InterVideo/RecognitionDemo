import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

import VideoEditorContainer from '../containers/VideoEditorContainer';


class VideoEditor extends Component {
    render() {

        const {
            params: { id },

        } = this.props;

        const style = {
            // width: '140%'
        };

        return (
            <div style={style}>
                <VideoEditorContainer />
            </div>
        );
    }
}

export default withRouter(VideoEditor);

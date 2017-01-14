import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

import VideoEditorContainer from '../containers/VideoEditorContainer';


class VideoEditor extends Component {
    render() {

        const {
            params: { id },

        } = this.props;

        return (
            <div>
                <VideoEditorContainer />
            </div>
        );
    }
}

export default withRouter(VideoEditor);

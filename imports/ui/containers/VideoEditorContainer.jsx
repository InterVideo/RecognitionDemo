import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Videos } from '../../api/api';
import CanvasVideoEditor from '../components/CanvasVideoEditor';


class VideoEditorContainer extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            videoName: '',
            recognitionObjectClass: '__background__',
            recognitionObjectPoints: []
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <CanvasVideoEditor />
            </div>
        );
    }
}

export default VideoEditorContainer;

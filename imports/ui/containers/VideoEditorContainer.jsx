import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

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
        const style = {
            paddingTop: '15px'
        };

        const classes = [
            '__background__',
            'aeroplane', 'bicycle', 'bird', 'boat',
            'bottle', 'bus', 'car', 'cat', 'chair',
            'cow', 'diningtable', 'dog', 'horse',
            'motorbike', 'person', 'pottedplant',
            'sheep', 'sofa', 'train', 'tvmonitor'
        ];

        return (
            <div style={style}>
                <CanvasVideoEditor classes={classes} video={this.props.video}/>
            </div>
        );
    }
}

export default createContainer(({params}) => ({
    video: Videos.findOne({id: parseInt(params.id)})
}), withRouter(VideoEditorContainer));

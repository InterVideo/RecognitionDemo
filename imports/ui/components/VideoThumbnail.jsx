import React, { Component } from 'react';
import { Link } from 'react-router';
import {
    Card, CardActions, CardHeader, CardMedia, CardTitle, CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


export default class VideoThumbnail extends Component {
    render() {
        const {
            id, name, preview
        } = this.props;

        // console.log('THUMBNAIL', this.props);

        const formattedName = name
            .toLowerCase()
            .split('_')
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(' ');

        return (
            <Card>
                <Link to={`/videos/${id}`}>
                    <CardMedia
                        overlay={<CardTitle title={formattedName} />}
                    >
                        <img src="https://c3metrics.com/wp-content/uploads/2016/08/feature-video-thumbnail-overlay.png"/>
                    </CardMedia>
                </Link> 
            </Card>
        );
    }
}

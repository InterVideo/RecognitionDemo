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

        console.log('THUMBNAIL', this.props);

        return (
            <Card>
                <Link to={`/videos/${id}`}>
                    <CardMedia
                        overlay={<CardTitle title={name} />}
                    >
                        <img src={preview}/>
                    </CardMedia>
                </Link> 
            </Card>
        );
    }
}

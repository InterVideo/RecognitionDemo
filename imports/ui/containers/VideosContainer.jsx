import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Videos } from '../../api/api';
import VideoThumbnail from '../components/VideoThumbnail';


class VideosContainer extends Component {

    constructor(props, context) {
        super(props, context);

        this.itemsPerRow = 3;
    }

    renderVideosRow(videos, key) {
        const gridClass = parseInt(12 / this.itemsPerRow);
        return (
            <div className="row" key={key}>
                {videos.map((video, index) =>
                    <div className={`col s${gridClass}`} key={index}>
                        <VideoThumbnail {...video} />
                    </div>
                )}
            </div>
        );
    }

    renderVideos() {
        const { videos } = this.props;

        return videos
            .map((video, index) =>
                index % this.itemsPerRow === 0
                ? videos.slice(index, index + this.itemsPerRow)
                : null
            )
            .filter(video => video)
            .map((videosRow, index) => this.renderVideosRow(videosRow, index));
    }

    render() {
        return (
            <div>
                {this.props.videos ? ::this.renderVideos() : 'No videos yet... :('}
            </div>
        );
    }
}

export default createContainer(() => ({
    videos: Videos.find({}, { sort: { updatedAt: -1 } }).fetch()
}), VideosContainer);

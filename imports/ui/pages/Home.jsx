import React, { Component } from 'react';

import Search from '../components/Search';
import VideosContainer from '../containers/VideosContainer';


export default class Home extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {

    const video = {
      id: 127,
      title: 'My Awesome Video',
      image: 'http://www.w3schools.com/howto/img_fjords.jpg'
    }
    const videos = Array(16).fill(video);
    
    return (
      <div>
        <Search />
        <VideosContainer videos={videos} />
      </div>
    );
  }
}

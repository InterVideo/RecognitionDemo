import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';


class VideoEditor extends Component {
    render() {
        return (
            <div className="text-center">VideEditor Page {this.props.params.id}</div>
        );
    }
}

export default withRouter(VideoEditor);

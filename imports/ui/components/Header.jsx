import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';


export default class Header extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const navStyle = {
      backgroundColor: "#3f51b5",
      paddingLeft: "12px"
    };

    return (
      <nav style={navStyle}>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">InterVideo Recognition demo</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload</Link></li>
          </ul> 
        </div>
      </nav>
    );
  }
}

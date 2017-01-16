import React, { Component } from 'react';


export default class Search extends Component {
    render() {
        const style = {
          margin: '15px 0'
        };

        const darkGrey = {
          color: '#444'
        };

        const inputFieldStyle = {
          ...darkGrey,
          backgroundColor: '#fff',
          border: '0',
          boxShadow: 'none'
        };

        return (
          <nav style={style}>
            <div className="nav-wrapper">
              <form>
                <div className="input-field">
                  <input style={inputFieldStyle} type="search" id="search" required />
                  <label htmlFor="search">
                    <i className="material-icons" style={darkGrey}>search</i>
                  </label>
                  <i className="material-icons" style={darkGrey}>close</i>
                </div>
              </form>
            </div>
          </nav>
        );
    }
}

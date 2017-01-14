import React, { Component } from 'react';


export default class Search extends Component {
    render() {
        return (
          <form>
            <div className="input-field">
              <input type="search" id="search" required />
              <label htmlFor="search">
                <i className="material-icons">search</i>
              </label>
              <i className="material-icons">close</i>
            </div>
          </form>
        )
    }
}

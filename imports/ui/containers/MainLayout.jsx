import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/Header.jsx';


export default class MainLayout extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <main className="container">{this.props.children}</main>
        </div>
      </MuiThemeProvider>
    );
  }
}

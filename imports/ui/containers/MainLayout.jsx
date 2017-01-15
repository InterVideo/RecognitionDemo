import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import classNames from 'classnames';

import Header from '../components/Header.jsx';


const MainLayout = ({children}) => {
    let classname = classNames({
      container: children.props
                 && children.props.location
                 && !children.props.location.pathname.match('/edit-video')
                 && !children.props.location.pathname.match('/videos/')  
    });

    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <main className={classname}>
            {children}
          </main>
        </div>
      </MuiThemeProvider>
    );
}

export default MainLayout;

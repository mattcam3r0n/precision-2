import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import Amplify, { Auth, Hub } from 'aws-amplify';
import awsmobile from './aws-exports';
import { Authenticator, Greetings } from 'aws-amplify-react';

import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import DesignView from './components/DesignView';

//import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure(awsmobile);

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
  overrides: {
    root: {
      // MuiListItemIcon: {
      //   marginRight: 8,
      //   color: 'red'
      // }
    },
  },
});

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    marginTop: 64,
    padding: 0, // theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
});

const Home = () => <h1>Home</h1>;
const Login = () => <h1>Login</h1>;

class App extends React.Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', (data) => {
      const { payload } = data;
      this.onAuthEvent(payload);
    });
  }

  onAuthEvent(payload) {
    console.log('A new auth event has happened: ', payload.data.username + ' has ' + payload.event);
  }

  render() {
    const { classes } = this.props;

    //console.log('theme', theme);

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <div className={classes.root}>
          <Header />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/design" component={DesignView} />
          {/* 
          <PrivateRoute
            path="/about"
            user={user}
            component={About}
          /> 
          */}
        </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

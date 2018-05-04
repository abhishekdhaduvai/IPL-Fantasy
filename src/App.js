import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import axios from 'axios';

import About from './screens/About';
import Dashboard from './screens/Dashboard';
import Schedule from './screens/Schedule';

class App extends Component {

  state = {
    error: '',
    schedule: []
  }

  componentDidMount() {
    axios.get('/upcoming-matches')
    .then(res => {
      this.setState({
        schedule: res.data,
        error: ''
      });
    })
    .catch(err => {
      this.setState({ error: 'Error getting the schedule'});
      console.log(err);
    });
  }

  bet = (match, team) => {
    const { schedule } = this.state;
    this.setState(state => {
      return {
        ...state,
        schedule: schedule.map(game => {
          return game.matchId.id === match.matchId.id ? {
            ...game,
            bet: game.bet === team ? '' : team
          } : game
        })
      }
    });
  }

  render() {
    const { error, schedule } = this.state;
    return (
      <div style={styles.container}>
        <Switch>
          <Route exact path="/home" render={() => {
            return <Dashboard schedule={schedule} />
          }} />
          <Route exact path="/schedule" render={() => {
            return <Schedule schedule={schedule} bet={this.bet} />
          }} />
          <Route exact path="/about" component={About} />
          <Route path="/" render={() => {
            return <Redirect to="/home" />
          }}/>
        </Switch>
        {error.length > 0 &&
          <px-alert-message
            visible
            type='important'
            action='acknowledge'
            message-title='Error!'
            message={ error }
            auto-dismiss='0'>
          </px-alert-message>
        }
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
}

export default withRouter(App);

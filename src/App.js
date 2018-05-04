import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import axios from 'axios';

import About from './screens/About';
import Dashboard from './screens/Dashboard';
import Schedule from './screens/Schedule';

class App extends Component {

  state = {
    error: '',
    schedule: [],
    user: undefined
  }

  componentDidMount() {
    this.getUpcomingMatches();
    this.getUserInfo();
  }

  getUpcomingMatches = () => {
    axios.get('/upcoming-matches')
    .then(res => {
      this.setState({ schedule: res.data });
    })
    .catch(err => {
      this.setState({ error: 'Error getting the schedule'});
      console.log(err);
    });
  }

  getUserInfo = () => {
    axios.get('/me')
    .then(res => {
      this.setState({ user: res.data });
    })
    .catch(err => {
      this.setState({error: 'Error getting your info'});
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
    axios.post('/bet', {
      match: match.matchId.id,
      bet: team
    })
    .then(res => {
      this.getUserInfo();
    })
    .catch(err => {
      console.log('err ', err);
      this.setState({ error: err.message});
    })
  }

  render() {
    const { error, schedule, user } = this.state;
    return (
      <div style={styles.container}>
        <Switch>
          <Route exact path="/home" render={() => {
            return <Dashboard schedule={schedule} />
          }} />
          {user !== undefined &&
            <Route exact path="/schedule" render={() => {
              return <Schedule schedule={schedule} bet={this.bet} user={user} />
            }} />
          }
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

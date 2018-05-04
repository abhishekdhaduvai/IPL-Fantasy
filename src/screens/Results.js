import React from 'react';
import axios from 'axios';

import BrandingBand from '../web-components/BrandingBand';
import ResultMatchCard from '../web-components/ResultMatchCard';

class Results extends React.Component {

  state = {
    matches: [],
    user: undefined,
  }

  componentDidMount() {
    this.getMatches();
    this.getUser();
  }

  getMatches = () => {
    axios.get('/finished-matches')
    .then(res => {
      this.setState({ matches: res.data });
    })
    .catch(err => {
      console.log('err ', err);
    });
  }

  getUser = () => {
    axios.get('/me')
    .then(res => {
      this.setState({ user: res.data });
    })
    .catch(err => {
      console.log('err ', err);
    })
  }

  render(){
    const { matches, user } = this.state;
    console.log(this.state);
    return (
      <div style={styles.container}>
        <BrandingBand />
        {user !== undefined && matches.map(match => (
          <ResultMatchCard
            key={match.matchId.id}
            match={match}
            user={user}
          />
        ))}
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    background: 'white',
  }
}

export default Results;
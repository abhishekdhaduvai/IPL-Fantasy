import React from 'react';

class MatchCard extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className='match-card'>
        <div
          className={match.bet === 'team1' ? 'bet homeTeam': 'homeTeam'}
          onClick={e => this.props.bet(match, 'team1')}>
          <div className='team1'>{match.team1.team.fullName}</div>
          <div className={'logo '+match.team1.team.abbreviation} />
        </div>
        <div className='vs'>v</div>
        <div
          className={match.bet === 'team2' ? 'bet awayTeam': 'awayTeam'}
          onClick={e => this.props.bet(match, 'team2')}>
          <div className={'logo '+match.team2.team.abbreviation} />
          <div className='team2'>{match.team2.team.fullName}</div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {

  },
}

export default MatchCard;
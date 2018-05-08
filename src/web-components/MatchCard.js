import React from 'react';
import moment from 'moment';
import 'countdown';
import 'moment-countdown';

class MatchCard extends React.Component {
  render() {
    const { match, user } = this.props;
    return (
      <div className='match-card'>
        {match.timeUTC - Date.now() > 0 &&
          <div className='card-left'>
            <div className='row1'>Selection for this match will close in</div>
            <div className='row2'>
              <strong>{moment(match.timeUTC - 60*60*1000).countdown().toString().split('and')[0].trim()}</strong>
            </div>
          </div>
        }
        <div
          className={
            user.bets[match.matchId.id] !== undefined ?
              user.bets[match.matchId.id].team === 'team1' ? 'bet homeTeam': 'homeTeam'
            : 'homeTeam'
          }
          onClick={e => this.props.bet(match, 'team1')}>
          <div className='team1'>{match.team1.team.fullName}</div>
          <div className={'logo '+match.team1.team.abbreviation} />
        </div>
        <div className='vs'>v</div>
        <div
          className={
            user.bets[match.matchId.id] !== undefined ?
              user.bets[match.matchId.id].team === 'team2' ? 'bet awayTeam': 'awayTeam'
            : 'awayTeam'
          }
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
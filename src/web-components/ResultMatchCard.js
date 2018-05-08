import React from 'react';
import moment from 'moment';
import 'countdown';
import 'moment-countdown';

class ResultMatchCard extends React.Component {

  render() {
    const { match, user } = this.props;
    return (
      <div className='match-card'>

        <div className='card-left'>
          <div className='.row1'><strong>{match.matchStatus.text}</strong></div>
          <div className='row2'>
            {
              user.bets[match.matchId.id] === undefined ?
              <span>You did not bet on this match</span> :
              user.bets[match.matchId.id].team === 'team1' ?
              <span>You bet on <strong>{match.team1.team.shortName}</strong></span> :
              <span>You bet on <strong>{match.team2.team.shortName}</strong></span>
            }
          </div>
        </div>

        {user.bets[match.matchId.id] !== undefined &&
          <div className='card-right'>
            <div>Points</div>
            <div className={'points '+user.bets[match.matchId.id].result}>
              {user.bets[match.matchId.id].result === 'win' ? <span>+5</span> : -3}
            </div>
          </div>
        }

        <div
          className={
            user.bets[match.matchId.id] ?
            (user.bets[match.matchId.id].team === 'team1' ? 'team '+user.bets[match.matchId.id].result : 'team'):
            'team'
          }>
          <div className='team1'>{match.team1.team.fullName}</div>
          <div className={'logo '+match.team1.team.abbreviation} />
        </div>
        <div className='vs'>v</div>
        <div
          className={
            user.bets[match.matchId.id] ?
            (user.bets[match.matchId.id].team === 'team2' ? 'team '+user.bets[match.matchId.id].result : 'team'):
            'team'
          }>
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

export default ResultMatchCard;
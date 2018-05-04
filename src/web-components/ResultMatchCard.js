import React from 'react';
import moment from 'moment';
import 'countdown';
import 'moment-countdown';

class ResultMatchCard extends React.Component {

  result = (match, user) => {
    if(user.bets[match.matchId.id] === 'team1') {
      if(match.matchStatus.outcome === 'A'){
        return {
          message: `You bet on ${match.team1.team.shortName}`,
          team1: 'win team'
        };
      }
      else {
        return {
          message: `You bet on ${match.team1.team.shortName}`,
          team1: 'lose team'
        };
        return 'lose team';
      }
    }
    return 'team';
  }

  render() {
    const { match, user } = this.props;
    console.log(user.bets[match.matchId.id]);
    return (
      <div className='match-card'>

        <div className='card-left'>
          <div className='.row1'><strong>{match.matchStatus.text}</strong></div>
          <div className='row2'>
            You bet on <strong>{user.bets[match.matchId.id] === 'team1' ? match.team1.team.shortName : match.team2.team.shortName}</strong>
          </div>
        </div>

        {user.bets[match.matchId.id] !== undefined &&
          <div className='card-right'>
            <div>Points</div>
            <div className={'points '+user.bets[match.matchId.id].result}>
              {user.bets[match.matchId.id].result === 'win' ? <span>+3</span> : -3}
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
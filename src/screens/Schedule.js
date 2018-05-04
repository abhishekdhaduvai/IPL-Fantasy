import React from 'react';
import BrandingBand from '../web-components/BrandingBand';
import MatchCard from '../web-components/MatchCard';

class About extends React.Component {

  render(){
    console.log(this.props);
    const { schedule, logos } = this.props;
    return (
      <div style={styles.container}>
        <BrandingBand screen='Schedule' />
        {
          this.props.schedule.map(match => (
            <MatchCard
              key={match.matchId.id}
              match={match}
              bet={this.props.bet}
            />
          ))
        }
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    background: 'white',
  },
}

export default About;
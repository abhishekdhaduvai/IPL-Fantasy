import React from 'react';

class About extends React.Component {
  render(){
    return (
      <div style={styles.container}>

      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    paddingBottom: '5em',
  }
}

export default About;
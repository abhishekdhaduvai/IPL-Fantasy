import React from 'react';

class BrandingBand extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <div style={{padding: '1em'}}>
          <h1 style={{margin: 0}}>IPL Fantasy League</h1>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.banner}>
          <h2 style={styles.text}>{this.props.screen}</h2>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    color: 'white',
    background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,78,121,1) 0%, rgba(9,33,121,1) 100%)',
  },
  banner: {
    padding: '1em',
    background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,78,121,1) 0%, rgba(9,33,121,1) 100%)',
  },
  text: {
    color: 'white',
    margin: 0,
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(9,33,121,1) 70%)',
  }
}

export default BrandingBand;
import React from 'react';
import axios from 'axios';

import BrandingBand from '../web-components/BrandingBand';
import PointsTable from '../web-components/PointsTable';

class Dashboard extends React.Component {

  state = {
    table: [],
  }

  componentDidMount() {
    axios.get('/table')
    .then(res => {
      let temp = [];
      Object.keys(res.data).forEach(id => {
        temp.push(res.data[id]);
      });
      this.setState({ table: temp });
    })
    .catch(err => {
      console.log('err ', err);
    });
  }

  render() {
    const { table } = this.state;
    console.log(this.state);
    return (
      <div style={styles.container}>
        <BrandingBand screen='Home' />
        <img
          className="content-hero__img" src="http://naotw-pd.s3.amazonaws.com/images/IPL-Dhoni.jpg" />
        <PointsTable table={table}/>
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    background: 'white',
    overflow: 'hidden'
  },
}

export default Dashboard;
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
          className="content-hero__img" src="https://iplplatform-static-files.s3.amazonaws.com/IPL/photo/2018/05/03/e8f39a52-04f9-4f16-9ab3-4b8aebe43e76/Gill-int.jpg" />
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
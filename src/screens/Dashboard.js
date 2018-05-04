import React from 'react';
import axios from 'axios';

import BrandingBand from '../web-components/BrandingBand';
import PointsTable from '../web-components/PointsTable';

class Dashboard extends React.Component {

  render(){
    const table = [
      {
        name: 'Abhishek Dhaduvai',
        points: 12,
        form: ['W', 'W', 'W', 'L', 'W']
      },
      {
        name: 'Rahul Sakpal',
        points: 12,
        form: ['W', 'L', 'W', 'L', 'W']
      },
      {
        name: 'Hemanth Jagarlamudi',
        points: 10,
        form: ['L', 'L', 'W', 'L', 'W']
      },
      {
        name: 'KXIP',
        points: 10,
        form: ['W', 'W', 'L', 'L', 'L']
      },
    ]
    const { schedule, logos } = this.props;
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
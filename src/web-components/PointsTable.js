import React from 'react';
import axios from 'axios';

class PointsTable extends React.Component {

  render(){
    const { table } = this.props;
    table.sort((a, b) => {
      return b.points - a.points;
    });

    return (
      <div style={styles.container}>
        <table>
          <thead>
            <tr>
              <th className='id'>Pos</th>
              <th className='name' style={{textAlign: 'left'}}>Player</th>
              <th className='played'>Pld</th>
              <th className='points'>Pts</th>
              <th className='form'>Last 5 Games</th>
            </tr>
          </thead>
          <tbody>
            {table.map((player, pos) => (
              <tr key={pos}>
                <td className='id'>{pos+1}</td>
                <td className='name'>{player.name ||  player.email}</td>
                <td className='points'>{player.form.length}</td>
                <td className='points'>{player.points}</td>
                <td style={{display: 'flex'}}>
                  {player.form.slice(player.form-5).map((res, i) => (
                    <div key={i} className={'form '+res}>{res}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    position: 'absolute',
    top: '10em',
    left: '1em',
    padding: '0.5em',
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '5px',
  },
  team: {
    display: 'flex',
    alignItems: 'center',
    width: '125'
  },
  row: {
    display: 'flex',
    padding: '1em'
  },
}

export default PointsTable;
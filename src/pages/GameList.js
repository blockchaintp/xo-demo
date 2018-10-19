import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import OpenIcon from '@material-ui/icons/OpenInNew'

import GenericTable from '../components/GenericTable'

import xoModule from '../store/xo'

const styles = theme => {
  return {
    
  }
}

@connectStore({
  xo: xoModule,
})
class GameList extends React.Component {

  componentDidMount() {
    this.props.xo.loadGames()
  }
  
  render() {

    const { 
      xo,
      classes, 
    } = this.props
    
    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'Address',
      name: 'address',
    },{
      title: 'State',
      name: 'state',
    },{
      title: 'Board',
      name: 'board',
    }]


    const data = xo.games.map(gameData => {
      return {
        name: `${gameData.name}`,
        address: `${gameData.address}`,
        board: `${gameData.board}`,
        state: `${gameData.state}`,
      }
    })

    return (
      <div>
        <GenericTable
          title="Game"
          noSelect
          noDelete
          data={ data }
          fields={ fields }
          onAdd={ xo.add }
          addTitle='Create'
          icons={{
            edit: OpenIcon
          }}
          tooltips={{
            edit: 'View'
          }}
          onEdit={ (id) => console.log('edit') }
          getOptions={ () => null }
        />
      </div>
    )
  }

}

GameList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameList)
import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Icon } from "@material-ui/core";
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from "@material-ui/core";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { toggleDrawerMenu } from "../actions/drawerMenu";
import menuListData from '../data/drawerMenu.json';

const styles = (theme) => ({
  list: {
    width: 250,
  }
});

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const { isOpen, toggleMenu, classes } = this.props;

    const list = <div
        role="presentation"
        onClick={toggleMenu}
        onKeyDown={toggleMenu}
        className={classes.list}
      ><List>
        {menuListData.map((listItem, index) => {
            const item = listItem.type === "link" ?
              <Link to={listItem.link} key={index}>
                <ListItem button>
                  <ListItemIcon><Icon>{listItem.icon}</Icon></ListItemIcon>
                    <ListItemText primary={listItem.label}/>
                </ListItem>
              </Link> : <Divider key={index}/>;

            return item;
          })
        }
      </List>
    </div>;

    return <>
      <SwipeableDrawer
        anchor={'left'}
        open={isOpen}
        onClose={() => toggleMenu()}
        onOpen={() => toggleMenu()}
      >
        {list}
      </SwipeableDrawer>
    </>
  }
}

const mapStateToProps = (state) => {
  const { drawerMenu } = state;

  return {
    isOpen: drawerMenu.isOpen,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(toggleDrawerMenu()),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DrawerMenu));

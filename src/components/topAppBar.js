import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles/index";
import { toggleDrawerMenu } from "../actions/drawerMenu";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class TopAppBar extends React.Component {
  render() {
    const { classes, toggleMenu } = this.props;

    return <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Workout Tracker
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(toggleDrawerMenu()),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TopAppBar));

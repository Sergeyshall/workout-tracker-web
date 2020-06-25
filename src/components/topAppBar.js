import React from 'react';
import { connect } from 'react-redux';
import { Icon, IconButton, Button, Typography, Toolbar, AppBar, ThemeProvider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles/index";
import { toggleDrawerMenu } from "../actions/drawerMenu";
import theme from "../theme";

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

    return <ThemeProvider theme={theme}>
      <div className={classes.root}>
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
    </ThemeProvider>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(toggleDrawerMenu()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TopAppBar));

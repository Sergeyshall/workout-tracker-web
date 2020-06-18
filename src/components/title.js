import React from 'react';
import { withStyles } from "@material-ui/core";

const styles = () => ({
  root: {
    marginTop: 20,
  },
});

const Title = ({ children, classes }) => <p className={classes.root}>{children}</p>;

export default withStyles(styles)(Title);

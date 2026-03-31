import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  QueueMusic as QueueMusicIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { toggleDrawerMenu } from '../slices/drawerMenuSlice';
import { toggleMusicPlayer } from '../slices/musicPlayerSlice';

const TopAppBar = () => {
  const dispatch = useDispatch();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ mr: 2 }}
          color="inherit"
          aria-label="menu"
          onClick={() => dispatch(toggleDrawerMenu())}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Workout Tracker
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="toggle music player"
          onClick={() => dispatch(toggleMusicPlayer())}
        >
          <QueueMusicIcon />
        </IconButton>
        <IconButton edge="end" color="inherit" aria-label="account">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  FitnessCenter as FitnessCenterIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { toggleDrawerMenu } from '../slices/drawerMenuSlice';

const menuItems = [
  { label: 'Home', icon: <HomeIcon />, link: '/' },
  { label: 'Workouts', icon: <FitnessCenterIcon />, link: '/workouts' },
  { label: 'History', icon: <HistoryIcon />, link: '/history' },
  { type: 'divider' },
  { label: 'Profile', icon: <AccountCircleIcon />, link: '/profile' },
  { label: 'About', icon: <InfoIcon />, link: '/about' },
];

const DrawerMenu = () => {
  const isOpen = useSelector((s) => s.drawerMenu.isOpen);
  const dispatch = useDispatch();
  const toggle = () => dispatch(toggleDrawerMenu());

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={toggle}
      onOpen={toggle}
    >
      <List sx={{ width: 250 }} role="presentation" onClick={toggle} onKeyDown={toggle}>
        {menuItems.map((item, index) =>
          item.type === 'divider' ? (
            <Divider key={index} />
          ) : (
            <ListItemButton key={index} component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        )}
      </List>
    </SwipeableDrawer>
  );
};

export default DrawerMenu;

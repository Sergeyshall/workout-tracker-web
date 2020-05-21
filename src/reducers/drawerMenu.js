const defaultState = {
  isOpen: false,
}

const drawerMenu = (state = defaultState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case 'TOGGLE_DRAWER_MENU':
      newState.isOpen = !newState.isOpen;

      return newState;
    default:
      return state;
  }
}

export default drawerMenu;

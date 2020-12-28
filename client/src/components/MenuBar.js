import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathName = window.location.pathname; //gets path from URL

  //sets path to home by default, otherwise the name of the path (after /)
  //used as active item
  const path = pathName === "/" ? "home" : pathName.substr(1);
  
  //useState(path) makes path the first/default activeItem in this case
  const [activeItem, setActiveItem] = useState(path);

  //change activeItem to item with that name
  const handleItemClick = (e, { name }) => setActiveItem(name);



  //each menu item has a name
  //if active property is true, it will be enlarged and colored to teal
  //name (with first letter capitalized) will be rendered as the name of the tab

  //change this.handleItemClick to handleItemClick since MenuBar is a function instead of a class
  const menuBar = user ? (
    //if user is logged in
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username} //when logged in, show username instead of "Home"
        active //always be active
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          onClick={logout} //logout form AuthContext
        />
      </Menu.Menu>
    </Menu>
  ) : (
    //if not logged in
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  )


  //don't need a render. Since this component is a function, we just return
  return menuBar;
}

export default MenuBar;

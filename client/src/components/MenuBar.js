import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function MenuBar() {
  const pathName = window.location.pathname; //gets path from URL

  //sets path to home by default, otherwise the name of the path (after /)
  //used as active item
  const path = pathName === "/" ? "home" : pathName.substr(1);
  
  //useState(path) makes path the first/default activeItem in this case
  const [activeItem, setActiveItem] = useState(path);

  //change activeItem to item with that name
  const handleItemClick = (e, { name }) => setActiveItem(name);




  //don't need a render. Since this component is a function, we just return

  //each menu item has a name
  //if active property is true, it will be enlarged and colored to teal
  //name (with first letter capitalized) will be rendered as the name of the tab

  //change this.handleItemClick to handleItemClick since MenuBar is a function instead of a class
  return (
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item
          name='home'
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
}

export default MenuBar;

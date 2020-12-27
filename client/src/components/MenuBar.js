import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

function MenuBar() {
  const [activeItem, setActiveItem] = useState("");

  //change activeItem to item with that name
  const handleItemClick = (e, { name }) => setActiveItem(name);

  //don't need a render. Since this component is a function, we just return

  //each menu item has a name
  //if active property is true, it will be highlighted
  //name (with first letter capitalized) will be rendered as the name of the tab

  //change this.handleItemClick to handleItemClick since MenuBar is a function instead of a class
  return (
      <Menu pointing secondary>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
          />
        </Menu.Menu>
      </Menu>
  )
}

export default MenuBar;

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import './Dropdown.css';


const Dropdown = (i) => {
    return (
      <DropdownButton
        title= {"Product"}
        key={i}
        id={`dropdown-basic-${i}`}
      >
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3" active>
          Active Item
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
      </DropdownButton>
    );
 
}

export default Dropdown;
  

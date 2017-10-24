import React from 'react';
import {
  Navbar,
  FormGroup,
  FormControl,
  Button,
  InputGroup,
  MenuItem,
  NavDropdown,
  Nav,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/" >LOLStats</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavDropdown title="NA">
            <MenuItem>North America</MenuItem>
          </NavDropdown>
        </Nav>
        <Navbar.Form pullRight>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" placeholder="Search summoners" />
              <InputGroup.Button>
                <Button type="submit" bsStyle="primary">
                  Submit
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

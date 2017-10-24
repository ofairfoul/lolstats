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
import { Link, withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import { toPairs } from 'lodash';

import { compose, withHandlers, mapProps } from 'recompose';

import regions from 'static/regions';

import buildPath from 'util/buildPath';

const regionsData =
  toPairs(regions)
    .map(([key, value]) => ({
      id: key,
      ...value,
    }));

const enhancer = compose(
  withRouter,
  withHandlers({
    regionChange: ({ history, match: { path, params } }) => region => {
      history.push(buildPath(path, { ...params, region }));
    },
  }),
  mapProps(({ match: { params: { region } }, regionChange }) => ({ region, regionChange })),
);

export default enhancer(({ region, regionChange }) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/" ><FontAwesome name="rebel" /> LOLStats</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavDropdown title={
          <span><FontAwesome name="globe" /> {region}</span>
        }>
          <MenuItem header>Choose a region</MenuItem>
          { regionsData.map(r => (
            <MenuItem
              key={r.id}
              eventKey={r.id}
              onSelect={regionChange}>
              {r.name}
            </MenuItem>
          ))}
        </NavDropdown>
      </Nav>
      <Navbar.Form pullRight>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" placeholder="Search summoners" />
            <InputGroup.Button>
              <Button type="submit" bsStyle="primary">
                <FontAwesome name="search" />
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
));

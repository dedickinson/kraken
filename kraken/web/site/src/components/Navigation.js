// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';

const Navigation = () => {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="#" className="navbar-brand">
            DEMO
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <IndexLinkContainer to="/">
            <NavItem eventKey={1}>Home</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/data">
            <NavItem eventKey={2}>Data</NavItem>
          </IndexLinkContainer>
          <IndexLinkContainer to="/cal">
            <NavItem eventKey={3}>Calendar</NavItem>
          </IndexLinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

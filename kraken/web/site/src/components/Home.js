// @flow

import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Jumbotron>
      <h1>Home</h1>
      <p>You are home.</p>
      <p>
        <Button bsStyle="primary">Learn more</Button>
      </p>
    </Jumbotron>
  );
};

export default Home;

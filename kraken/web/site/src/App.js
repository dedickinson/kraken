// @flow

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Data from './components/Data';
import Calendar from './components/Calendar';
import Navigation from './components/Navigation';

type Props = {
  title: string,
};

type State = {};

class App extends React.Component<Props, State> {
  render() {
    return (
      <Router>
        <div className="App">
          <header>
            <Navigation />
          </header>
          <section>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/data" component={Data} />
              <Route exact path="/cal" component={Calendar} />
            </Switch>
          </section>
          <footer />
        </div>
      </Router>
    );
  }
}

export default App;

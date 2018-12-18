// @flow

import React from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import './Calendar.css';

type Props = {};
type State = {
  date: Date,
};

class Calendar extends React.Component<Props, State> {
  timerID: IntervalID;

  state = {
    date: new Date(),
  };

  /*
  constructor(props: Props) {
    super(props);
  }
  */

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={0} sm={2} md={3} lg={4} />
            <Col xs={12} sm={8} md={6} lg={4}>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h3">
                    <span className="calendar-date">
                      {this.state.date.toLocaleDateString()}
                    </span>
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  <span className="calendar-time">
                    {this.state.date.toLocaleTimeString()}
                  </span>
                </Panel.Body>
              </Panel>
            </Col>
            <Col xs={0} sm={2} md={3} lg={4} />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Calendar;

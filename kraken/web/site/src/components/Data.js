// @flow

/*
 * See also: https://www.robinwieruch.de/react-fetching-data/
 */

import React from 'react';
import axios from 'axios';
import {
  Panel,
  FormGroup,
  Form,
  FormControl,
  InputGroup,
  Glyphicon,
  Grid,
  Row,
  Col,
  Table,
  Alert,
} from 'react-bootstrap';

/*
type PostCodeRecord = {
  country_code: string,
  postal_code: string,
  place_name: string,
  state: string,
  lat: number,
  long: number,
  accuracy: number,
  country: string,
};
*/

const QueryAlert = (props: { message: string }) => {
  return <Alert bsStyle="danger">{props.message}</Alert>;
};

const PostcodeNotFound = () => {
  return <Alert bsStyle="info">No matching postcode was found</Alert>;
};

const Spinner = () => (
  <div>
    <Glyphicon glyph="hourglass" />
    Running query...
  </div>
);

const ResultsTable = (props: { postcodes: Array<Object> }) => {
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Postcode</th>
          <th>Place</th>
          <th>State</th>
          <th>Lat</th>
          <th>Long</th>
        </tr>
      </thead>
      <tbody>
        {props.postcodes.map(record => (
          <tr key={record.place_name}>
            <td>{record.postal_code}</td>
            <td>{record.place_name}</td>
            <td>{record.state}</td>
            <td>{record.lat}</td>
            <td>{record.long}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ResultsPanel = (props: { postcodes: Array<Object> }) => {
  return (
    <Panel bsStyle="info">
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          <span>Results</span>
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        <ResultsTable postcodes={props.postcodes} />
      </Panel.Body>
    </Panel>
  );
};

type State = {
  init: boolean,
  query: string,
  postcodes: Array<Object>,
  query_running: boolean,
  query_error: string,
};

class Data extends React.Component<{}, State> {
  state = {
    init: true,
    query: '',
    postcodes: [],
    query_running: false,
    query_error: '',
  };

  handleSubmit = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (this.state.query.length === 0) {
      this.setState({
        query_error: 'Please enter a postcode',
      });
      return;
    }

    this.setState({
      query_running: true,
      query_error: '',
      init: false,
    });

    axios
      .get(`http://localhost:5000/postcodes/${this.state.query}`)
      .then(response => {
        this.setState({
          query_error: '',
          postcodes: response.data,
        });
      })
      .catch(error => {
        this.setState({
          query_error: error.message,
        });
      })
      .then(() => {
        this.setState({
          query_running: false,
        });
      });
  };

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ query: event.currentTarget.value });
  };

  getValidationState() {
    return this.state.query.length < 1 && !this.state.init ? 'error' : null;
  }

  displayResults() {
    if (this.state.query_running) {
      return <Spinner />;
    }

    if (this.state.query_error) {
      return <QueryAlert message={this.state.query_error} />;
    }

    if (!this.state.init && this.state.postcodes.length > 0) {
      return <ResultsPanel postcodes={this.state.postcodes} />;
    }

    if (!this.state.init) {
      return <PostcodeNotFound />;
    }
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={0} sm={2} md={3} lg={4} />
          <Col xs={12} sm={8} md={6} lg={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title componentClass="h3">
                  <span>Postcode Search</span>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <Form inline onSubmit={this.handleSubmit}>
                  <FormGroup validationState={this.getValidationState()}>
                    <InputGroup>
                      <InputGroup.Addon>
                        <Glyphicon glyph="search" onClick={this.handleSubmit} />
                      </InputGroup.Addon>
                      <FormControl
                        type="text"
                        value={this.state.query}
                        onChange={this.handleChange}
                        placeholder="Enter a postcode"
                      />
                    </InputGroup>
                    <FormControl.Feedback />
                  </FormGroup>
                </Form>
              </Panel.Body>
            </Panel>
          </Col>
          <Col xs={0} sm={2} md={3} lg={4} />
        </Row>
        <Row>
          <Col xs={0} sm={2} md={3} lg={43} />
          <Col xs={12} sm={8} md={6} lg={6}>
            {this.displayResults()}
          </Col>
          <Col xs={0} sm={2} md={3} lg={3} />
        </Row>
      </Grid>
    );
  }
}

export default Data;

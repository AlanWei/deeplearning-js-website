import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import keys from 'lodash/keys';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import logistic from '../../dl/logistic';
import action from './action';
import logo from '../../assets/logo.svg';
import './style.scss';

const propTypes = {
  getMessage: PropTypes.func.isRequired,
};

const formatDataToChart = costs => (
  map(costs, (cost) => {
    const key = keys(cost)[0];
    return {
      name: key,
      cost: cost[key],
    };
  })
);

class Home extends Component {
  state = {
    costs: [],
  }

  componentDidMount() {
    this.props.getMessage();
  }

  onTrainingend = (parameters, costs) => {
    this.setState({
      costs: formatDataToChart(costs),
    });
  }

  train = () => {
    logistic(
      0.0025,
      1000,
      10,
      0.000000001,
      this.onTrainingend,
    );
  }

  render() {
    return (
      <div className="home">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/views/home/index.js</code> and save to reload.
        </p>
        <button onClick={this.train}>Train</button>
        <LineChart
          width={1200}
          height={600}
          data={this.state.costs}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#8884d8"
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  message: state.home.message,
});

const mapDispatchToProps = {
  getMessage: action.getMessage,
};

Home.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Home);

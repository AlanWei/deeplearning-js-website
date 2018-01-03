import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Table, Select } from 'antd';
import slice from 'lodash/slice';
import map from 'lodash/map';
import Header from '../header';
import Content from '../content';
import iris from '../../dl/data/iris';
import setosa from './iris/setosa.jpg';
import versicolor from './iris/versicolor.jpg';
import virginica from './iris/virginica.jpg';
import { LEARNING_RATES, EPOCHES } from './const';
import './index.scss';

const { Meta } = Card;
const { Option } = Select;

const propTypes = {
};

class Demos extends Component {
  state = {
    learningRate: 0.01,
    epoch: 1000,
  }

  handleLearningRateSelect = (value) => {
    this.setState({
      learningRate: value,
    });
  }

  handleEpochSelect = (value) => {
    this.setState({
      epoch: value,
    });
  }

  renderIrisImages = () => (
    <div className="irisSpecies">
      <Card
        className="species"
        hoverable
        cover={<img className="irisImage" alt="" src={setosa} />}
      >
        <Meta
          title="Iris setosa"
        />
      </Card>
      <Card
        className="species"
        hoverable
        cover={<img className="irisImage" alt="" src={versicolor} />}
      >
        <Meta
          title="Iris versicolor"
        />
      </Card>
      <Card
        className="species"
        hoverable
        cover={<img className="irisImage" alt="" src={virginica} />}
      >
        <Meta
          title="Iris virginica"
        />
      </Card>
    </div>
  )

  renderIrisTable = () => {
    const dataArray = slice(iris, 0, 3).concat(slice(iris, 50, 53)).concat(slice(iris, 100, 103));
    const dataSource = map(dataArray, (obj, idx) => ({
      ...obj,
      key: idx,
    }));
    const columns = [{
      title: 'Sepal Length',
      dataIndex: 'sepalLength',
      key: 'sepalLength',
    }, {
      title: 'Sepal Width',
      dataIndex: 'sepalWidth',
      key: 'sepalWidth',
    }, {
      title: 'Petal Length',
      dataIndex: 'petalLength',
      key: 'petalLength',
    }, {
      title: 'Petal Width',
      dataIndex: 'petalWidth',
      key: 'petalWidth',
    }, {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
    }];
    return (
      <Table
        className="irisTable"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
      />
    );
  }

  renderTrainParameters = () => (
    <div>
      <span className="parameterLabel">Learning rate</span>
      <Select className="parameterSelect" defaultValue={this.state.learningRate} onChange={this.handleLearningRateSelect}>
        {map(LEARNING_RATES, learningRate => (
          <Option value={learningRate} key={learningRate}>{learningRate}</Option>
        ))}
      </Select>
      <span className="parameterLabel">Epoch</span>
      <Select className="parameterSelect" defaultValue={this.state.epoch} onChange={this.handleEpochSelect}>
        {map(EPOCHES, epoch => (
          <Option value={epoch} key={epoch}>{epoch}</Option>
        ))}
      </Select>
    </div>
  )

  renderIris = () => (
    <Card title="Logistic regression - Iris">
      {this.renderIrisImages()}
      <h2 className="block">Description</h2>
      <div className="irisDesc">
        Iris data set consists of 50 samples from each of three species of Iris (Iris setosa, Iris virginica and Iris versicolor). Four features were measured from each sample: the length and the width of the sepals and petals, in centimetres.
      </div>
      <h2 className="block">Preview</h2>
      {this.renderIrisTable()}
      <h2 className="block">Training</h2>
      {this.renderTrainParameters()}
    </Card>
  )

  render() {
    return (
      <div className="demos">
        <Header current="demos" />
        <Content>
          <div>
            {this.renderIris()}
          </div>
        </Content>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

Demos.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Demos);

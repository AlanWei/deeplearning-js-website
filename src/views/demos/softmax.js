import React, { Component } from 'react';
import { Card, Table, Select, Switch, InputNumber, Button, notification } from 'antd';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, Legend } from 'recharts';
import slice from 'lodash/slice';
import map from 'lodash/map';
import Header from '../header';
import Content from '../content';
import Footer from '../footer';
import Sider from './Sider';
import iris from '../../dl/data/iris';
import irisTrain from '../../dl/data/iris.train';
import irisTest from '../../dl/data/iris.test';
import { softmax, predict } from '../../dl/softmax';
import setosa from './iris/setosa.jpg';
import versicolor from './iris/versicolor.jpg';
import virginica from './iris/virginica.jpg';
import { LEARNING_RATES, EPOCHES, IRIS_DIMS } from './const';
import './index.scss';

const { Meta } = Card;
const { Option } = Select;

class Softmax extends Component {
  state = {
    isTraining: false,
    //
    learningRate: 0.003,
    epoch: 500,
    costFunc: 'cross-entropy',
    isNormalized: false,
    hiddenLayerSize: 10,
    hiddenLayerAct: 'relu',
    outputLayerSize: 3,
    outputLayerAct: 'softmax',
    //
    testSet: {
      input: [],
      output: [],
    },
    parameters: {},
    costs: [],
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

  handlePreprocessSwitch = (checked) => {
    this.setState({
      isNormalized: checked,
    });
  }

  handleHiddenLayerSize = (size) => {
    this.setState({
      hiddenLayerSize: size,
    });
  }

  handleTrainError = (err) => {
    this.setState({
      isTraining: false,
    });
    notification.error({
      message: 'Error',
      description: err.message,
    });
  }

  handleTrain = () => {
    this.setState({
      isTraining: true,
    }, () => {
      setTimeout(() => {
        const ro = softmax(
          this.state.learningRate,
          this.state.epoch,
          this.state.isNormalized,
          this.state.hiddenLayerSize,
          this.handleTrainError,
        );
        if (ro) {
          this.setState({
            testSet: ro.testSet,
            parameters: ro.parameters,
            costs: ro.costs,
            isTraining: false,
          });
        }
      }, 500);
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
      title: 'Sepal Length (cm)',
      dataIndex: 'sepalLength',
      key: 'sepalLength',
    }, {
      title: 'Sepal Width (cm)',
      dataIndex: 'sepalWidth',
      key: 'sepalWidth',
    }, {
      title: 'Petal Length (cm)',
      dataIndex: 'petalLength',
      key: 'petalLength',
    }, {
      title: 'Petal Width (cm)',
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
      <span className="parameterLabel">Learning rate:</span>
      <Select className="parameterSelect" defaultValue={this.state.learningRate} onChange={this.handleLearningRateSelect}>
        {map(LEARNING_RATES, learningRate => (
          <Option value={learningRate} key={learningRate}>{learningRate}</Option>
        ))}
      </Select>
      <span className="parameterLabel">Epoch:</span>
      <Select className="parameterSelect" defaultValue={this.state.epoch} onChange={this.handleEpochSelect}>
        {map(EPOCHES, epoch => (
          <Option value={epoch} key={epoch}>{epoch}</Option>
        ))}
      </Select>
      <span className="parameterLabel">Cost function:</span>
      <Select className="parameterSelect" defaultValue={this.state.costFunc} disabled />
    </div>
  )

  renderModel = datasetSize => (
    <div className="model">
      <Card className="modelLayer" title="Input Layer" extra={<span>[{IRIS_DIMS}, {datasetSize}]</span>}>
        <div className="layerBlock">Data set:</div>
        <div>Iris train set [4, 105]</div>
        <div>Iris test set [4, 45]</div>
        <div className="divider" />
        <div className="layerBlock">Data Normalization:</div>
        <Switch checked={this.state.isNormalized} onChange={this.handlePreprocessSwitch} />
      </Card>
      <Card className="modelLayer" title="Hidden Layer" extra={<span>[{this.state.hiddenLayerSize}, {IRIS_DIMS}]</span>}>
        <div className="layerBlock">Activation function:</div>
        <Select className="parameterSelect" defaultValue={this.state.hiddenLayerAct} disabled />
        <div className="divider" />
        <div className="layerBlock">Neurons:</div>
        <InputNumber min={1} max={100} step={10} defaultValue={this.state.hiddenLayerSize} onChange={this.handleHiddenLayerSize} />
      </Card>
      <Card className="modelLayer" title="Output Layer" extra={<span>[{this.state.outputLayerSize}, {this.state.hiddenLayerSize}]</span>}>
        <div className="layerBlock">Activation function:</div>
        <Select className="parameterSelect" defaultValue={this.state.outputLayerAct} disabled />
        <div className="divider" />
        <div className="layerBlock">Neurons:</div>
        <InputNumber defaultValue={this.state.outputLayerSize} disabled />
      </Card>
      <Card className="modelLayer" title="Output" extra={<span>[{this.state.outputLayerSize}, {datasetSize}]</span>}>
        <div className="layerBlock">Description:</div>
        <div className="layerBlock"></div>
      </Card>
    </div>
  )

  renderCostGraph = () => (
    <ResponsiveContainer height={320} width="100%">
      <LineChart
        data={this.state.costs}
        margin={{ right: 10 }}
      >
        <XAxis dataKey="epoch">
          <Label value="Epoch" position="insideBottomRight" offset={-10} />
        </XAxis>
        <YAxis dataKey="cost" />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cost" stroke="#1890ff" />
      </LineChart>
    </ResponsiveContainer>
  )

  renderPredict = (datasetSize) => {
    const { testSet, parameters } = this.state;
    const predictSet = predict(testSet.input, irisTest, parameters);
    const dataSource = map(irisTest, (obj, idx) => ({
      key: idx,
      index: idx + 1,
      species: obj.species,
      predict: predictSet[idx],
    }));
    let correctCount = 0;
    map(predictSet, (species, idx) => {
      if (species === irisTest[idx].species) {
        correctCount += 1;
      }
    });
    const accuracy = `${(correctCount / datasetSize).toFixed(5) * 100}%`;
    const columns = [{
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
    }, {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
    }, {
      title: 'Predict',
      dataIndex: 'predict',
      key: 'predict',
    }];
    return (
      <Table
        className="irisTable"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={{ pageSize: 15 }}
        footer={() => (
          <div>
            <div className="textBlock">Data set size: {datasetSize}</div>
            <div className="textBlock">Correct count: {correctCount}</div>
            <div className="textBlock">Accuracy: {accuracy}</div>
          </div>
        )}
      />
    );
  }

  renderIris = () => (
    <div className="pageContent">
      <h1>Softmax classifier - Iris</h1>
      <h2 className="h2block">Description</h2>
      <div className="irisDesc">
        Iris data set consists of 50 samples from each of three species of Iris (Iris setosa, Iris virginica and Iris versicolor). Four features were measured from each sample: the length and the width of the sepals and petals, in centimetres.
      </div>
      {this.renderIrisImages()}
      <h2 className="h2block">Preview</h2>
      {this.renderIrisTable()}
      <h2 className="h2block">Hyperparameters</h2>
      {this.renderTrainParameters()}
      <h2 className="h2block">Model</h2>
      {this.renderModel(irisTrain.length)}
      <h2 className="h2block">Training</h2>
      <Button type="primary" size="large" loading={this.state.isTraining} onClick={this.handleTrain}>TRAIN</Button>
      <h2 className="h2block">Cost</h2>
      {this.renderCostGraph()}
      <h2 className="h2block">Predict</h2>
      {this.renderPredict(irisTest.length)}
    </div>
  )

  render() {
    return (
      <div className="pageRoot">
        <Header current="demos" />
        <Content className="demos">
          <Sider current="softmax" />
          {this.renderIris(iris.length)}
        </Content>
        <Footer />
      </div>
    );
  }
}

export default Softmax;

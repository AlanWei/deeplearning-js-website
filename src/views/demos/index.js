import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Table, Select, Switch, InputNumber, Button, Menu } from 'antd';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, Legend } from 'recharts';
import slice from 'lodash/slice';
import map from 'lodash/map';
import Header from '../header';
import Content from '../content';
import Footer from '../footer';
import iris from '../../dl/data/iris';
import { logistic, predict } from '../../dl/logistic';
import setosa from './iris/setosa.jpg';
import versicolor from './iris/versicolor.jpg';
import virginica from './iris/virginica.jpg';
import { LEARNING_RATES, EPOCHES, SPECIES, IRIS_DIMS } from './const';
import './index.scss';

const { Meta } = Card;
const { Option } = Select;

class Demos extends Component {
  state = {
    currentDemo: 'logistic',
    //
    targetSpecies: 'setosa',
    learningRate: 0.003,
    epoch: 500,
    costFunc: 'cross-entropy',
    isNormalized: false,
    hiddenLayerSize: 10,
    hiddenLayerAct: 'relu',
    outputLayerSize: 1,
    outputLayerAct: 'sigmoid',
    //
    trainSet: {
      input: [],
      output: [],
    },
    parameters: {},
    costs: [],
  }

  handleTargetSpeciesSelect = (value) => {
    this.setState({
      targetSpecies: value,
    });
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

  handleTrain = () => {
    const { trainSet, parameters, costs } = logistic(
      this.state.targetSpecies,
      this.state.learningRate,
      this.state.epoch,
      this.state.isNormalized,
      this.state.hiddenLayerSize,
    );

    this.setState({
      trainSet,
      parameters,
      costs,
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
      <span className="parameterLabel">Target Species:</span>
      <Select className="parameterSelect" defaultValue={this.state.targetSpecies} onChange={this.handleTargetSpeciesSelect}>
        {map(SPECIES, species => (
          <Option value={species} key={species}>{species}</Option>
        ))}
      </Select>
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
        <a href="../../dl/data/iris.json" target="_blank">Iris</a>
      </Card>
      <Card className="modelLayer" title="Data Preprocess" extra={<span>[{IRIS_DIMS}, {datasetSize}]</span>}>
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
        <div className="layerBlock">A [{this.state.outputLayerSize}, {datasetSize}] matrix with 0 or 1 represents each of {datasetSize} examples is the target species or not</div>
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
    const { trainSet, parameters } = this.state;
    const { predictSet, correctSet } = predict(trainSet.input, trainSet.output, parameters);
    const dataSource = map(iris, (obj, idx) => ({
      key: idx,
      index: idx + 1,
      species: obj.species,
      correct: obj.species === this.state.targetSpecies ? 1 : 0,
      predict: predictSet[idx],
    }));
    let correctCount = 0;
    map(predictSet, (num, idx) => {
      if (num === correctSet[idx]) {
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
      title: 'Correct',
      dataIndex: 'correct',
      key: 'correct',
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
        pagination={{ pageSize: 25 }}
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

  renderIris = datasetSize => (
    <div className="pageContent">
      <h1>Logistic regression - Iris</h1>
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
      {this.renderModel(datasetSize)}
      <h2 className="h2block">Training</h2>
      <Button type="primary" size="large" onClick={this.handleTrain}>TRAIN</Button>
      <h2 className="h2block">Cost</h2>
      {this.renderCostGraph()}
      <h2 className="h2block">Predict</h2>
      {this.renderPredict(datasetSize)}
    </div>
  )

  renderSider = () => (
    <Menu
      mode="inline"
      selectedKeys={[this.state.currentDemo]}
    >
      <Menu.Item key="logistic" className="menuItem">Logistic regression</Menu.Item>
    </Menu>
  )

  renderContent = () => {
    switch (this.state.currentDemo) {
      case 'logistic':
        return this.renderIris(iris.length);
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="pageRoot">
        <Header current="demos" />
        <Content className="demos">
          <div className="sider">
            {this.renderSider()}
          </div>
          {this.renderContent()}
        </Content>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Demos);

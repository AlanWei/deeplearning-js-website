import { map, omit, pick, values } from 'lodash';
import {
  initializeParameters,
  forwardPropagation,
  batchTrain,
  Normalization,
  transpose,
} from 'deeplearning-js';
import * as iris from './data/iris';

function formatDataSet(dataset, target) {
  const inputValues: number[][] = [];
  const outputValues: number[][] = [];

  map(dataset, (example, idx) => {
    const input = omit(example, 'species');
    const output = pick(example, 'species');
    inputValues[idx] = values(input);
    outputValues[idx] = [output.species === target ? 1 : 0];
  });

  return {
    input: map(transpose(inputValues), subArray => (
      Normalization.zscore(subArray)
    )),
    output: transpose(outputValues),
  };
}

function formatNumToBool(output) {
  return map(output, num => (num > 0.5 ? 1 : 0));
}

function predict(
  input,
  output,
  parameters,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  const predictSet = formatNumToBool(forward[0]);
  const correctSet = formatNumToBool(output[0]);

  const rightSet = [];
  const wrongSet = [];
  map(predictSet, (num, idx) => {
    if (num === correctSet[idx]) {
      rightSet.push(idx);
    } else {
      wrongSet.push(idx);
    }
  });

  return {
    rightSet,
    wrongSet,
  };
}

function logistic(
  target,
  hiddenLayers,
  learningRate,
  numOfIterations,
  onBatchTrainEnd,
  onTrainEnd,
  batchSize = 10,
) {
  const trainSet = formatDataSet(iris, target);

  const inputLayer = [{
    size: trainSet.input.length,
  }];
  const outputLayer = [{
    size: trainSet.output.length,
    activationFunc: 'sigmoid',
  }];
  const model = inputLayer.concat(hiddenLayers).concat(outputLayer);

  const initialParameters = initializeParameters(model);

  batchTrain(
    0,
    numOfIterations / batchSize,
    batchSize,
    trainSet.input,
    trainSet.output,
    initialParameters,
    learningRate,
    'cross-entropy',
    onBatchTrainEnd,
    onTrainEnd,
  );
}

function getTrainSet(target) {
  return formatDataSet(iris, target);
}

export {
  logistic,
  predict,
  getTrainSet,
};

import { map, omit, pick, values } from 'lodash';
import {
  initializeParameters,
  forwardPropagation,
  train,
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
  datasetType,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  const predictSet = formatNumToBool(forward[0]);
  const correctSet = formatNumToBool(output[0]);
  let correctCount = 0;
  map(predictSet, (num, idx) => {
    if (num === correctSet[idx]) {
      correctCount += 1;
    }
  });

  console.log(`${datasetType} set accuracy: ${(correctCount / correctSet.length) * 100}%`);
  console.log(`${datasetType} set correct count: ${correctCount}`);
}

export default function logistic(
  target,
  hiddenLayers,
  learningRate,
  numOfIterations,
  costFunction,
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

  const initialParameters = initializeParameters(model, 0, 1, 0.01);

  const { parameters, costs } = train(
    trainSet.input,
    trainSet.output,
    initialParameters,
    costFunction,
    learningRate,
    numOfIterations,
    10,
    true,
  );

  return {
    parameters,
    costs,
  };

  // predict(trainSet.input, trainSet.output, parameters, 'train');
}

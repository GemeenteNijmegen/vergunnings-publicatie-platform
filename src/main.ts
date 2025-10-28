import { App } from 'aws-cdk-lib';
import { getConfiguration } from './Configuration';
import { PipelineStack } from './PipelineStack';
import { Statics } from './Statics';

const branchToBuild = process.env.BRANCH_NAME ?? 'acceptance';
console.log('Building branch:', branchToBuild);
const configuration = getConfiguration(branchToBuild);

export const app = new App();

new PipelineStack(app, `${Statics.projectName}-${configuration.branch}-pipeline-stack`, {
  env: configuration.deployFromEnvironment,
  configuration: configuration,
});

app.synth();
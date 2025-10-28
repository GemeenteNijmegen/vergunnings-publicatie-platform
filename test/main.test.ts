import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { VergunningsPublicatiePlatformStack } from '../src/VergunningsPublicatiePlatformStack';

const env = {
  account: '123456789012',
  region: 'us-east-1',
};


test('Snapshot', () => {
  const app = new App();
  const stack = new VergunningsPublicatiePlatformStack(app, 'test', {
    configuration: {
      branch: 'test',
      deployFromEnvironment: env,
      deployToEnvironment: env,
      domainNamesCertificate: {
        domainName: 'test.com',
        alternativeNames: undefined,
      },
      domainNamesCloudFront: ['test.com'],
    },
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
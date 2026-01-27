import { GemeenteNijmegenCdkApp } from '@gemeentenijmegen/projen-project-type';
const project = new GemeenteNijmegenCdkApp({
  cdkVersion: '2.2.0',
  defaultReleaseBranch: 'acceptance',
  devDeps: [],
  name: 'vergunnings-publicatie-platform',
  projenrcTs: true,
  deps: [
    '@pepperize/cdk-ssm-parameters-cross-region',
    '@aws-solutions-constructs/aws-cloudfront-s3',
    '@gemeentenijmegen/aws-constructs',
    '@gemeentenijmegen/projen-project-type',
  ],
  tsconfig: {
    compilerOptions: {
      isolatedModules: true,
    },
  },

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudfrontDistribution } from './CloudfrontDistribution';
import { Configurable } from './Configuration';
import { VergunningsBucket } from './VergunningsBucket';
import { S3AccessUser } from './S3AccessUser';

interface VergunningsPublicatiePlatformStackProps extends StackProps, Configurable {}

export class VergunningsPublicatiePlatformStack extends Stack {
  constructor(scope: Construct, id: string, props: VergunningsPublicatiePlatformStackProps) {
    super(scope, id, props);
    const bucket = new VergunningsBucket(this, 'vergunnings');
    new CloudfrontDistribution(this, 'cfdistr', {
      env: props.env,
      bucket: bucket.s3OriginConfig.s3BucketSource,
      originConfig: bucket.s3OriginConfig,
      domainNames: props.configuration.domainNamesCloudFront,
    });
    new S3AccessUser(this, 'publish-access', {
      bucket: bucket.s3OriginConfig.s3BucketSource,
    });
  }
}

import { StringParameter } from '@pepperize/cdk-ssm-parameters-cross-region';
import { Stack, StackProps, aws_ssm as ssm, aws_certificatemanager as acm } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { Configurable } from './Configuration';
import { Statics } from './Statics';

export interface CertificateStackProps extends StackProps, Configurable {}

export class CertificateStack extends Stack {
  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const mainRegion = props.configuration.deployToEnvironment.region;
    const projectHostedZoneName = StringParameter.fromStringParameterName(this, 'hostedzonename', mainRegion, Statics.projectHostedZoneName).stringValue;
    const projectHostedZoneId = StringParameter.fromStringParameterName(this, 'hostedzoneid', mainRegion, Statics.projectHostedZoneId).stringValue;
    const projectHostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedzone', {
      hostedZoneId: projectHostedZoneId,
      zoneName: projectHostedZoneName,
    });

    const certificate = new Certificate(this, 'certificate', {
      domainName: props.configuration.domainNamesCertificate.domainName,
      subjectAlternativeNames: props.configuration.domainNamesCertificate.alternativeNames,
      validation: props.configuration.domainNamesCertificate.alternativeNames
        ? acm.CertificateValidation.fromDns()
        : acm.CertificateValidation.fromDns(projectHostedZone),
    });

    new ssm.StringParameter(this, 'cert-arn', {
      stringValue: certificate.certificateArn,
      parameterName: Statics.certificateParameter,
    });

  }
}

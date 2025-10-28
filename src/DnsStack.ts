import {
  aws_route53 as Route53,
  aws_ssm as SSM,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Statics } from './Statics';

export interface DnsStackProps extends StackProps {}

export class DnsStack extends Stack {
  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);

    const projectHostedZone = this.projectHostedZone();
    this.setSsmParametersForHostedZone(projectHostedZone);
  }

  /**
   * Creates a new hosted zone that is a subdomain of the accountHostedZone
   * @param accountHostedZone
   */
  private projectHostedZone() {
    const accountZone = this.accountHostedZone();

    const hostedZone = new Route53.HostedZone(this, 'projectzone', {
      zoneName: `${Statics.projectName}.${accountZone.zoneName}`,
      comment: `${Statics.projectName} hosted zone`,
    });

    if (!hostedZone.hostedZoneNameServers) {
      throw new Error('Hosted zone name servers are not set');
    }

    new Route53.ZoneDelegationRecord(this, 'projectzone-delegation', {
      recordName: hostedZone.zoneName,
      nameServers: hostedZone.hostedZoneNameServers,
      zone: accountZone,
      comment: `${Statics.projectName} hosted zone delegation`,
    });

    return hostedZone;
  }

  /**
   * Sets the SSM parameters for the hosted zone
   * @param hostedZone
   */
  private setSsmParametersForHostedZone(hostedZone: Route53.HostedZone) {
    const hostedZoneName = hostedZone.zoneName;
    const hostedZoneId = hostedZone.hostedZoneId;

    new SSM.StringParameter(this, 'hostedZoneName', {
      parameterName: Statics.projectHostedZoneName,
      stringValue: hostedZoneName,
    });

    new SSM.StringParameter(this, 'hostedZoneId', {
      parameterName: Statics.projectHostedZoneId,
      stringValue: hostedZoneId,
    });
  }

  private accountHostedZone() {
    const rootZoneId = SSM.StringParameter.valueForStringParameter(this, Statics.accountRootHostedZoneId);
    const rootZoneName = SSM.StringParameter.valueForStringParameter(this, Statics.accountRootHostedZoneName);
    return Route53.HostedZone.fromHostedZoneAttributes(this, 'cspzone', {
      hostedZoneId: rootZoneId,
      zoneName: rootZoneName,
    });
  }

}
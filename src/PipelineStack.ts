import { PermissionsBoundaryAspect } from '@gemeentenijmegen/aws-constructs';
import { Stack, StackProps, Tags, pipelines, CfnParameter, Stage, StageProps, Aspects } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CertificateStack } from './CertificateStack';
import { Configurable } from './Configuration';
import { DnsStack } from './DnsStack';
import { Statics } from './Statics';
import { VergunningsPublicatiePlatformStack } from './VergunningsPublicatiePlatformStack';

export interface PipelineStackProps extends StackProps, Configurable {}

export class PipelineStack extends Stack {
  branchName: string;
  projectName: string;
  repository: string;
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);
    Aspects.of(this).add(new PermissionsBoundaryAspect());
    this.branchName = props.configuration.branch;
    this.projectName = Statics.projectName;
    this.repository = `${Statics.repositoryOwner}/${Statics.repository}`;

    const connectionArn = new CfnParameter(this, 'connectionArn');

    const source = this.connectionSource(connectionArn);

    const pipeline = this.pipeline(source);
    pipeline.addStage(
      new VergunningsPublicatiePlatformStage(this, Statics.projectName, {
        env: props.configuration.deployToEnvironment,
        configuration: props.configuration,
      }),
    );
  }

  pipeline(source: pipelines.CodePipelineSource): pipelines.CodePipeline {
    const synthStep = new pipelines.ShellStep('Synth', {
      input: source,
      env: {
        BRANCH_NAME: this.branchName,
      },
      commands: [
        'yarn install --frozen-lockfile',
        'npx projen build',
        'npx projen synth',
      ],
    });

    const pipeline = new pipelines.CodePipeline(this, `${this.projectName}-${this.branchName}`, {
      pipelineName: `${this.projectName}-${this.branchName}`,
      crossAccountKeys: true,
      synth: synthStep,
    });
    return pipeline;
  }

  private connectionSource(connectionArn: CfnParameter): pipelines.CodePipelineSource {
    return pipelines.CodePipelineSource.connection(this.repository, this.branchName, {
      connectionArn: connectionArn.valueAsString,
    });
  }
}

export interface VergunningsPublicatiePlatformStageProps extends StageProps, Configurable {}

class VergunningsPublicatiePlatformStage extends Stage {
  constructor(scope: Construct, id: string, props: VergunningsPublicatiePlatformStageProps) {
    super(scope, id, props);
    Tags.of(this).add('cdkManaged', 'yes');
    Tags.of(this).add('Project', Statics.projectName);
    Aspects.of(this).add(new PermissionsBoundaryAspect());

    const dnsStack = new DnsStack(this, 'dns-stack', {
      env: props.configuration.deployToEnvironment,
    });

    const certStack = new CertificateStack(this, 'cert-stack', {
      env: {
        account: props.configuration.deployToEnvironment.account,
        region: 'us-east-1',
      },
      configuration: props.configuration,
    });
    certStack.addDependency(dnsStack, 'hostedzone must exist before certificate is created');

    const vergunningsPublicatiePlatformStack = new VergunningsPublicatiePlatformStack(this, 'vergunnings', {
      env: props.configuration.deployToEnvironment,
      configuration: props.configuration,
    });
    vergunningsPublicatiePlatformStack.addDependency(certStack, 'certificate must be created before use');
    vergunningsPublicatiePlatformStack.addDependency(dnsStack, 'dns must be created before use');
  }
}

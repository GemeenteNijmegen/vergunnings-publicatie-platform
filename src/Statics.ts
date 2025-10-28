export abstract class Statics {
  static readonly projectName: string = 'vergunnings-publicatie-platform';

  // Repo information
  static readonly repository: string = 'vergunnings-publicatie-platform';
  static readonly repositoryOwner: string = 'GemeenteNijmegen';
  static readonly certificateParameter: string = `/${this.projectName}/certificate-arn`;

  // DNS
  static readonly accountRootHostedZonePath: string = '/gemeente-nijmegen/account/hostedzone';
  static readonly accountRootHostedZoneId: string = '/gemeente-nijmegen/account/hostedzone/id';
  static readonly accountRootHostedZoneName: string = '/gemeente-nijmegen/account/hostedzone/name';
  static readonly projectHostedZonePath: string = `/${Statics.projectName}/hostedzone`;
  static readonly projectHostedZoneId: string = `/${Statics.projectName}/hostedzone/id`;
  static readonly projectHostedZoneName: string = `/${Statics.projectName}/hostedzone/name`;
  static readonly projectSubdomain: string = 'vergunningen';

  // Environments
  static readonly gnBuildEnvironment = {
    account: '836443378780',
    region: 'eu-central-1',
  };
  static readonly gnStaticWebsitesEnvironmentProd = {
    account: '654477686593',
    region: 'eu-central-1',
  };

  static readonly gnStaticWebsitesEnvironmentAccp = {
    account: '991246619216',
    region: 'eu-central-1',
  };
}
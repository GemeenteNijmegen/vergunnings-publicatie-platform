import { Statics } from './Statics';

export interface Environment {
  account: string;
  region: string;
}

export interface Configurable {
  configuration: Configuration;
}

export interface Configuration {
  branch: string;
  deployFromEnvironment: Environment;
  deployToEnvironment: Environment;
  domainNamesCloudFront?: string[];
  domainNamesCertificate: {
    domainName: string;
    alternativeNames?: string[];
  };
}

export const configurations: { [key: string]: Configuration } = {
  main: {
    branch: 'main',
    deployFromEnvironment: Statics.gnBuildEnvironment,
    deployToEnvironment: Statics.gnStaticWebsitesEnvironmentProd,
    domainNamesCloudFront: ['vergunnings-publicatie-platform.static-websites.csp-nijmegen.nl'],
    domainNamesCertificate: {
      domainName: 'vergunnings-publicatie-platform.static-websites.csp-nijmegen.nl',
      alternativeNames: undefined,
    },
  },
  acceptance: {
    branch: 'acceptance',
    deployFromEnvironment: Statics.gnBuildEnvironment,
    deployToEnvironment: Statics.gnStaticWebsitesEnvironmentAccp,
    domainNamesCloudFront: ['vergunnings-publicatie-platform.accp.static-websites.csp-nijmegen.nl'],
    domainNamesCertificate: {
      domainName: 'vergunnings-publicatie-platform.accp.static-websites.csp-nijmegen.nl',
      alternativeNames: undefined,
    },
  },
};

export function getConfiguration(branch: string) {
  const configuration = configurations[branch];
  if (!configuration) {
    throw new Error(`No configuration found for branch ${branch}`);
  }
  return configuration;
}
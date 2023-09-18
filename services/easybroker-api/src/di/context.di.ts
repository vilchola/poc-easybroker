import aws from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { getRegion } from '../../../../libs/utils';
import { EasyBrokerService, EasyBrokerServiceImpl } from '../application';
import { ConfigurationRepository, EasyBrokerRepository } from '../domain';
import { ConfigurationRepositoryImpl } from '../infrastructure/ConfigurationRepositoryImpl';
import { EasyBrokerRepositoryImpl } from '../infrastructure/EasyBrokerRepositoryImpl';
import { TYPES } from './TYPES';

export class ContainerContext {
  readonly container: Container;

  constructor() {
    this.container = new Container({ defaultScope: 'Singleton' });
    this.container.bind<ConfigurationRepository>(TYPES.ConfigurationRepository).to(ConfigurationRepositoryImpl);
    this.container.bind<EasyBrokerService>(TYPES.EasyBrokerService).to(EasyBrokerServiceImpl);
    this.container.bind<EasyBrokerRepository>(TYPES.EasyBrokerRepository).to(EasyBrokerRepositoryImpl);
    this.container.bind(TYPES.SecretsManager).toConstantValue(this.secretsManager(getRegion()));
    this.container.bind(TYPES.Ssm).toConstantValue(this.ssm());
  }

  private secretsManager(region?: string): aws.SecretsManager {
    return new aws.SecretsManager({ region });
  }

  private ssm(): aws.SSM {
    return new aws.SSM();
  }
}

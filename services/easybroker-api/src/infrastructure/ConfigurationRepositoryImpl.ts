import aws from 'aws-sdk';
import { ConfigurationRepository } from '../domain';
import { inject, injectable } from 'inversify';
import { Logger } from '../../../../libs/Logger';
import { TYPES } from '../di/TYPES';

@injectable()
export class ConfigurationRepositoryImpl implements ConfigurationRepository {
  private readonly log = new Logger('ConfigurationRepositoryImpl');

  constructor(
    @inject(TYPES.Ssm) private readonly parameters: aws.SSM,
    @inject(TYPES.SecretsManager) private readonly secrets: aws.SecretsManager,
  ) {}

  async getParameter(param: string): Promise<string> {
    const result = await this.parameters.getParameter({ Name: param, WithDecryption: true }).promise();
    this.log.debug('[parameters.getParameter.response]', JSON.stringify(result));

    if (!result.Parameter?.Value) {
      throw new Error(`Parameter not exist: ${param}`);
    }

    return result.Parameter.Value;
  }

  async getSecret(secret: string): Promise<string> {
    const result = await this.secrets.getSecretValue({ SecretId: secret }).promise();
    this.log.debug('[secrets.getSecretValue.response]', JSON.stringify(result));

    if (!result.SecretString) {
      throw new Error(`Secret not exist: ${secret}`);
    }

    return result.SecretString;
  }
}

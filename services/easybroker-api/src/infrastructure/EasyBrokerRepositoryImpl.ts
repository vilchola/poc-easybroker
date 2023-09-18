import axios, { AxiosError, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { Logger } from '../../../../libs/Logger';
import { EASYBROKER_CREDENTIALS, EASYBROKER_URL } from '../constants';
import { TYPES } from '../di/TYPES';
import { ConfigurationRepository, EasyBrokerRepository, Property, ResponseData } from '../domain';

@injectable()
export class EasyBrokerRepositoryImpl implements EasyBrokerRepository {
  private readonly log = new Logger('EasyBrokerRepositoryImpl');

  constructor(@inject(TYPES.ConfigurationRepository) private readonly configuration: ConfigurationRepository) {}

  async getProperties(limit: number, page: number): Promise<ResponseData<Property>> {
    const url = await this.configuration.getParameter(EASYBROKER_URL);
    const easyBrokerCredentials = JSON.parse(
      await this.configuration.getSecret(EASYBROKER_CREDENTIALS),
    ) as EasyBrokerCredentials;
    const config = {
      headers: { 'X-Authorization': easyBrokerCredentials.apiKey },
      mode: 'cors',
      params: { limit: limit, page: page },
    };
    let response: AxiosResponse<ResponseData<Property>>;
    try {
      response = await axios.get<ResponseData<Property>>(url, config);
      this.log.debug('[response.pagination]', JSON.stringify(response.data.pagination, null, 2));

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.log.error('[axios.error]:', JSON.stringify(axiosError, null, 2));
      throw new Error(`[axios.error]: ${axiosError.message}`);
    }
  }
}

interface EasyBrokerCredentials {
  apiKey: string;
}

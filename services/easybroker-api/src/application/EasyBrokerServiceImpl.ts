import { inject, injectable } from 'inversify';
import { TYPES } from '../di/TYPES';
import { EasyBrokerRepository, Property, ResponseData } from '../domain';
import { EasyBrokerService } from './index';

@injectable()
export class EasyBrokerServiceImpl implements EasyBrokerService {
  constructor(@inject(TYPES.EasyBrokerRepository) private easyBrokerRepository: EasyBrokerRepository) {}

  async getProperties(limit: number, page: number): Promise<ResponseData<Property>> {
    const properties = await this.easyBrokerRepository.getProperties(limit, page);
    do {
      const params = properties.pagination.next_page.split('?')[1].split('&');
      const nextLimit = Number(params[0].split('=')[1]);
      const nextPage = Number(params[1].split('=')[1]);
      const nextProperties = await this.easyBrokerRepository.getProperties(nextLimit, nextPage);
      nextProperties.content.forEach((currentProperty) => properties.content.push(currentProperty));
      properties.pagination = nextProperties.pagination;
    } while (properties.pagination.next_page);

    return properties;
  }
}

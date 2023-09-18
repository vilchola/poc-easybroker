import { Property, ResponseData } from './index';

export interface EasyBrokerRepository {
  getProperties(limit: number, page: number): Promise<ResponseData<Property>>;
}

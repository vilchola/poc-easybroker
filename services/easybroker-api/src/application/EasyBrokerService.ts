import 'reflect-metadata';
import { ResponseData, Property } from '../domain';

export interface EasyBrokerService {
  getProperties(limit: number, page: number): Promise<ResponseData<Property>>;
}

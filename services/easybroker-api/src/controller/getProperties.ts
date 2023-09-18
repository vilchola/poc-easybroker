import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '../../../../libs/Logger';
import { toJSON } from '../../../../libs/utils';
import { EasyBrokerService } from '../application';
import { ContainerContext } from '../di/context.di';
import { TYPES } from '../di/TYPES';
import { Metadata } from '../domain';

export const { container } = new ContainerContext();
const log = new Logger('getProperties');

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  log.info('start getProperties');
  if (!event.body) {
    log.info('end getProperties');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  try {
    log.debug('[APIGatewayProxyEvent]', toJSON(event));
    const request = JSON.parse(event.body) as Request;
    const metadata = new Metadata(request.limit, request.page);
    const easyBrokerService: EasyBrokerService = container.get(TYPES.EasyBrokerService);
    const properties = await easyBrokerService.getProperties(metadata.limit, metadata.page);
    log.info('end getProperties');

    return {
      statusCode: 200,
      body: JSON.stringify(properties),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}

interface Request {
  page: number;
  limit: number;
}

require('./init');
import { describe, expect } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '../../../libs/Logger';
import * as getProperties from '../src/controller/getProperties';
import { TYPES } from '../src/di/TYPES';
import { Property, ResponseData } from '../src/domain';

const timeout = 2 * 60 * 1000;
jest.setTimeout(timeout);

const secretsMock = { getSecretValue: jest.fn() };
getProperties.container.rebind(TYPES.SecretsManager).toConstantValue(secretsMock);

const ssmMock = { getParameter: jest.fn() };
getProperties.container.rebind(TYPES.Ssm).toConstantValue(ssmMock);

describe('getProperties', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('testing lambda: getProperties - Bad request', async () => {
    expect.hasAssertions();
    const request = undefined;
    const event = { body: JSON.stringify(request) } as unknown as APIGatewayProxyEvent;
    const response = (await getProperties.handler(event)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(400);
  });

  it('testing lambda: getProperties - Max results per page', async () => {
    expect.hasAssertions();
    const request = { limit: 51, page: 1 };
    const event = { body: JSON.stringify(request) } as unknown as APIGatewayProxyEvent;
    const response = (await getProperties.handler(event)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(500);
  });

  it('testing lambda: getProperties - Get properties successfully', async () => {
    expect.hasAssertions();
    secretsMocks(easyBrokerCredentials);
    ssmMocks(easyBrokerUrl);
    const request = { limit: 50, page: 1 };
    const event = { body: JSON.stringify(request) } as unknown as APIGatewayProxyEvent;
    const response = (await getProperties.handler(event)) as APIGatewayProxyResult;
    const properties = JSON.parse(response.body) as ResponseData<Property>;
    Logger.info("[properties.content.title]:", JSON.stringify(properties.content.map(property => property.title), null, 2));
    expect(response.statusCode).toBe(200);
    expect(properties.pagination.total).toBe(properties.content.length);
  });
});

function secretsMocks(value): void {
  secretsMock.getSecretValue.mockImplementation((param) => {
    return {
      promise(): Promise<unknown> {
        Logger.debug('[secretsMock()] param:', param);
        return Promise.resolve({
          $response: { data: 'SecretsManager mocked successfully' },
          SecretString: value,
        });
      },
    };
  });
}

function ssmMocks(value): void {
  ssmMock.getParameter.mockImplementation((param) => {
    return {
      promise(): Promise<unknown> {
        Logger.debug('[ssmMock()] param:', param);
        return Promise.resolve({
          $response: { data: 'SSM mocked successfully' },
          Parameter: { Value: value },
        });
      },
    };
  });
}

const easyBrokerCredentials = `{"apiKey": "l7u502p8v46ba3ppgvj5y2aad50lb9"}`;
const easyBrokerUrl = 'https://api.stagingeb.com/v1/properties';

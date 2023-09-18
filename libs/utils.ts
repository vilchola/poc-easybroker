import { Logger } from './Logger';

const isTest = process.env['JEST_WORKER_ID'] !== undefined;
const REGION = process.env['REGION'];

let _region: string | undefined = undefined;

export function getVariable(variable: string): string {
  let value = process.env[variable];

  if (!value && isTest) {
    value = `{ "TEST": "[getVariable] ES UN TEST, usar process.env['${variable}'] = 'VALOR_QUE_QUIERES') si quiere forzar un valor" }`;
  } else if (!value) {
    throw new Error(`Variable not exist: ${variable}`);
  }

  return value;
}

export function toJSON(variable: unknown): string {
  return JSON.stringify(variable, null, 2);
}

export function getRegion(): string {
  let region: string;
  if (_region) {
    region = _region;
  } else if (REGION) {
    _region = REGION;
    region = _region;
  } else {
    Logger.error('REGION:', REGION, '_region', _region);
    throw new Error('No se puede obtener la region');
  }

  return region;
}

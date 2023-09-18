export interface ConfigurationRepository {
  getParameter(param: string): Promise<string>;

  getSecret(secret: string): Promise<string>;
}

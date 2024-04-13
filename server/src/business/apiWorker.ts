import fs from 'fs/promises';
import YAML from 'yaml';

import { ProcessingError } from './processingError';

export class ApiWorker {
  constructor() {}

  public getSwaggerSpec = async (): Promise<JSON.JSONObject> => {
    try {
      const swaggerSpec = YAML.parse(
        await fs.readFile('api/0.0.1.yaml', 'utf8')
      );
      return swaggerSpec;
    } catch (error) {
      throw new ProcessingError('Error reading swagger spec');
    }
  };
}

import { ServerAgent } from "@interfaces/serverAgent";

import { Logger } from 'log4js';

import fetch from 'node-fetch';
import https from 'https';


export class ServerAgentImpl implements ServerAgent {
  private hostname: string;
  private port: number;
  private logger: Logger;

  constructor(hostname: string, port: number, logger: Logger) {
    this.hostname = hostname;
    this.port = port;
    this.logger = logger;
  }

  public requestFileTagging = async (id: string): Promise<void> => {
    try {
      const url = `https://${this.hostname}:${this.port}/up-vibe/v1/files/${id}/parse-tags`;

      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      const response = await fetch(url, {
        method: 'POST',
        agent: agent,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status code: ${response.status}`);
      }

    } catch (error) {
      this.logger.error(`Error requesting file tagging: ${error}`);
      throw error;
    }
  };
}

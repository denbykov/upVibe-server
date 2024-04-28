import { UUID } from 'crypto';
import pg from 'pg';

import { DeviceDTO } from '@src/dtos/deviceDTO';
import { TagMappingPriorityDTO } from '@src/dtos/tagMappingPriorityDTO';
import { UserDTO } from '@src/dtos/userDTO';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { SQLManager } from '@src/sqlManager';

export class UserRepository implements iUserDatabase {
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(dbPool: pg.Pool, sqlManager: SQLManager) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
  }

  public async getUserBySub(sub: string): Promise<UserDTO | null> {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getUserBySub');
      const result = await client.query(query, [sub]);

      if (result.rows.length === 0) {
        return null;
      }
      return UserDTO.fromJSON(result.rows[0]);
    } finally {
      client.release();
    }
  }

  public async insertUser(user: UserDTO): Promise<UserDTO> {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertUser');
      const result = await client.query(query, [user.sub, user.name]);
      return UserDTO.fromJSON(result.rows[0]);
    } finally {
      client.release();
    }
  }

  public async getDevice(id: UUID): Promise<DeviceDTO | null> {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getDevice');
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return DeviceDTO.fromJSON(result.rows[0]);
    } finally {
      client.release();
    }
  }

  public async insertDevice(device: DeviceDTO): Promise<DeviceDTO> {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertDevice');
      const result = await client.query(query, [
        device.id,
        device.user_id,
        device.name,
      ]);

      return DeviceDTO.fromJSON(result.rows[0]);
    } finally {
      client.release();
    }
  }

  public async insertDefaultTagMappingPriority(
    tagMappingPriorityDTO: TagMappingPriorityDTO
  ): Promise<void> {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertTagMappingPriority');
      for (let i = 0; i < tagMappingPriorityDTO.source.length; i++) {
        await client.query(query, [
          tagMappingPriorityDTO.userId,
          tagMappingPriorityDTO.source[i],
          tagMappingPriorityDTO.title[i],
          tagMappingPriorityDTO.artist[i],
          tagMappingPriorityDTO.album[i],
          tagMappingPriorityDTO.picture[i],
          tagMappingPriorityDTO.year[i],
          tagMappingPriorityDTO.trackNumber[i],
        ]);
      }
    } finally {
      client.release();
    }
  }
}

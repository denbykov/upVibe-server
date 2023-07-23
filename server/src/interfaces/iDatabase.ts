import { RefreshToken } from '@src/entities/refreshToken';
import { AcceessToken } from '@src/entities/accessToken';
import { User } from '@src/entities/user';

export abstract class IDatabase {
  public abstract findUserByName(username: string): Promise<User | null>;
  public abstract findUserById(id: number): Promise<User | null>;
  public abstract findRefreshTokenId(
    refreshToken: string
  ): Promise<number | null>;
  public abstract findAccessToken(token: string): Promise<AcceessToken | null>;
  public abstract findRefreshToken(token: string): Promise<RefreshToken | null>;
  public abstract findTokenById(id: number): Promise<AcceessToken | null>;
  public abstract findAccessTokenByRefreshTokenId(
    token: number
  ): Promise<AcceessToken | null>;
  public abstract insertRefreshToken(
    refreshToken: string,
    userId: number
  ): Promise<number>;
  public abstract insertAccessToken(
    userId: number,
    accessToken: string,
    refreshTokenId: number
  ): Promise<number>;
  public abstract deleteAccessToken(token: string): void;
  public abstract deleteRefreshToken(token: string): void;
}

import { AccessToken } from '@src/entities/accessToken';
import { RefreshToken } from '@src/entities/refreshToken';
import { User } from '@src/entities/user';

export abstract class IAuthorizationDatabase {
  public abstract findUserByName(name: string): Promise<User | null>;
  public abstract findRefreshTokenId(
    refreshToken: string
  ): Promise<number | null>;
  public abstract findAccessToken(token: string): Promise<AccessToken | null>;
  public abstract findRefreshToken(token: string): Promise<RefreshToken | null>;
  public abstract findAccessTokenByRefreshTokenId(
    tokenId: number
  ): Promise<AccessToken | null>;
  public abstract findRefreshTokenByParentId(
    parentId: number
  ): Promise<RefreshToken | null>;
  public abstract insertRefreshToken(
    refreshToken: RefreshToken
  ): Promise<number>;
  public abstract insertAccessToken(accessToken: AccessToken): Promise<number>;
  public abstract updateRefreshToken(
    newRefreshToken: RefreshToken,
    refreshToken: RefreshToken
  ): Promise<number>;
  public abstract updateAccessToken(accessToken: AccessToken): Promise<void>;
  public abstract deleteAccessToken(id: number): Promise<void>;
  public abstract deleteRefreshToken(id: number): Promise<void>;
}

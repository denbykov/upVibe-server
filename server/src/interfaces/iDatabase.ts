import { User } from "@src/entities/user";
import { RefreshToken, Token } from "@src/entities/token";

export abstract class IDatabase {
  public abstract findUserByName(username: string): Promise<User | null>;
  public abstract findUserById(id: number): Promise<User | null>;
  public abstract findRefreshTokenId(
    refreshToken: string
  ): Promise<number | null>;
  public abstract findToken(
    token: string,
    type: string
  ): Promise<Token | RefreshToken | null>;
  public abstract findTokenById(id: number): Promise<Token | null>;
  public abstract findTokenByRefreshToken(token: number): Promise<Token | null>;
  public abstract insertRefreshToken(refreshToken: string): Promise<number>;
  public abstract insertToken(
    userId: number,
    accessToken: string,
    refreshTokenId: number
  ): void;
  public abstract updateToken(
    refreshTokenId: number,
    accessToken: string
  ): void;
  public abstract deleteToken(token: string, type: string): void;
  public abstract closeConnection(): void;
}

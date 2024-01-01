import { User } from '@src/entities/user';

declare namespace Express {
  type Request = {
    user: User;
  };
}

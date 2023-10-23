import { IUser } from '../models/users/user.mongo';

export const hideSensetiveUserData = (data: IUser): Partial<IUser> => {
  const { email, username, role } = data;

  return {
    email,
    username,
    role,
  };
};

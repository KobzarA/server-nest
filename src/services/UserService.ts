import UserModel, { IUser } from '../models/users/user.mongo';

class UserService {
  static async getOne(username: string) {
    return UserModel.findOne({ username }, [
      'email',
      'username',
      'role',
      '-_id',
    ]).exec();
  }

  static async getAll() {
    return UserModel.find({}, ['email', 'username', 'role', '-_id']).sort({
      createdAt: -1,
    });
  }

  static async create(data: Omit<IUser, 'salt'>) {
    const isUsernameUsed = await UserModel.exists({
      username: data.username,
    });
    if (isUsernameUsed) throw new Error('Username already used');
    const isEmailUsed = await UserModel.exists({ email: data.email });
    if (isEmailUsed) throw new Error('Email already used');

    const user = new UserModel(data);
    return user.save();
  }

  static async remove(username: string) {
    const isUsernameExist = await UserModel.exists({
      username: username,
    });
    if (!isUsernameExist) throw new Error('Username does`nt exists');
    return UserModel.deleteOne({ username }).exec();
  }

  static async update(username: string, data: IUser) {
    let user = await UserModel.findOne({ username });
    if (!user) return false;
    for (let key in data) {
      // @ts-ignore comment
      user[key] = data[key];
    }
    return user.save();
  }

  static async authenticate(username: string, password: string) {
    const maybeUser = await UserModel.findOne({ username });
    if (!maybeUser) return false;
    const validPassword = await maybeUser.comparePassword(password);
    if (!validPassword) return false;
    return maybeUser;
  }
}

export default UserService;

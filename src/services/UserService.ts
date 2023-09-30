import UserModel, { IUser } from '../models/users/user.mongo';

class UserService {
  static async getOne(userId: string) {
    return UserModel.findById(userId).exec();
  }

  static async getAll() {
    return UserModel.find({}).sort({ createdAt: -1 });
  }

  static async create(data: Omit<IUser, 'salt'>) {
    const user = new UserModel(data);
    return user.save();
  }

  static async remove(id: string) {
    return UserModel.deleteOne({ _id: id }).exec();
  }

  static async update(id: string, data: IUser) {
    let user = await UserModel.findById(id);
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

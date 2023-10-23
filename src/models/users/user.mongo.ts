// this code was modified from learning course NodeJS Microservices

import mongoose, {
  Schema,
  Model,
  Document,
  Types,
  _FilterQuery,
  HydratedDocument,
} from 'mongoose';
import crypto from 'crypto';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'client' | 'admin' | 'manager';
  salt?: string;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods...
type TUserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, TUserModel, IUserMethods>(
  {
    username: {
      // Trim and lowercase
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      // Trim and lowercase
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'client',
      lowercase: true,
      trim: true,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre<HydratedDocument<IUser>>(
  ['save', 'findOneAndUpdate'],
  //   'save',
  { document: true, query: true },
  function preSave(next: Function) {
    const user = this;

    if (user.isModified('password')) {
      // Generating a random salt for each user
      return crypto.randomBytes(16, (err, salt) => {
        if (err) return next(err);

        const saltHex = salt.toString('hex');
        user.salt = saltHex;

        // Using PBKDF2 to hash the password
        return crypto.pbkdf2(
          user.password,
          salt,
          100000,
          64,
          'sha512',
          (pkerr, derivedKey) => {
            if (pkerr) return next(pkerr);
            user.password = derivedKey.toString('hex');
            return next();
          }
        );
      });
    }
    return next();
  }
);

UserSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string
) {
  return new Promise((resolve, reject) => {
    // Using PBKDF2 to hash the candidate password and then compare it with the stored hash
    crypto.pbkdf2(
      candidatePassword,
      Buffer.from(this.salt, 'hex'),
      100000,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex') === this.password);
      }
    );
  });
};
const UserModel = mongoose.model('User', UserSchema);
export default UserModel;

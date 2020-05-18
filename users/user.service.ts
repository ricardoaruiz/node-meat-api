import { DocumentQuery, Query } from 'mongoose';
import User, { UserDocument } from './users.model';

export default class UserService {

    find(): DocumentQuery<UserDocument[], UserDocument, {}> {
        return User.find()
    }

    findById(id: number): DocumentQuery<UserDocument | null, UserDocument, {}> {
        return User.findById(id);
    }

    create(user: UserDocument): Promise<UserDocument> {
        return User.create(new User(user));
    }

    update(id: number, user: UserDocument): Promise<any> {
        const options = { overwrite: true };
        return User.update({ _id: id }, user, options).exec();
    }

    partialUpdate(id: number, user: UserDocument): Query<any> {
        const options = { new: true };
        return User.findByIdAndUpdate(id, user, options);
    }

    delete(id: number): DocumentQuery<UserDocument | null, UserDocument, {}> {
        return User.findByIdAndDelete(id);
    }

}
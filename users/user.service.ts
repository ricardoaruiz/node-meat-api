import { DocumentQuery, Query } from 'mongoose';
import User, { UserDocument } from './users.model';

export default class UserService {

    /**
     * Faz a busca dos usuários
     */
    find(): DocumentQuery<UserDocument[], UserDocument, {}> {
        return User.find()
    }

    /**
     * Busca um usuário pelo id
     * @param id 
     */
    findById(id: number): DocumentQuery<UserDocument | null, UserDocument, {}> {
        return User.findById(id);
    }

    /**
     * Cria um novo usuário na base de dados.
     * @param user 
     */
    create(user: UserDocument): Promise<UserDocument> {
        return User.create(new User(user));
    }

    /**
     * Faz a alteração completa ou parcial de um usuário (completa => overwrite = true, parcial => overwrite = false)
     * @param id => id do usuário
     * @param user => dados do usuário
     * @param overwrite => se false os campos não informados serão passados para null 
     *                     se true os campos não informados não serão alterados
     */
    update(id: number, user: UserDocument, overwrite = true): Query<any> {
        const options = { runValidators: true, overwrite };
        return User.findByIdAndUpdate(id, user, options);
    }

    /**
     * Remove um usuário
     * @param id 
     */
    delete(id: number): DocumentQuery<UserDocument | null, UserDocument, {}> {
        return User.findByIdAndRemove(id);
    }

}
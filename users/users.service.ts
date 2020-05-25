import { UnprocessableEntityError } from 'restify-errors';
import User, { UserDocument, UserFilter } from './users.model';

export default class UserService {

    /**
     * Faz a busca dos usuários
     */
    find(filter?: UserFilter): Promise<UserDocument[]> {
        return User.find(this.buildUserFilter(filter))
            .then(docs => docs);
    }

    /**
     * Busca um usuário pelo id
     * @param id 
     */
    findById(id: number): Promise<UserDocument | null> {
        return User.findById(id).then(doc => doc);
    }

    /**
     * Cria um novo usuário na base de dados.
     * Caso já o email informado esteja em uso retorna HTTP Code 422 informando a inconsistência
     * @param user 
     */
    async create(user: UserDocument): Promise<UserDocument> {
        const foundUser = await User.findOne({ email: user.email });

        if (foundUser) 
            throw new UnprocessableEntityError('Email informado já está em uso');

        return User.create(new User(user));
    }

    /**
     * Faz a alteração completa ou parcial de um usuário (completa => overwrite = true, parcial => overwrite = false)
     * @param id => id do usuário
     * @param user => dados do usuário
     * @param overwrite => se false os campos não informados serão passados para null 
     *                     se true os campos não informados não serão alterados
     */
    async update(id: number, user: UserDocument, overwrite = true): Promise<UserDocument | null> {
        const foundUser = await User.findOne({ _id: { '$ne': id }, email: user.email, })

        if (foundUser) 
            throw new UnprocessableEntityError('Email informado já está em uso');

        const options = { runValidators: true, new: true, overwrite };
        return User.findByIdAndUpdate(id, user, options).then(doc => doc);
    }

    /**
     * Remove um usuário
     * @param id 
     */
    delete(id: number): Promise<UserDocument | null> {
        return User.findByIdAndRemove(id).then(doc => doc);
    }

    private buildUserFilter(filter?: UserFilter): UserFilter {
        const userFilter: UserFilter = {};

        if (filter) {
            if (filter.email) {
                userFilter.email = { '$regex': filter.email, '$options': 'i' };
            }
        }

        return userFilter;
    }

}
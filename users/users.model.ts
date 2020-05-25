import mongoose from 'mongoose';
import { validateCPF } from '../common/validators'
import crypto from '../common/crypto';

export interface UserDocument extends mongoose.Document {
    id?: string,
    name: string,
    email: string,
    password: string,
    gender?: string,
    cpf?: string,
}

// Create schema
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3,
    },
    email: { 
        type : String,
        unique: true,
        required: true,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    },
    password: { 
        type: String,
        select: false, //indica que não será exibido nas consultas
        required: true,
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male','Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH} Invalid CPF ({VALUE})'
        }
    }
});

/**
 * Criptografa a senha do usuário
 * @param obj 
 * @param next 
 */
const hashPassword = (obj: any, next: any) => {
    crypto(obj.password)
    .then(hash => {
        obj.password = hash;
        next();
    })
    .catch(next);
}

// Não usar arrow function pois precisamos da referência de this do documento
// Nesse caso this é referência para o documento
const saveMiddleware = function(this: any, next: any) {
    const user: UserDocument = this;

    if(!user.isModified('password')) {
        next();
    } else {
        hashPassword(user, next);
    }
};

// Não user arrow function pois precisamos da referência de this da query em questão
// Nesse caso this é referência para a query
const updateMiddleware = function (this: any, next: any) {  
    if(!this.getUpdate().password) {
        next();
    } else {
        hashPassword(this.getUpdate(), next);
    }
}

export interface UserFilter {
    email?: string | Object
}

// Mongoose middlewares.
userSchema.pre('save', saveMiddleware);
userSchema.pre('update', updateMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);

// Create and export model
export default mongoose.model<UserDocument>('User', userSchema);
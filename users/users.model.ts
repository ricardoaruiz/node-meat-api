import mongoose from 'mongoose';
import { validateCPF } from '../common/validators'
import crypto from '../common/crypto';

export interface UserDocument extends mongoose.Document {
    name: string,
    email: string,
    password: string
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
        select: false,
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

// Mongoose middleware.
// Esse middleware será executado imediatamente antes da inclusão de um documento
// do tipo UserDocument e fará a criptografia da senha
// Não usar arrow function pois precisamos da referência de this do documento
userSchema.pre('save', function (next) {
    const user: any = this;
    
    if(!user.isModified('password')) {
        next();
    } else {
        crypto(user.password)
            .then(hash => {
                user.password = hash;
                next();
            })
            .catch(next);
    }
})

// Create and export model
const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
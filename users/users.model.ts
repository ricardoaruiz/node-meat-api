import mongoose from 'mongoose';

interface UserDocument extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

// Create schema
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type : String, unique: true },
    password: { type: String, select: false },
});

// Create and export model
const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
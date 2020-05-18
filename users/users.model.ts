import mongoose from 'mongoose';

// Create schema
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type : String, unique: true },
    password: { type: String, select: false },
});

// Create and export model
const User = mongoose.model('User', userSchema);

export default User;
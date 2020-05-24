import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from './../users/users.model';
import { RestaurantDocument } from './../restaurants/restaurants.model';

export interface ReviewDocument extends Document {
    date: Date;
    rating: number;
    comments: string;
    restaurant: mongoose.Types.ObjectId | RestaurantDocument;
    user: mongoose.Types.ObjectId | UserDocument;
}

const reviewSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model<ReviewDocument>('Review', reviewSchema);
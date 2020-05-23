import mongoose, { Document, Schema } from 'mongoose';

export interface RestaurantDocument extends Document {
    name: string;
    menu: MenuItemDocument[];
};

export interface MenuItemDocument extends Document {
    name: string;
    price: number;
};

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false, // indica que não será exibido nas consultas
        default: []
    }
});

export default mongoose.model<RestaurantDocument>('Restaurant', restaurantSchema);

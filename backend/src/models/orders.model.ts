import mongoose, { Schema, Document } from 'mongoose';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface IOrderItem {
  part:     mongoose.Types.ObjectId;
  quantity: number;
  price:    number;   // snapshot price at time of order
}

export interface IOrder extends Document {
  user:      mongoose.Types.ObjectId;
  build?:    mongoose.Types.ObjectId;   // optional — if ordered from a saved build
  items:     IOrderItem[];
  totalAmount: number;
  status:    OrderStatus;
  paymentId: string;   // from payment gateway
  address:   {
    street: string;
    city:   string;
    state:  string;
    zip:    string;
    country: string;
  };
}

const OrderSchema = new Schema<IOrder>({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  build:   { type: Schema.Types.ObjectId, ref: 'Build' },
  items: [{
    part:     { type: Schema.Types.ObjectId, ref: 'Part', required: true },
    quantity: { type: Number, required: true },
    price:    { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ORDER_STATUSES, default: 'pending' },
  paymentId:   { type: String },
  address:     { street: String, city: String, state: String, zip: String, country: String },
}, { timestamps: true });
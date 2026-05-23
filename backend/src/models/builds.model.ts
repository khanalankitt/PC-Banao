import mongoose, { Schema } from "mongoose";

export interface IBuildComponents {
  cpu?:         mongoose.Types.ObjectId;
  gpu?:         mongoose.Types.ObjectId;
  motherboard?: mongoose.Types.ObjectId;
  ram?:         mongoose.Types.ObjectId[];  // up to 4 sticks
  storage?:     mongoose.Types.ObjectId[];  // multiple drives
  psu?:         mongoose.Types.ObjectId;
  case?:        mongoose.Types.ObjectId;
  cooler?:      mongoose.Types.ObjectId;
}

export interface IBuild extends Document {
  user:           mongoose.Types.ObjectId;
  name:           string;
  components:     IBuildComponents;
  totalPrice:     number;
  totalWattage:   number;           // computed field
  isCompatible:   boolean;
  compatibilityIssues: string[];    // e.g. ["CPU socket mismatch"]
  isPublic:       boolean;
  aiSuggested:    boolean;
}

const BuildSchema = new Schema<IBuild>({
  user:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, default: 'My Build' },
  components: {
    cpu:         { type: Schema.Types.ObjectId, ref: 'Part' },
    gpu:         { type: Schema.Types.ObjectId, ref: 'Part' },
    motherboard: { type: Schema.Types.ObjectId, ref: 'Part' },
    ram:         [{ type: Schema.Types.ObjectId, ref: 'Part' }],
    storage:     [{ type: Schema.Types.ObjectId, ref: 'Part' }],
    psu:         { type: Schema.Types.ObjectId, ref: 'Part' },
    case:        { type: Schema.Types.ObjectId, ref: 'Part' },
    cooler:      { type: Schema.Types.ObjectId, ref: 'Part' },
  },
  totalPrice:          { type: Number, default: 0 },
  totalWattage:        { type: Number, default: 0 },
  isCompatible:        { type: Boolean, default: false },
  compatibilityIssues: [{ type: String }],
  isPublic:            { type: Boolean, default: false },
  aiSuggested:         { type: Boolean, default: false },
}, { timestamps: true });
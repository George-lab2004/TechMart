import mongoose, { Document, Schema } from "mongoose"

const AddressSchema = new Schema({
  streetNumber:     { type: String },
  buildingNumber:   { type: String },
  floorNumber:      { type: String },
  apartmentNumber:  { type: String },
  city:             { type: String },
  country:          { type: String },
  landmark:         { type: String },
  notes:            { type: String },
  postalCode : {type:Number}
})

const DeliverySchema = new Schema({
  address: { type: [AddressSchema] },
  phone:   { type: String },
})

const UserSchema = new Schema<IUser>(
  {
    name:           { type: String, required: true },
    email:           { type: String, required: true, unique:true },

    password:       { type: String, required: true },
    confirmedEmail: { type: Boolean, default: false },
    delivery:       { type: [DeliverySchema] },
    isAdmin:{type:Boolean, default:false, required:true}
  },
  {
    timestamps: true,
  }
)

export interface IUser extends Document {
  name:           string
  password:       string
  email:          string
  confirmedEmail: boolean
  isAdmin:boolean
  delivery:       {
    address: {
      streetNumber?:    string
      buildingNumber?:  string
      floorNumber?:     string
      apartmentNumber?: string
      city?:            string
      country?:         string
      landmark?:        string
      notes?:           string
      postalCode?: number
    }[]
    phone?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const User = mongoose.model<IUser>("User", UserSchema)

export default User

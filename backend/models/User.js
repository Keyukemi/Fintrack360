import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  account_name: { type: String, required: true },
  account_number: { type: String, required: true },
  account_type: { type: String, required: true },
  account_designation: { type: String, required: true },
  institution: {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    bank_code: { type: String, required: true }
  }
});

const userSchema = new mongoose.Schema({
  bvn: { type: String, required: true },
  amount: { type: String, required: false },
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  dob: { type: Date, required: false },
  phoneNumber1: { type: String, required: false },
  phoneNumber2: { type: String, required: false },
  registrationDate: { type: Date, required: false },
  email: { type: String, required: false },
  gender: { type: String, required: false },
  lgaOfOrigin: { type: String, required: false },
  lgaOfResidence: { type: String, required: false },
  maritalStatus: { type: String, required: false },
  nin: { type: String, required: false },
  stateOfOrigin: { type: String, required: false },
  stateOfResidence: { type: String, required: false },
  watchListed: { type: Boolean, required: false },
  photoId: { type: String, required: false },
  accounts: [accountSchema],
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

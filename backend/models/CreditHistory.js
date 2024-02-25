import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define nested schemas for deeply nested structures
const repaymentScheduleSchema = new Schema({}, { strict: false });

const historySchema = new Schema({
  date_opened: String,
  opening_balance: Number,
  currency: String,
  performance_status: String,
  tenor: Schema.Types.Mixed, // Mixed type for flexibility
  closed_date: String,
  loan_status: String,
  repayment_frequency: String,
  repayment_amount: Number,
  repayment_schedule: [repaymentScheduleSchema]
});

const creditHistorySchema = new Schema({
  institution: String,
  history: [historySchema]
});

const addressHistorySchema = new Schema({
  address: String,
  type: String,
  date_reported: String
});

const identificationSchema = new Schema({
  type: String,
  no: String
});

const profileSchema = new Schema({
  full_name: String,
  date_of_birth: String,
  address_history: [addressHistorySchema],
  email_address: [String],
  phone_number: [String],
  gender: String,
  identifications: [identificationSchema]
});

// Main schema
const reportSchema = new Schema({
  status: String,
  message: String,
  data: {
    providers: [String],
    profile: profileSchema,
    credit_history: [creditHistorySchema]
  }
});

const Report = mongoose.model('Report', reportSchema);

export default Report

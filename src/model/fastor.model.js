const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    courseInterest: {
        type: String,
        required: true,
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null,
    },
});


const Employee = mongoose.model('employee', employeeSchema);
const Enquiry = mongoose.model('enquiry', enquirySchema);

module.exports = {
    Employee,Enquiry
};
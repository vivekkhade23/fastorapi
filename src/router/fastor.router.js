const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee, Enquiry } = require('../model/f.model');
const fastor = express.Router();

fastor.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({ email, password: hashedPassword });
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred for employee registation.' });
  }
});

fastor.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).send({ error: 'Invalid Invalid credential.' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid credential.' });
    }

    const token = jwt.sign({ email: employee.email }, 'your-secret-key');
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred in login.' });
  }
});

fastor.post('/enquiries', async (req, res) => {
  try {
    const { name, email, courseInterest } = req.body;

    const enquiry = new Enquiry({ name, email, courseInterest });
    await enquiry.save();
    res.status(200).send({ message: 'Enquiry created successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred in enquiry submission.' });
  }
});

fastor.put('/enquiries/:enquiryId/claim', async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { email } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found.' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      enquiryId,
      { claimedBy: employee._id },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).send({ error: 'Enquiry not found.' });
    }

    res.send({ message: 'Enquiry claimed successfully.' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while claiming the enquiry.' });
  }
});

fastor.get('/enquiries/unclaimed', async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: null });

    res.send(enquiries);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching unclaimed enquiries.' });
  }
});

fastor.get('/enquiries/claimed', async (req, res) => {
  try {
    const { email } = req.user;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found.' });
    }

    const enquiries = await Enquiry.find({ claimedBy: employee._id });

    res.send(enquiries);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching claimed enquiries.' });
  }
});

module.exports = fastor;

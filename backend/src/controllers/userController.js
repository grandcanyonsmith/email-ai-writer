const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const userController = {
  async signup(req, res) {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation error', details: error.details });
    const { email, password } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });
      const hashed = await hashPassword(password);
      const user = await prisma.user.create({ data: { email, password: hashed } });
      const token = signToken({ userId: user.id, email: user.email });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Signup failed', message: err.message });
    }
  },
  async login(req, res) {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation error', details: error.details });
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await comparePassword(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = signToken({ userId: user.id, email: user.email });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', message: err.message });
    }
  },
  async me(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ user: { id: req.user.userId, email: req.user.email } });
  }
};

module.exports = userController; 
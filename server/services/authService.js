// const {PrismaClient} = require('../generated/prisma');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (email, password) => {
    const user = await prisma.accounts.findUnique({where: {email}});
    if (!user) {
        throw new Error('The account does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Incorrect password');
    }
    const token = jwt.sign(
        { userId: user.userId.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );


    return {
        token,
        user: {
            userId: user.userId.toString()
        }
    }

}

const register = async (email, password, phoneNumber, name, date) => {
    const existing = await prisma.accounts.findFirst({
        where: {
          OR: [
            { email: email },
            { phoneNumber: phoneNumber }
          ]
        }
    });
    if (existing) {
        throw new Error('The account already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.accounts.create({
        data: {
            email,
            passwordHash,
            phoneNumber,
            name,
            date: new Date(date)
        }
    })

    const token = jwt.sign(
        { userId: user.userId.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

    return {
        token,
        user: {
            userId: user.userId.toString()
        }
    }
}

module.exports = {login, register}
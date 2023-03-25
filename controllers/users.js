import { prisma } from "../index.js";
import axios from "axios";

export async function createUser(req, res) {
  const {
    email,
    fullName,
    address,
    phoneNumber,
    password,
    userType,
    isProfileCompleted,
    isAvailable
  } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        address,
        phoneNumber,
        password,
        userType,
        isProfileCompleted,
        isAvailable
      },
    });

    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create user.' });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    delete user.password
    res.json({ message: 'Login successful.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to login.' });
  }
}

export async function updateRecord(req, res) {
  const { id } = req.body;
  console.log(id);
  const {
    criminalRecord,
    isInsured,
    insuranceCompany,
    carName,
    carModel,
    carRegisteration,
  } = req.body;

  try {
    const updatedRecord = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        criminalRecord,
        isInsured,
        insuranceCompany,
        carName,
        carModel,
        carRegisteration,
        isProfileCompleted:true,
        isAvailable:false,
      },
    });

    const user=await prisma.user.findUnique({
      where:{
        id:parseInt(id)
      }
    })
    delete user.password
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update record.' });
  }
}
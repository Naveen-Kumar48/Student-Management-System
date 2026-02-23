import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        // checking the user exist or not
        const Userexists = await User.findOne({
            email: email
        })
        if (Userexists) return res.status(400).json({
            message: "User already exist"
        })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({
            message: "User Created Succesfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//*login user Jwt


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



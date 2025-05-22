import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mendapatkan semua data User
export const getUser = async (req, res) => {
    try {
        if (req.params.id) {
            const user = await User.findOne({ where: { id_user: req.params.id } });
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
            return res.status(200).json(user);
        }
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// Menambahkan data User baru
export const register = async (req, res) => {
    try {
        const { nama_user, email, password, nomor_telepon, alamat, role = "Penyewa" } = req.body;

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Email already registered" 
            });
        }

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10); // Use a higher salt rounds for stronger security

        // Create new user
        const newUser = await User.create({
            nama_user,
            email,
            password: encryptedPassword,
            nomor_telepon,
            alamat,
            refresh_token: null,
            role
        });

        // Return success but don't include password in response
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        res.status(201).json({
            status: "Success",
            message: "Registration successful",
            data: userWithoutPassword
        });
    } catch (error) {
        console.log(error.message);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
      const user = await User.findOne({
        where: { email }
      });
  
      if (!user) {
        return res.status(400).json({ status: "Error", message: "Invalid email or password" });
      }
  
      // Compare passwords
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(400).json({ status: "Error", message: "Invalid email or password" });
      }
  
      // Prepare user data (exclude sensitive fields)
      const userPlain = user.toJSON();
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;
  
      // Generate access token
      const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s"
      });
  
      // Generate refresh token
      const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d"
      });
  
      // Update user refresh token in DB
      await User.update(
        { refresh_token: refreshToken },
        { where: { id_user: user.id_user } }
      );
  
      // Set refresh token in cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Make sure it's not accessible from JavaScript
        sameSite: "None", // Required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: true, // Set to true only for HTTPS
      });
  
      res.status(200).json({
        status: "Success",
        message: "Login successful",
        data: safeUserData,
        accessToken,
      });
    } catch (error) {
        console.log(error.message);
    }
}

// Mengupdate data User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.update(req.body, {
            where: { id_user: id }
        });
        res.status(200).json({ message: 'User berhasil diupdate' });
    } catch (error) {
        console.log(error.message);
    }
}

// Menghapus data User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({
            where: { id_user: id }
        });
        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.log(error.message);
    }
}

import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const refreshToken = async (req, res) => {
  try {
    // Ambil refresh token dari cookies (atau bisa dari header)
    const refreshToken = req.cookies.refreshToken;

    // Periksa apakah refresh token tersedia
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token diperlukan" });
    }

    // Cari user yang terhubung dengan refresh token
    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    // Jika user tidak ditemukan atau refresh token tidak sesuai
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    // Verifikasi refresh token (untuk memastikan masih valid)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token tidak valid" });
      }

      // Generate access token baru
      const newAccessToken = jwt.sign(
        { id_user: user.id_user, email: user.email, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "120s" } // Atur waktu kadaluarsa sesuai kebutuhan
      );

      // Opsional: Anda bisa menghasilkan refresh token baru jika diperlukan
      const newRefreshToken = jwt.sign(
        { id_user: user.id_user, email: user.email, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" } // Atur waktu kadaluarsa untuk refresh token
      );

      // Update refresh token di database (opsional, jika refresh token baru dibuat)
      user.refresh_token = newRefreshToken;
      user.save();

      // Set refresh token baru ke cookies
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
        secure: true, // hanya izinkan cookies melalui https
      });

      // Kirimkan access token baru
      res.status(200).json({
        status: "Berhasil",
        message: "Access token baru berhasil dibuat",
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
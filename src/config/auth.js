const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { credential } = req.body;
  console.log("🚀 ~ googleLogin ~ credential:", credential);

  try {
    // Xác thực token từ Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Tìm kiếm người dùng trong DB
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        name,
        email,
        avatar: picture,
      });
      await user.save();
    }

    // Trả về thông tin người dùng
    res.status(200).json({ user: { ...user._doc, avatar: user.avatar } });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = { googleLogin };

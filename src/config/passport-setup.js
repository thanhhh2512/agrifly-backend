// config/passport-setup.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User"); // Đảm bảo bạn đã định nghĩa model User

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback", // URL callback sau khi xác thực thành công
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm người dùng trong cơ sở dữ liệu
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser); // Trả về người dùng đã tồn tại
        }

        // Nếu không tồn tại, tạo người dùng mới
        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
        }).save();

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Định nghĩa cách lưu và lấy thông tin người dùng từ session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

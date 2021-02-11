import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getjoin = (req, res) => {
  res.render("join");
};
export const postjoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join");
  } else {
    try {
      const user = await User({ name, email });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getlogin = (req, res) => res.render("login");
export const postlogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(accessToken, refreshToken, profile, cb);
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};
export const logout = (req, res) => {
  // res.render("logout");
  req.logout();
  res.redirect(routes.home);
};
export const getMe = (req, res) => {
  console.log(req.user);
  res.render("userDetail", { user: req.user });
};
export const changePassword = (req, res) => res.render("changePassword");

export const getEditProfile = (req, res) => res.render("editProfile");
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
    user: { _id: id },
  } = req;

  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById({ _id: id }).populate("videos");
    console.log(user);
    res.render("userDetail", { user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postChangePassword = (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(routes.changePassword);
    } else {
      req.user.changePassword(oldPassword, newPassword);
      res.redirect(routes.me);
    }
  } catch (error) {
    res.redirect(routes.changePassword);
  }
};
export const getChangePassword = (req, res) => {
  res.render("changePassword");
};

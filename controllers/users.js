const User = require("../models/user");

const renderRegister = (req, res) => {
  res.render("users/register");
};

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Login successfully");
        return res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

const renderLogin = (req, res) => {
  console.log("from render", req.session);
  res.render("users/login");
};

const afterLogin = (req, res) => {
  req.flash("success", "Successfully login");
  console.log(req.session.returnTo);
  const url = req.session.returnTo || "/campgrounds";
  res.redirect(url);
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Good bye!");
    res.redirect("/login");
  });
};

module.exports = { renderRegister, register, renderLogin, afterLogin, logout };

import jwt from "jsonwebtoken";
require("dotenv").config({ path: ".env" });
const bcrypt = require("bcryptjs");

export default class UserController {
  login = async (req) => {
    const { email, password, accountId } = req.body;
    const User = await req.body.db.model("User");
    let defaultAccountId;

    User.findOne({ email }, (err, user) => {
      if (err || !user)
        return { error: `Couldn't find user with email ${email}`, status: 404 };
      bcrypt.compare(password, user.password, (error, valid) => {
        if (error)
          return { error: `Error checking user password`, status: 500 };
        if (!valid) return { error: `Password is invalid`, status: 403 };
        else {
          if (!user.accounts)
            return { error: "User has no accounts", status: 403 };
          else if (!accountId) defaultAccountId = user.accounts[0];
          else if (!user.accounts.includes(accountId))
            return {
              error: "User doesn't have access to that account",
              status: 403,
            };

          const token = jwt.sign(
            {
              email: user.email,
              id: user._id,
              accountId: accountId ? accountId : defaultAccountId,
            },
            SECRET,
            {
              expiresIn: 60 * 60 * 10,
            }
          );
          return {
            token,
            permissions:
              user.permissions[accountId ? accountId : defaultAccountId],
          };
        }
      });
    });
  };

  //get a user by id
  get = async (req) => {
    const { id } = req.query;

    const User = await req.body.db.model("User");

    if (id)
      User.findById(id ? id : req.user.id, (err, user) => {
        if (err) return { error: "Error getting user", status: 501 };
        else if (!user) return { error: "User not found", status: 404 };
        else {
          return { user };
        }
      });
  };

  //get a list of users with optional search
  list = async (req) => {
    const { firstName, lastName, email } = req.query;

    const User = await req.body.db.model("User");

    let params = {};
    if (firstName) params.firstName = "/" + firstName + "/i";
    if (lastName) params.lastName = "/" + lastName + "/i";
    if (email) params.email = "/" + email + "/i";

    User.find({ $and: params }, (err, users) => {
      if (err) return { error: "Error searching users", status: 501 };
      else if (!users) return { error: "No Users found", status: 404 };
      else
        return {
          users: users.filter((user) =>
            user.accounts.includes(req.user.accountId)
          ),
        };
    });
  };

  create = async (req) => {
    const { firstName, lastName, email, password } = req.body;

    const User = await req.body.db.model("User");

    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return { error: "Error setting password", status: 500 };
      else {
        user.password = hash;
        user.save((err, newUser) => {
          if (err) return { error: "Error saving user", status: 500 };
          else {
            return { user: newUser };
          }
        });
      }
    });
  };

  update = async (req) => {
    const { id, firstName, lastName, email } = req.body;

    const User = await req.body.db.model("User");

    User.findById(id, (err, user) => {
      if (err) return { error: "Error getting user", status: 501 };
      else if (!user) return { error: "User not found", status: 404 };
      else {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.eamil = email;
        user.save((err, newUser) => {
          if (err) return { error: "Error saving user", status: 500 };
          else {
            return { user: newUser };
          }
        });
      }
    });
  };
}

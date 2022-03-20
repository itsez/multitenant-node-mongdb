import { getConnection } from "./util/connection";
const bcrypt = require("bcryptjs");

export async function initialize() {
  const db = await getConnection("root");
  const User = await db.model("User");
  const Account = await db.model("Account");
  let createdAccount = await createAccount(Account);
  let createdUser = await createUser(User, createdAccount._id);
  console.log("Initialized");
}

async function createAccount(Account) {
  return new Promise((resolve, reject) =>
    Account.findOne({ name: "Test Account" }, (err, testAccount) => {
      if (err) {
        console.log("error checking accounts: ", err);
        reject();
      } else if (testAccount && testAccount._id) {
        console.log("Account already Initialized");
        resolve(testAccount);
      } else {
        let account = new Account();
        account.name = "Test Account";
        account.collectionName = "testAccount";
        account.save((err, newAccount) => resolve(newAccount));
      }
    })
  );
}

async function createUser(User, accountId) {
  return new Promise((resolve, reject) =>
    User.findOne({ firstName: "Default", admin: true }, (err, testUser) => {
      if (err) console.log("Error creating user: ", err);
      else if (testUser && testUser._id) {
        console.log("User already Initialized: ");
        resolve(testUser);
      } else {
        let adminUser = new User({
          firstName: "Default",
          lastName: "Admin",
          admin: true,
          email: "admin@nitely.dev",
          accounts: [accountId],
        });

        bcrypt.hash("default", 10, (err, hash) => {
          if (err) reject(err);
          else {
            adminUser.password = hash;
            console.log("saving user: ", adminUser);
            adminUser.save((err, newUser) => {
              if (err) {
                console.log("error initializing user: ", err);
                reject(err);
              } else {
                console.log("successfully created default admin: ", newUser);
                resolve(newUser);
              }
            });
          }
        });
      }
    })
  );
}

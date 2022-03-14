import jwt from "jsonwebtoken";
import { getConnection } from "../util/connection";
const SECRET = process.env.SECRET;

export const verifyAuthorization = async (token, permission) => {
  jwt.verify(token, SECRET, (err, decoded) => {
    let rootDb = await getConnection("root");
    let Account = rootDb.model("Account");

    if (err || !decoded) return { error: `failed validation` };
    else if (permission) {
      let User = rootDb.model("User");

      User.findById(decoded.id, (err, user) => {
        if (err || !user) return { error: "No user found" };
        else if (user.permission[decoded.accountId].includes(permission)) {
          let db = await getCollectionName(decoded.accountId);
          if (!db) return { error: "No account found" };
          else return { decoded, db };
        } else return { error: `Missing permission: ${permission}` };
      });
    } else {
      let db = await getCollectionName(decoded.accountId);
      if (!db) return { error: "No account found" };
      else return { decoded, db };
    }
  });
};

export const getCollectionName = async (accountId) => {
  Account.findById(accountId, (err, account) => {
    if (err || !account) return null;
    let db = await getConnection(account.collectionName);
    return db;
  });
};

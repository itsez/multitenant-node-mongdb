require("dotenv").config({ path: ".env" });
const bcrypt = require("bcryptjs");

export default class AccountController {
  login = async (req) => {
    const { name, collectionName, accountId } = req.body;
    const Account = await req.body.db.model("Account");
    let defaultAccountId;

    //find account via id
    Account.findById({ accountId }, (err, account => {
      if (err || !account)
        return { error: `Couldn't find account at specefied id ${accountId}`, status: 404 };

        return {
            account
        }
        }));

        //get account by id
        get = async (req) => {
            const { id } = req.query;
        
            const Account = await req.body.db.model("Account");
        
            if (id)
              Account.findById(id, (err, account) => {
                if (err) return { error: "Error getting account", status: 501 };
                else if (!account) return { error: "Account not found", status: 404 };
                else {
                  return { account };
                }
              });
          };

  //get a list of accounts with optional search
  list = async (req) => {
    const { name } = req.query;

    const Account = await req.body.db.model("Account");

    let params = {};
    if (name) params.name = "/" + name + "/i";

    Account.find({ $and: params }, (err, accounts) => {
      if (err) return { error: "Error searching accounts", status: 501 };
      else if (!accounts) return { error: "No accounts found", status: 404 };
      else
        return {
            accounts
        };
    });
  };

  create = async (req) => {
    const { name, collectionName } = req.body;
    const Account = await req.body.db.model("Account");
    let account = new Account( {name, collectionName})

        account.save((err, newAccount) => {
          if (err) return { error: "Error saving account", status: 500 };
          else {
            return { account: newAccount };
          }
        });
      };

  update = async (req) => {
    const { name, accountId } = req.body;

    const Account = await req.body.db.model("Account");

    Account.findById(accountId, (err, account) => {
      if (err) return { error: "Error getting account", status: 501 };
      else if (!account) return { error: "Account not found", status: 404 };
      else {
        if (name) account.name = name;
        account.save((err, newAccount) => {
          if (err) return { error: "Error saving account", status: 500 };
          else {
            return { account: newAccount };
          }
        });
      }
    });
  };
}
}
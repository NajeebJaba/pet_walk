const jwt = require("jsonwebtoken");
const bcrybt = require("bcryptjs");
const Users = require("../models/Users");
const validateRegister = require("../../validation/register");
const validateLogin = require("../../validation/login");
const keys = require("../../config/keys");
const async = require("async");
const {
  NOT_AUTHORIZED,
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR
} = require("../../utils/errors");

exports.userRegister = (req, res, next) => {
  //input validation
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async.parallel(
    [
      callback => {
        Users.findOne(
          {
            email: req.body.email
          },
          callback
        );
      }
    ],
    (err, results) => {
      //check query error
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: SERVER_ERROR.message,
          status: SERVER_ERROR.status
        });
      }
      const checkEmail = results[0];

      if (checkEmail) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        /*  const avatar = gravatar.url(req.body.email, {
          s: "50", //size
          r: "pg", //rating
          d: "mm" //default
        }); */

        let newUser = new Users({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        /** the password will encrypted before
         * its saved to the data base.
         * before encrypting the server will
         * genrate salt so that similar passwords
         * will have differnt hash value. */
        bcrybt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: SERVER_ERROR.message,
              status: SERVER_ERROR.status
            });
          }
          bcrybt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: SERVER_ERROR.message,
                status: SERVER_ERROR.status
              });
            }
            newUser.password = hash;
            newUser
              .save()
              .then(result => res.status(200).json(result))
              .catch(err => {
                console.log(err);
                return res.status(500).json({
                  message: SERVER_ERROR.message,
                  status: SERVER_ERROR.status
                });
              });
          });
        });
      }
    }
  );
};

exports.userLogin = (req, res, next) => {
  //input validation
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  Users.findOne({
    email
  })
    .then(user => {
      if (!user) {
        errors.email = "user not found";
        return res.status(404).json(errors);
      }
      bcrybt
        .compare(password, user.password)
        .then(result => {
          if (result) {
            //generte token
            const payload = {
              id: user.id,
              email: user.email
            };

            //sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 36000
              },
              (err, token) => {
                res.json({
                  message: "success",
                  token: "Bearer " + token
                });
              }
            );
          } else {
            errors.password = "password incorrect";
            return res.status(400).json(errors);
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: SERVER_ERROR.message,
            status: SERVER_ERROR.status
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: SERVER_ERROR.message,
        status: SERVER_ERROR.status
      });
    });
};

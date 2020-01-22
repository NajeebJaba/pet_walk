const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateRegisterInput = data => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.conPassword = !isEmpty(data.conPassword) ? data.conPassword : "";
  if (
    !validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    errors.name = "name must be between 2 and 30 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Name feild is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email feild is required";
  }
  if (
    !validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "password must be at least 6 characters";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password feild is required";
  }
  if (!validator.equals(data.conPassword, data.password)) {
    errors.conPassword = "passwords must match";
  }
  if (validator.isEmpty(data.conPassword)) {
    errors.conPassword = "confirm password feild is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

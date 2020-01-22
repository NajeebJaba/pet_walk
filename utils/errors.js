const not_authorized = { message: "user not authorized", status: 401 };
const server_error = { message: "server error", status: 500 };
const bad_request = { message: "bad request", status: 400 };
const not_found = { message: "not found", status: 404 };

module.exports = {
  NOT_AUTHORIZED: not_authorized,
  SERVER_ERROR: server_error,
  BAD_REQUEST: bad_request,
  NOT_FOUND: not_found
};

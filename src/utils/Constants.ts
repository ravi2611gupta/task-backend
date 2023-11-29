const CONSTANTS = {
  ERROR_CODE: {
    COMMON: 400,
    SERVER: 500,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
  },
  SUCCESS_CODE: {
    SUCCESS_FETCH: 200,
    SUCCESS_CREATION: 201,
  },
  ERROR_MESSAGE: {
    COMMON: "Sorry, something went wrong!",
    NOT_FOUND: "Sorry data not found!",
    UNAUTHORIZED: "You are not authorized!",
    PARAMS: "Please check the parameters.",
    SERVER: "Server error!",
    MIDDLEWARE: {
      HEADER_MISSING: "Authorization header is missing",
      TOKEN_MISSING: "Token is missing",
      INVALID_TOKEN: "Invalid token",
    },
    AUTH: {
      EMAIL_EXIST: "Email already exist!",
      EMAIL_NOT_EXIST: "Email does not exist!",
      INVALID_CREDENTIALS: "Invalid credentials!",
    },
  },
  SUCCESS_MESSAGE: {
    AUTH: {
      LOGIN: "Login successfully",
      REGISTER: "Register successfully",
    },
    COMMON: {
      ADD_DATA: "Data added successfully!",
      DELETE_DATA: "Data deleted successfully!",
      UPDATE_DATA: "Data updated successfully!",
    },
  },
  FIELD_VALIDATION: {
    COMMON: {
      EMAIL: "Email field is empty or not a valid email",
      PASSWORD: "Password must be have minimum 8 characters",
      MOBILE: "Mobile number must be at least 10 characters",
      ZIP: "Zip code must be at least 6 characters",
    },
  },
};

export default CONSTANTS;

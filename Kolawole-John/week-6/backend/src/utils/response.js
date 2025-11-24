const successResponse = (message, data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data) {
    response.data = data;
  }

  return response;
};

const errorResponse = (message, code, details = null) => {
  const response = {
    success: false,
    message,
    error: {
      code
    },
    timestamp: new Date().toISOString()
  };

  if (details) {
    response.error.details = details;
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse
};
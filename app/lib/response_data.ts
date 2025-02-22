/* eslint-disable @typescript-eslint/no-explicit-any */
const ResponseData = (data: any, statusCode?: number, message?: string) => {
  return {
    data,
    meta: {
      statusCode: statusCode || 200,
      message: message || "Success",
    },
  };
};

export default ResponseData;

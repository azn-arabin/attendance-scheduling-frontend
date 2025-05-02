import { showToast } from "@/lib/helpers/ui.helper.ts";

export const checkConnection = (
  callback: (value: any) => void,
  ...payload: any
) => {
  if (typeof window !== "undefined" && !window.navigator.onLine) {
    showToast({
      title: "No internet connection",
      position: "bottom-left",
    });
  } else {
    callback(payload);
  }
};

export const handleAPIError = (error: any, router?: any) => {
  const fieldNames = [
    {
      displayName: "product",
      fieldName: "productId",
    },
    {
      displayName: "Blog",
      fieldName: "blogId",
    },
  ];

  let message = "Something went wrong! Please try again later";
  if (error.response) {
    // The request was made, but the server responded with a status code
    const data = error.response.data;
    console.log("Server responded with an error:", error);
    message = "There was a server side error. Please try again later";
    if (router) {
      const responseFiled = data?.errors[0].field_name ?? "";
      const fileName = fieldNames.find(
        (field) => field.fieldName === responseFiled,
      );

      if (fileName) {
        message = `The ${fileName.displayName} was not found`;
      } else {
        message = "The specified Id was not found";
      }
      router.push("/user");
    }
  } else if (error.request) {
    // The request was made, but no response was received
    console.log("No response received:", error);
    // Handle the situation where no response is received
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error setting up the request:", error);
    // Handle other types of errors
  }
  showToast({
    title: message,
    position: "bottom-left",
  });
};

export const handleErrorResponse = (error: any) => {
  showToast({
    position: "bottom-left",
    title: error?.response?.errors?.common?.msg,
  });
};

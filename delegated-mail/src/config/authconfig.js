export const msalConfig = {
  auth: {
    clientId: "09bb7e16-9a90-4ade-a82d-5461b29aa09a", // Replace with your Application (client) ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["Mail.Send"],
};

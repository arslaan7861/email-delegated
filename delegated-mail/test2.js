const connect = async () => {
  const res = await axios.get(`${BACKEND}/auth/microsoft/url`);
  window.location.href = res.data.authUrl;
};

const refresh = async () => {
  const res = await axios.get(`${BACKEND}/auth/microsoft/refresh`);
  console.log(res.data);
  setStatus("Refreshed — check console");
};

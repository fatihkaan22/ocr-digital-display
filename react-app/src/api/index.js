import axios from 'axios';

let API = 'https://ocr.fatihkaan.dev';

// const getProjectConfig = () => {
//   axios
//     .get(
//       'https://server-36196-default-rtdb.firebaseio.com/projects/ocr-digital-display.json'
//     )
//     .then((res) => res.data)
//     .then((config) => {
//       API = config.endpoint;
//     });
// };
// 
// getProjectConfig();

export const detectFromUrl = (url) => {
  const data = new FormData();
  data.append('url', url);

  return axios.post(`${API}/detect-from-url`, data).then((res) => res.data);
};

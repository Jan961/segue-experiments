import axios from 'axios';

class ApiClient {
  async get(url: string, config = {}) {
    const response = await axios.get(url, config);
    const { data: resData = {} } = response || {};
    return resData;
  }

  async post(url: string, data = {}, config = {}) {
    const response = await axios.post(url, data, config);
    const { data: resData = {} } = response || {};
    return resData;
  }

  async put(url: string, data = {}, config = {}) {
    const response = await axios.put(url, data, config);
    const { data: resData = {} } = response || {};
    return resData;
  }

  delete(url: string, config = {}) {
    return axios.delete(url, config);
  }
}

export default new ApiClient();

import axios from 'axios';

export const API = (url) => {
    return axios.get('https://beta.autobooking.com/api/test/v1/search' + url)
}
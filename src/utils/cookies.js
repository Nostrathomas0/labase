// src/utils/cookies.js

import Cookies from 'js-cookie';

// Function to get a specific cookie by name
export const getCookie = (name) => {
  return Cookies.get(name);
};

// Function to set a cookie
export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

// Function to remove a cookie
export const removeCookie = (name, options = {}) => {
  Cookies.remove(name, options);
};

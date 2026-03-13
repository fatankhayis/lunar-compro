import axios from "axios";

import { BASE_URL } from "./url";

const API_BASE_URL = `${BASE_URL}/api`;

export const getAnalytics = async (range = "month") => {
  try {
    const res = await axios.get(`${API_BASE_URL}/analytics?range=${range}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching analytics:", err);
    throw err;
  }
};
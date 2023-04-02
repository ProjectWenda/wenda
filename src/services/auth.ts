import axios from "axios";

const inDev = import.meta.env.DEV;
const baseUrl = inDev ? import.meta.env.VITE_LOCAL_BACKEND_URL : import.meta.env.VITE_BACKEND_URL;

// returns the user's authuid
export const authUser = async (code: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${baseUrl}/auth`, { params: { code } });
    return response.data.authuid ?? null;
  } catch {
    return null;
  }
};
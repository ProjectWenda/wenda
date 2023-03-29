import axios from "axios";
import { FastAverageColor } from "fast-average-color";

const inDev = import.meta.env.DEV;
const baseUrl = inDev ? import.meta.env.VITE_LOCAL_BACKEND_URL : import.meta.env.VITE_BACKEND_URL;
const avatarBaseUrl = 'https://cdn.discordapp.com/avatars';


export const getUser = async (uid: string) => {
  const response = await axios.get(`${baseUrl}/user`, { params: { uid } });
  return response.data;
}

export const getUserImage = async (uid: string) => {
  const userRes = await getUser(uid);
  const avatarId = userRes.avatar;
  const userId = userRes.id;
  return `${avatarBaseUrl}/${userId}/${avatarId}.png`
}

export const getUserImageColor = async (uid: string) => {
  const fac = new FastAverageColor();
  const userImageUrl = await getUserImage(uid);
  const userImage = new Image();
  userImage.crossOrigin = 'anonymous';
  userImage.src = userImageUrl;
  const averageColor = await fac.getColorAsync(userImage);
  return averageColor;
}


export const getFriends = async (uid: string) => {
  const response = await axios.get(`${baseUrl}/friends`, { params: { uid } });
  return response.data;
}
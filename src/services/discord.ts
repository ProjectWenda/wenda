import axios from "axios";
import { FastAverageColor } from "fast-average-color";
import { DiscordUser, userFromServer } from "../schema/User";

const inDev = import.meta.env.DEV;
const baseUrl = inDev ? import.meta.env.VITE_LOCAL_BACKEND_URL : import.meta.env.VITE_BACKEND_URL;
const avatarBaseUrl = 'https://cdn.discordapp.com/avatars';


export const getUser = async (uid: string) : Promise<DiscordUser> => {
  const response = await axios.get(`${baseUrl}/user`, { params: { uid } });
  return userFromServer(response.data);
}

export const getUserImage = (user: DiscordUser) => {
  const avatarId = user.avatar;
  const userId = user.id;
  return `${avatarBaseUrl}/${userId}/${avatarId}.png`
}

export const getUserImageColor = async (user: DiscordUser) => {
  const fac = new FastAverageColor();
  const userImageUrl = getUserImage(user);
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
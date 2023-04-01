import React from "react";
import { getUserImage } from "../services/discord";
import { DiscordUser } from "../schema/User";

interface UserImageProps {
  user: DiscordUser;
}

const UserImage: React.FC<UserImageProps> = ({ user }) => {
  const [userImage, setUserImage] = React.useState<string>();

  React.useEffect(() => {
    const imageUrl = getUserImage(user);
    setUserImage(imageUrl);
  }, []);

  return userImage ? (
    <div>
      <img src={userImage} className="rounded-full w-16" />
    </div>
  ) : null;
};

export default UserImage;

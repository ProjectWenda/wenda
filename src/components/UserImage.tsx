import React from "react";
import { getUserImage } from "../services/discord";

interface UserImageProps {
  uid: string;
}

const UserImage : React.FC<UserImageProps> = ({ uid }) => {
  const [userImage, setUserImage] = React.useState<string>();
  
  React.useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = await getUserImage(uid);
      setUserImage(imageUrl);
    }
    fetchImage();
  }, [])

  return userImage ? (
    <div >
      <img src={userImage} className="rounded-full w-16"/>
    </div>
  ) : null
}

export default UserImage;
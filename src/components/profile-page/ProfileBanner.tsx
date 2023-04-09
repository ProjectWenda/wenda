import React, { useEffect, useState, useCallback } from "react";
import { authUserState } from "../../store";
import { getUser, getUserBanner, getUserImage } from "../../services/discord";
import { useRecoilValue } from "recoil";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { DiscordUser, User, getDiscordUserPrototype } from "../../schema/User";

type ImageProps = React.PropsWithChildren & {
  discordUser: DiscordUser,
};

const BannerImage: React.FC<ImageProps> = ({
  discordUser,
  children,
}) => {
  const imageURL = getUserBanner(discordUser)

  return (
    <div className="w-full h-[400px] relative">
      <img
        className="absolute left-[50%] -translate-x-1/2 w-[90%] h-[400px] object-cover opacity-50"
        src={imageURL}
      />
      {children}
    </div>
  );
};

const ProfileImage: React.FC<ImageProps> = ({ discordUser }) => {
  const imageURL = getUserImage(discordUser);

  return (
    <img
      className="rounded-2xl w-[300px] h-[300px]"
      src={imageURL}
    />
  );
};

const ProfileInfo: React.FC<ImageProps> = ({ discordUser }) => {
  return (
    <div className="absolute left-[10%] top-[50%] -translate-y-1/2">
      <div className="flex items-center">
      <ProfileImage discordUser={discordUser} />
      <div className="pl-[20px] text-4xl">
        {discordUser.username}
      </div>
      </div>
    </div>
  );
};

const ProfileBanner = () => {
  const navigate = useNavigate();
  const authUser = useRecoilValue(authUserState);
  const [discordUser, setDiscordUser] = useState<DiscordUser>(getDiscordUserPrototype())

  const getDiscordUser = useCallback(async () => {
    if (!authUser) {
      navigate("/login");
    } else {
      setDiscordUser(await getUser(authUser.authUID))
    }
  }, [authUser])

  useEffect(() => {
    getDiscordUser()
  }, [getDiscordUser])

  return (
    <div className="w-full flex justify-center">
      <BannerImage discordUser={discordUser}>
        <ProfileInfo discordUser={discordUser} />
      </BannerImage>
    </div>
  );
};

export default ProfileBanner;

import React, { useEffect, useState, useCallback } from "react";
import { authUserState } from "../../store";
import { getUser, getUserImage } from "../../services/discord";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

const BannerImage = () => {};

const ProfileImage = () => {
  const [imageURL, setImageURL] = useState("");
  const authUser = useRecoilValue(authUserState);
  const navigate = useNavigate();

  const getProfileImage = useCallback(async () => {
    if (!authUser) {
      navigate("/login");
    } else {
      const discordUser = await getUser(authUser.authUID);
      const profileURL = getUserImage(discordUser);
      setImageURL(profileURL);
    }
  }, [authUser]);

  useEffect(() => {
    getProfileImage()
  }, [getProfileImage]);

  return (
    <img src={imageURL}></img>
  )
};

const ProfileBanner = () => {
  return (
    <div>
      <ProfileImage />
    </div>
  );
};

export default ProfileBanner;

import React from "react";
import { getUser } from "../services/discord";
import { DiscordUser } from "../schema/User";

interface UserTagProps {
  user: DiscordUser;
}

const UserTag: React.FC<UserTagProps> = ({ user }) => {
  const [userName, setUserName] = React.useState("");

  const userTagString = React.useMemo(() => {
    return `@${userName}`;
  }, [userName]);

  React.useEffect(() => {
    const fetchName = async () => {
      setUserName(user.username);
    };
    fetchName();
  }, []);

  return userName ? (
    <div className="dark:bg-zinc-800 rounded-lg font-semibold px-2 py-1">
      {userTagString}
    </div>
  ) : null;
};

export default UserTag;

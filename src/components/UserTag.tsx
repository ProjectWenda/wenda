import React from "react";
import { getUser } from "../services/discord";

interface UserTagProps {
  uid: string;
}

const UserTag : React.FC<UserTagProps> = ({ uid }) => {
  const [userName, setUserName] = React.useState();

  const userTagString = React.useMemo(() => {
    return `@${userName}`
  }, [userName])

  React.useEffect(() => {
    const fetchName = async () => {
      const user = await getUser(uid);
      setUserName(user.username);
    }
    fetchName();
  }, [])

  return userName ? (
    <div className="dark:bg-zinc-800 rounded-lg font-semibold px-2 py-1">
      {userTagString}
    </div>
  ) : null
}

export default UserTag;
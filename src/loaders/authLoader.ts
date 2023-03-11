import { redirect } from "react-router-dom";
import { useRecoilValue } from "recoil"
import { authUserState } from "../domain/store"

export const authLoader = () => {
  const user = useRecoilValue(authUserState);
  if (user == null) {
    throw redirect("/login");
  }
}
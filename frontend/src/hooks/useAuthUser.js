import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // //checking user is authenticated or not that's why we don't want to retry
    //one benefit of this useQuery is , it kept on trying to reach server multiple times but in case of
    //Hooks state it only tries once
  });
  //why .user because in /auth/me we are returning user object
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthUser;

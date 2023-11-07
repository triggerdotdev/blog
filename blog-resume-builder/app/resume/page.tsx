"use client";

import { redirect } from "next/navigation";

import Resume from "@/components/Resume";
import { useUserDataContext } from "@/components/UserDataContext";

const Page = () => {
  const { userDetails, setUserDetails } = useUserDataContext();

  const keysToCheck = Object.keys(userDetails).filter(
    (key) => key !== "latestUserImage"
  );

  for (let key of keysToCheck) {
    if (!userDetails[key as keyof typeof userDetails]) {
      // If this line gets executed, then it means the user is directly trying to access this route which should not be accessible without filling the form.
      redirect("/");
    }
  }

  return <Resume userDetails={userDetails} setUserDetails={setUserDetails} />;
};

export default Page;

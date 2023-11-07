"use client";

import { createContext, useContext, useState } from "react";
import { TUserDetails } from "./Home";

const UserDataContext = createContext<TUserDataContext | null>(null);

type TUserDataContext = {
  userDetails: TUserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<TUserDetails>>;
};

export default function UserDataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userDetails, setUserDetails] = useState<TUserDetails>({
    firstName: "",
    lastName: "",
    currentPosition: "",
    workingExperience: 1,
    email: "",
    knownTechnologies: "",
    latestUserImage: null,
    openaiProfileSummary: null,
    openaiWorkHistory: null,
    pdfUrl: null,
    openaiJobResponsibilities: null,
    companies: [
      {
        companyName: "",
        position: "",
        workedYears: "",
        technologies: "",
      },
    ],
  });
  return (
    <UserDataContext.Provider
      value={{
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserDataContext() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  }
  return context;
}

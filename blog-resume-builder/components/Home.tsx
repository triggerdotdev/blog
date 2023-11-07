"use client";

import React, { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

import Loading from "./Loading";
import Companies from "./Companies";
import AddCompanyModal from "./AddCompanyModal";
import { useUserDataContext } from "./UserDataContext";
import { generateResumeText } from "@/utils/openai";

export type TUserDetails = {
  firstName: string;
  lastName: string;
  currentPosition: string;
  workingExperience: number;
  email: string;
  knownTechnologies: string;
  latestUserImage: string | null;
  openaiProfileSummary: string | null;
  openaiWorkHistory: string | null;
  openaiJobResponsibilities: string | null;
  pdfUrl: string | null;
  companies: TCompany[];
};

export type TCompany = {
  companyName: string;
  position: string;
  workedYears: string;
  technologies: string;
};

const Home = () => {
  const { userDetails, setUserDetails } = useUserDataContext();
  const [userImage, setUserImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fullName = userDetails.firstName + " " + userDetails.lastName;

  const companyDetails = () => {
    let stringText = "";
    for (let i = 1; i < userDetails.companies.length; i++) {
      stringText += ` ${userDetails.companies[i].companyName} as a ${userDetails.companies[i].position} on technologies ${userDetails.companies[i].technologies} for ${userDetails.companies[i].workedYears} years.`;
    }
    return stringText;
  };

  const prompts = {
    profileSummary: `I am writing a resume, my details are \n name: ${fullName} \n role: ${userDetails.currentPosition} (${userDetails.workingExperience} years). \n I write in the technolegies: ${userDetails.knownTechnologies}. Can you write a 100 words description for the top of the resume(first person writing)?`,

    jobResponsibilities: `I am writing a resume, my details are \n name: ${fullName} \n role: ${userDetails.currentPosition} (${userDetails.workingExperience} years). \n I write in the technolegies: ${userDetails.knownTechnologies}. Can you write 3 points for a resume on what I am good at?`,

    workHistory: `I am writing a resume, my details are \n name: ${fullName} \n role: ${
      userDetails.currentPosition
    } (${
      userDetails.workingExperience
    } years). ${companyDetails()} \n Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`,
  };

  const router = useRouter();

  const handleAddCompany = (newCompany: TCompany) => {
    if (userDetails) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        companies: [...prevDetails.companies, newCompany],
      }));
    }
  };

  const handleRemoveCompany = (index: number) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      companies: prevDetails.companies.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (userImage) {
      const payload = new FormData();
      payload.set("file", userImage);
      const {
        data: { path },
      }: { data: { path: string } } = await axios.post(
        "/api/file-upload",
        payload
      );

      setUserDetails((prevDetails) => ({
        ...prevDetails,
        latestUserImage: path,
      }));
    }
    const [aiProfileSummary, aiWorkHistory, aiJobResponsibilities] =
      await Promise.all([
        generateResumeText(prompts.profileSummary),
        generateResumeText(prompts.jobResponsibilities),
        generateResumeText(prompts.workHistory),
      ]);

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      openaiProfileSummary: aiProfileSummary,
      openaiWorkHistory: aiWorkHistory,
      openaiJobResponsibilities: aiJobResponsibilities,
    }));

    setLoading(false);
    router.push("/resume");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-7">
      <div className="w-full py-3 bg-slate-500 items-center justify-center flex flex-col rounded-t-lg text-white">
        <h1 className="font-bold text-white text-3xl">Resume Builder</h1>
        <p className="text-gray-300">
          Generate a resume with GPT4 in seconds 🚀
        </p>
      </div>
      <form
        onSubmit={handleFormSubmit}
        method="POST"
        encType="multipart/form-data"
        className="p-4 w-full flex flex-col"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              required
              name="firstName"
              id="firstName"
              placeholder="e.g. John"
              value={userDetails.firstName}
              onChange={handleInputChange}
              className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              required
              name="lastName"
              id="lastName"
              placeholder="e.g. Doe"
              value={userDetails.lastName}
              onChange={handleInputChange}
              className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            />
          </div>
        </div>
        <hr className="w-full h-1 mt-3" />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col">
            <label htmlFor="currentPosition">Current Position</label>
            <input
              type="text"
              required
              name="currentPosition"
              id="currentPosition"
              placeholder="e.g. Software Engineer"
              value={userDetails.currentPosition}
              onChange={handleInputChange}
              className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="workingExperience">
              Work Experience (in years)
            </label>
            <input
              type="number"
              required
              name="workingExperience"
              placeholder="e.g. 2"
              id="workingExperience"
              value={userDetails.workingExperience}
              onChange={handleInputChange}
              className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="knownTechnologies">Technologies you know?</label>
            <input
              type="text"
              required
              name="knownTechnologies"
              id="knownTechnologies"
              placeholder="e.g. React, Node, TypeScript"
              value={userDetails.knownTechnologies}
              onChange={handleInputChange}
              className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            />
          </div>
        </div>
        <hr className="w-full h-1 mt-3" />
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          required
          name="email"
          id="email"
          placeholder="e.g. john.doe@gmail.com"
          value={userDetails.email}
          onChange={handleInputChange}
          className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
        />
        <hr className="w-full h-1 mt-3" />
        <label htmlFor="photo">Upload your image 😎</label>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/x-png,image/jpeg"
          onChange={(e) => e.target.files && setUserImage(e.target.files[0])}
          className="p-3 rounded-md outline-none border border-gray-500 mb-3"
        />
        <AddCompanyModal onAddCompany={handleAddCompany} />
        <Companies
          companies={userDetails.companies}
          onRemoveCompany={handleRemoveCompany}
        />
        <button className="p-4 pointer outline-none bg-blue-500 border-none text-white text-base font-semibold rounded-lg">
          CREATE RESUME
        </button>
      </form>
    </div>
  );
};

export default Home;

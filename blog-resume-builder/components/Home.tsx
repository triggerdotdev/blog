"use client";

import React, { useState } from "react";
import {FormProvider, useForm} from "react-hook-form";
import Companies from "@/components/Companies";
import {client} from "@/trigger";
import axios from "axios";
import {serialize} from "object-to-formdata";

export type TUserDetails = {
  firstName: string;
  lastName: string;
  photo: string;
  email: string;
  companies: TCompany[];
};

export type TCompany = {
  companyName: string;
  position: string;
  workedYears: string;
  technologies: string;
};

const Home = () => {
  const [finished, setFinished] = useState<boolean>(false);
  const methods = useForm<TUserDetails>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleFormSubmit = async (values: TUserDetails) => {
    axios.post('/api/create', serialize(values));
    setFinished(true);
  };

  if (finished) {
    return (
        <div className="mt-10">Sent to the queue! Check your email</div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-7">
      <div className="w-full py-3 bg-slate-500 items-center justify-center flex flex-col rounded-t-lg text-white">
        <h1 className="font-bold text-white text-3xl">Resume Builder</h1>
        <p className="text-gray-300">
          Generate a resume with GPT4 in seconds 🚀
        </p>
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-4 w-full flex flex-col"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                required
                id="firstName"
                placeholder="e.g. John"
                className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
                {...register('firstName')}
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                required
                id="lastName"
                placeholder="e.g. Doe"
                className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
                {...register('lastName')}
              />
            </div>
          </div>
          <hr className="w-full h-1 mt-3" />
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            required
            id="email"
            placeholder="e.g. john.doe@gmail.com"
            className="p-3 rounded-md outline-none border border-gray-500 text-white bg-transparent"
            {...register('email', {required: true, pattern: /^\S+@\S+$/i})}
          />
          <hr className="w-full h-1 mt-3" />
          <label htmlFor="photo">Upload your image 😎</label>
          <input
            type="file"
            id="photo"
            accept="image/x-png"
            className="p-3 rounded-md outline-none border border-gray-500 mb-3"
            {...register('photo', {required: true})}
          />
          <Companies />
          <button className="p-4 pointer outline-none bg-blue-500 border-none text-white text-base font-semibold rounded-lg">
            CREATE RESUME
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Home;

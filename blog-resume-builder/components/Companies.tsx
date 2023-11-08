import React, {useCallback, useEffect} from "react";

import { TCompany } from "./Home";
import {useFieldArray, useFormContext} from "react-hook-form";

type CompaniesProps = {
  companies: TCompany[];
};

const Companies = () => {
  const {control, register} = useFormContext();
  const {fields: companies, append} = useFieldArray({
    control,
    name: "companies",
  });

  const addCompany = useCallback(() => {
    append({
      companyName: '',
      position: '',
      workedYears: '',
      technologies: ''
    })
  }, [companies]);

  useEffect(() => {
    addCompany();
  }, []);

  return (
    <div className="mb-4">
      {companies.length > 1 ? (
        <h3 className="font-bold text-white text-3xl my-3">
          Your list of Companies:
        </h3>
      ) : null}
      {companies.length > 1 &&
        companies.slice(1).map((company, index) => (
          <div
            key={index}
            className="mb-4 p-4 border bg-gray-800 rounded-lg shadow-md"
          >
            <div className="mb-2">
              <label htmlFor={`companyName-${index}`} className="text-white">
                Company Name
              </label>
              <input
                type="text"
                id={`companyName-${index}`}
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
                {...register(`companies.${index}.companyName`, {required: true})}
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`position-${index}`} className="text-white">
                Position
              </label>
              <input
                type="text"
                id={`position-${index}`}
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
                {...register(`companies.${index}.position`, {required: true})}
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`workedYears-${index}`} className="text-white">
                Worked Years
              </label>
              <input
                  type="number"
                  id={`workedYears-${index}`}
                  className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
                  {...register(`companies.${index}.workedYears`, {required: true})}
              />
            </div>
            <div className="mb-2">
              <label htmlFor={`workedYears-${index}`} className="text-white">
                Technologies
              </label>
              <input
                  type="text"
                  id={`technologies-${index}`}
                  className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
                  {...register(`companies.${index}.technologies`, {required: true})}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addCompany} className="mb-4 p-2 pointer outline-none bg-blue-900 w-full border-none text-white text-base font-semibold rounded-lg">
          Add Company
        </button>
    </div>
  );
};

export default Companies;

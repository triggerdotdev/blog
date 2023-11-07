import React from "react";

import { TCompany } from "./Home";

type CompaniesProps = {
  companies: TCompany[];
  onRemoveCompany: (index: number) => void;
};

const Companies = ({ companies, onRemoveCompany }: CompaniesProps) => {
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
                name="company"
                id={`companyName-${index}`}
                defaultValue={company.companyName}
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`position-${index}`} className="text-white">
                Position
              </label>
              <input
                type="text"
                id={`position-${index}`}
                name="position"
                defaultValue={company.position}
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`workedYears-${index}`} className="text-white">
                Worked Years
              </label>
              <input
                type="text"
                name="workedYears"
                id={`workedYears-${index}`}
                defaultValue={company.workedYears}
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>

            <button
              onClick={() => onRemoveCompany(index)}
              className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
    </div>
  );
};

export default Companies;

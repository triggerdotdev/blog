"use client";

import React, { useState } from "react";
import { TCompany } from "./Home";

type CompaniesProps = {
  onAddCompany: (toAddCompany: TCompany) => void;
};

const AddCompanyModal = ({ onAddCompany }: CompaniesProps) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [toAddCompany, setToAddCompany] = useState<TCompany>({
    companyName: "",
    position: "",
    workedYears: "",
    technologies: "",
  });

  return (
    <>
      {isHidden ? (
        <div className="mb-4">
          <div className="mb-4 p-4 border bg-gray-800 rounded-lg shadow-md">
            <div className="mb-2">
              <label htmlFor={`companyName`} className="text-white">
                Company Name
              </label>
              <input
                type="text"
                required
                name="companies"
                placeholder="e.g. Google"
                id={`companyName`}
                value={toAddCompany.companyName}
                onChange={(event) =>
                  setToAddCompany((prev) => ({
                    ...prev,
                    companyName: event.target.value,
                  }))
                }
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`position`} className="text-white">
                Position
              </label>
              <input
                type="text"
                required
                id={`position`}
                placeholder="e.g. Software Engineer"
                name="position"
                value={toAddCompany.position}
                onChange={(event) =>
                  setToAddCompany((prev) => ({
                    ...prev,
                    position: event.target.value,
                  }))
                }
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`workedYears`} className="text-white">
                Worked Years
              </label>
              <input
                type="text"
                required
                name="workedYears"
                placeholder="e.g. 2"
                id={`workedYears`}
                value={toAddCompany.workedYears}
                onChange={(event) =>
                  setToAddCompany((prev) => ({
                    ...prev,
                    workedYears: event.target.value,
                  }))
                }
                className="p-2 border border-gray-300 rounded-md w-full bg-transparent"
              />
            </div>
            <button
              disabled={
                !toAddCompany.companyName ||
                !toAddCompany.position ||
                !toAddCompany.workedYears ||
                !Number.isFinite(Number(toAddCompany.workedYears)) ||
                Number(toAddCompany.workedYears) < 0
              }
              onClick={() => {
                onAddCompany(toAddCompany);
                setToAddCompany({
                  companyName: "",
                  position: "",
                  workedYears: "",
                  technologies: "",
                });
              }}
              className="bg-green-500 text-white rounded p-2 mr-3 hover:bg-green-600 disabled:bg-gray-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsHidden((prev) => !prev);
              }}
              className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
            >
              Hide Modal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsHidden((prev) => !prev);
          }}
          className="bg-slate-600 text-white rounded p-2 hover:bg-slate-700 w-full"
        >
          Show Company Modal
        </button>
      )}
    </>
  );
};

export default AddCompanyModal;

import { useRef } from "react";

import jsPDF from "jspdf";
import axios from "axios";
import html2canvas from "html2canvas";

import { sendEmail } from "@/app/_actions";

import { TUserDetails } from "./Home";

type ResumeProps = {
  userDetails: TUserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<TUserDetails>>;
};

const Resume = ({ userDetails, setUserDetails }: ResumeProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const userFullName = `${userDetails.firstName} ${userDetails.lastName}`;
  const userImagePath = userDetails.latestUserImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${userDetails.latestUserImage}`
    : undefined;

  const getPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4", true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    return pdf;
  };

  const savePDF = async () => {
    const pdf = await getPDF();
    if (!pdf) return;
    const payload = new FormData();
    payload.set("file", pdf.output("blob"));

    const {
      data: { path },
    }: { data: { path: string } } = await axios.post(
      "/api/file-upload",
      payload
    );

    const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${path}`;

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      pdfUrl,
    }));

    await sendEmail({
      to: userDetails.email,
      text: pdfUrl,
      name: userFullName,
      from: "onboarding@resend.dev",
    });
  };

  const replaceWithBr = (sentence: string) => {
    return sentence.replace(/\n/g, "<br /><br />");
  };

  return (
    <>
      <button
        onClick={savePDF}
        className="p-4 pointer outline-none bg-blue-500 border-none text-zinc-100 text-base font-semibold rounded-md mt-2"
      >
        Send Resume in Email
      </button>
      <div className="min-h-screen p-8" ref={pdfRef}>
        <header className="w-[80%] my-0 mx-auto min-h-[10vh] bg-slate-600 p-8 rounded-r-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{userFullName}</h1>
            <p className="opacity-60 mb-4">
              {userDetails.currentPosition} ({userDetails.knownTechnologies})
            </p>
            <p className="opacity-60">
              {userDetails.workingExperience}year(s) work experience
            </p>
          </div>
          {userImagePath ? (
            <div>
              <img
                src={userImagePath}
                alt={userFullName}
                className="align-middle w-36 h-36 rounded-[50%] border-[0.4rem] border-zinc-300"
              />
            </div>
          ) : null}
        </header>
        <div className="bg-gray-900 w-[80%] my-0 mx-auto p-8 min-h-[80vh] border-2 border-white-400">
          <div>
            <h2 className="mb-2 font-bold text-lg">PROFILE SUMMARY</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(userDetails.openaiProfileSummary!),
              }}
              className="text-justify mb-8"
            />
          </div>
          {userDetails.companies.length > 1 ? (
            <>
              <hr className="my-8 h-2" />
              <div>
                <h2 className="mb-4 font-bold text-lg">WORK HISTORY</h2>
                {userDetails.companies.slice(1).map((company) => (
                  <p className="text-justify mb-4" key={company.companyName}>
                    <span style={{ fontWeight: "bold" }}>
                      {company.companyName}
                    </span>{" "}
                    - {company.position}
                  </p>
                ))}
              </div>
            </>
          ) : null}
          <hr className="my-8 h-2" />
          <div>
            <h2 className="mb-4 font-bold text-lg">JOB PROFILE</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(userDetails.openaiWorkHistory!),
              }}
              className="text-justify mb-8"
            />
          </div>
          <hr className="my-8 h-2" />
          <div>
            <h2 className="mb-4 font-bold text-lg">JOB RESPONSIBILITIES</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(userDetails.openaiJobResponsibilities!),
              }}
              className="text-justify mb-8"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;

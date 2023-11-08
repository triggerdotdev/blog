import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import {generateResumeText} from "@/utils/openai";
import {TCompany, TUserDetails} from "@/components/Home";
import {createResume} from "@/utils/resume";
import {Resend} from "@trigger.dev/resend";

const resend = new Resend({
    id: "resend",
    apiKey: process.env.RESEND_API_KEY!,
});

const companyDetails = (companies: TCompany[]) => {
  let stringText = "";
  for (let i = 1; i < companies.length; i++) {
    stringText += ` ${companies[i].companyName} as a ${companies[i].position} on technologies ${companies[i].technologies} for ${companies[i].workedYears} years.`;
  }
  return stringText;
};

const prompts = {
  profileSummary: (fullName: string, currentPosition: string, workingExperience: string, knownTechnologies: string) => `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${workingExperience} years). \n I write in the technologies: ${knownTechnologies}. Can you write a 100 words description for the top of the resume(first person writing)?`,
  jobResponsibilities: (fullName: string, currentPosition: string, workingExperience: string, knownTechnologies: string) =>  `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${workingExperience} years). \n I write in the technolegies: ${knownTechnologies}. Can you write 3 points for a resume on what I am good at?`,
  workHistory: (fullName: string, currentPosition: string, workingExperience: string, details: TCompany[]) => `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${workingExperience} years). ${companyDetails(details)} \n Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`,
};

client.defineJob({
  id: "create-resume",
  name: "Create Resume",
  version: "0.0.1",
  integrations: {
      resend
  },
  trigger: eventTrigger({
    name: "create.resume",
    schema: z.object({
      firstName: z.string(),
      lastName: z.string(),
      photo: z.string(),
      email: z.string().email(),
      companies: z.array(z.object({
        companyName: z.string(),
        position: z.string(),
        workedYears: z.string(),
        technologies: z.string()
      }))
    }),
  }),
  run: async (payload, io, ctx) => {

    const texts = await io.runTask("openai-task", async () => {
      return Promise.all([
          await generateResumeText(prompts.profileSummary(payload.firstName, payload.companies[0].position, payload.companies[0].workedYears, payload.companies[0].technologies)),
          await generateResumeText(prompts.jobResponsibilities(payload.firstName, payload.companies[0].position, payload.companies[0].workedYears, payload.companies[0].technologies)),
          await generateResumeText(prompts.workHistory(payload.firstName, payload.companies[0].position, payload.companies[0].workedYears, payload.companies))
      ]);
    });

    console.log('passed chatgpt');

    const pdf = await io.runTask('convert-to-html', async () => {
        const resume = createResume({
            userDetails: payload,
            picture: payload.photo,
            profileSummary: texts[0],
            jobResponsibilities: texts[1],
            workHistory: texts[2],
        });

        return {final: resume.split(',')[1]}
    });

    console.log('converted to pdf');

    await io.resend.sendEmail('send-email', {
        to: payload.email,
        subject: 'Resume',
        html: 'Your resume is attached!',
        attachments: [
            {
                filename: 'resume.pdf',
                content: Buffer.from(pdf.final, 'base64'),
                contentType: 'application/pdf',
            }
        ],
        from: "Nevo David <nevo@gitup.dev>",
    });

    console.log('Sent email');
  },
});

import { JobSkill } from "./job-skill.model";

export class JobParent {
  email: string;
  jobId: string;
  jobTitle: string;
  jobDesignation: string;
  jobOrganization: string;
  jobMinExperience: string;
  jobMaxExperience: string;
  jobLocation: string;
  jobCompanyUrl: string;
  jobStatus: string;
  jobDescription: string;
  jobRole: string;
  jobUGDescription: string;
  jobPGDescription: string;
  jobAboutCompany: string;
  createdDate: Date;
  jobSkills: Array<JobSkill>;
  message: string;
}

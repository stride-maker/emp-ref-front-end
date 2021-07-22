import { JobSkill } from "./job-skill.model";

export class JobCard {
  email: string;
  jobId: string;
  jobCardId: number;
  jobCardTitle: string;
  jobCardDesignation: string;
  jobCardOrganization: string;
  jobCardMinExperience: string;
  jobCardMaxExperience: string;
  jobCardDescription: string;
  jobCardLocation: string;
  jobCardCompanyURL: string;
  jobCardStatus: string;
  message: string;
  createdDate: Date;
  jobSkills: Array<JobSkill>;
}

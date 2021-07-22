import { Applicant } from "./applicant.model";

export class ResponseJob {
  jobId: string;
  jobTitle: string;
  jobDesignation: string;
  jobOrganization: string;
  jobStatus: string;
  numberOfApplicants: string;
  applicants: Array<Applicant>;
}

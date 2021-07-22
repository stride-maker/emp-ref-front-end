import { Education } from "./education.model";
import { Employment } from "./employment.model";
import { Skill } from "./skill.model";

export class UserBasicDetails {
  email: string;
  firstName: string;
  lastName: string;
  mailVerified: boolean;
  numberVerified: boolean;
  dateOfBirth: Date;
  phoneNumber: string;
  currentLocation: string;
  currentExperience: string;
  profileImage: string;
  resume: string;
  resumeName: string;
  resumeFormat: string;
  gender: string;
  maritalStatus: string;
  hometown: string;
  pinCode: string;
  employments: Array<Employment>;
  educations: Array<Education>;
  skills: Array<Skill>;
  message: string;
}

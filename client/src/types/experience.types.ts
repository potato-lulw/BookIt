import type { ExperienceSlot } from "./slot.types";

export interface AllExperience {
  _id: string;
  destinationName: string;
  placeName: string;
  description: string;
  price: number;
  images: string[];
  thumbnail: string;
}


export interface ExperienceAvailability {
  date: string;
  slots: ExperienceSlot[];
}

export interface SingleExperienceResponseData {
  experience: AllExperience;
  availability: ExperienceAvailability[];
}
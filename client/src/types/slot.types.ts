export interface ExperienceSlot {
  _id: string;
  time: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  isAvailable: boolean;
  soldOut: boolean;
}
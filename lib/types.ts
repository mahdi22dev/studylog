export type Session = {
  id: string;
  userId: string;
  startTime: string | Date;
  endTime: string | Date | null;
  durationMin: number;
  type: string;
  subject?: string | null;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type SubjectDistributionItem = {
  name: string;
  pct: number;
  hoursStr: string;
  color: string;
};

export type SubjectDistribution = {
  totalHoursStr: string;
  items: SubjectDistributionItem[];
};
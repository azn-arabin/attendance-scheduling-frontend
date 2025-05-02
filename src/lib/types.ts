export interface Batch {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  instructors: User[];
  students_count: number;
  instructors_count: number;
}

export interface User {
  id: number;
  full_name: string;
  gender?: string;
}
export interface ClassItem {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  batch_id: number;
  batch: Batch & {
    students_count: number;
  };
}

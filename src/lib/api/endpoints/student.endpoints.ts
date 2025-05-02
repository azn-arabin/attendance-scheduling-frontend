import { MAIN_API, PaginationType } from "@/lib/api/endpoints/index.ts";

export const getUpcomingClassesAPI = (props: PaginationType) =>
  MAIN_API.get(
    `/student/upcoming-classes?page=${props.page}&pageSize=${props.pageSize}`,
  );

interface AttendancePayload {
  class_id: number;
}

export const markAttendanceAPI = (payload: AttendancePayload) =>
  MAIN_API.post("/student/mark-attendance", payload);

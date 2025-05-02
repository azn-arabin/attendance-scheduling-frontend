import { MAIN_API, PaginationType } from "@/lib/api/endpoints/index.ts";

export const getInstructorClassesAPI = (props: PaginationType) =>
  MAIN_API.get(
    `/instructor/classes?page=${props.page}&pageSize=${props.pageSize}`,
  );

export const createClassAPI = ({ payload }: { payload: any }) =>
  MAIN_API.post("/instructor/classes", payload);

export const updateClassAPI = ({ payload, id }: { payload: any; id: number }) =>
  MAIN_API.put(`/instructor/classes/${id}`, payload);

export const deleteClasAPI = (id: number) =>
  MAIN_API.delete(`/instructor/classes/${id}`);

export const getInstructorBatchAPI = () => MAIN_API.get(`/instructor/batches`);

export const getDashboardStatsAPI = () =>
  MAIN_API.get("/instructor/dashboard-stats");

export const getClassDistributionAPI = () =>
  MAIN_API.get(`/instructor/class-distribution`);

export const getMonthlyClassesAPI = () =>
  MAIN_API.get(`/instructor/monthly-classes`);

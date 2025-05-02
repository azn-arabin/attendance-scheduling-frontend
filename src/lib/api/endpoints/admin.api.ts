import { MAIN_API } from "@/lib/api/endpoints/index.ts";

export const createBatchAPI = ({ payload }: { payload: any }) =>
  MAIN_API.post(`/admin/batches/`, payload);

export const updateBatchAPI = ({ payload, id }: { payload: any; id: number }) =>
  MAIN_API.put(`/admin/batches/${id}`, payload);

export const deleteBatchAPI = (id: number) =>
  MAIN_API.delete(`/admin/batches/${id}`);

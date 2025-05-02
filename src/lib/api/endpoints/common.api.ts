import { MAIN_API } from "@/lib/api/endpoints/index.ts";

export const getAllBatchesAPI = () => MAIN_API.get("/batches");

export const getBatchByIdAPI = (id: number) => MAIN_API.get(`/batches/${id}`);

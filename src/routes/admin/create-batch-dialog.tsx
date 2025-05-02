/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { handleFormError, showToast } from "@/lib/helpers/ui.helper";
import {
  createBatchAPI,
  updateBatchAPI,
} from "@/lib/api/endpoints/admin.api.ts";
import { Batch } from "@/lib/types.ts";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent.ts";
import { Loader2 } from "lucide-react";

const batchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type BatchFormType = z.infer<typeof batchSchema>;

interface CreateBatchDialogProps {
  onSuccess: (batch: any) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  batch?: Batch;
}

const CreateBatchDialog = ({
  onSuccess,
  open,
  setOpen,
  ...props
}: CreateBatchDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<BatchFormType>({
    resolver: zodResolver(batchSchema),
  });

  const { loading, callAPI: createOrUpdateBatch } = useAPIAfterEvent({
    APIFunction: props.batch ? updateBatchAPI : createBatchAPI,
  });

  useEffect(() => {
    if (props.batch) {
      reset(props.batch);
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [props.batch]);

  const onSubmit = async (data: BatchFormType) => {
    createOrUpdateBatch(
      {
        payload: data,
        id: props.batch?.id ?? 0,
      },
      (data) => {
        showToast({ title: data.message });
        onSuccess(data.data);
        reset({
          name: "",
          description: "",
        });
      },
      (e) => {
        handleFormError({
          setError,
          error: e,
        });
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.batch ? "Edit Batch" : "Create New Batch"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("name")} placeholder="Batch name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("description")}
              placeholder="Batch description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBatchDialog;

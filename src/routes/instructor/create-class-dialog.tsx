/* eslint-disable */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { handleFormError, showToast } from "@/lib/helpers/ui.helper";
import { isAfter } from "date-fns";
import useAPIAfterEvent from "@/lib/api/hooks/useAPIAfterEvent";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createClassAPI,
  getInstructorBatchAPI,
  updateClassAPI,
} from "@/lib/api/endpoints/instructor.api.ts";
import { ClassItem } from "@/lib/types.ts";
import { Loader2 } from "lucide-react";

const classSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  start_time: z
    .string()
    .refine(
      (val) => isAfter(new Date(val), new Date()),
      "Start time must be in the future",
    ),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  batch_id: z.string().min(1, "Batch is required"),
});

type ClassFormType = z.infer<typeof classSchema>;

interface CreateClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: (data: any) => void;
  selectedClass?: ClassItem;
}

const CreateClassDialog = ({
  open,
  setOpen,
  onSuccess,
  selectedClass,
}: CreateClassDialogProps) => {
  const [batches, setBatches] = useState<{ id: number; name: string }[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
  } = useForm<ClassFormType>({
    resolver: zodResolver(classSchema),
  });

  const { loading, callAPI: createClass } = useAPIAfterEvent({
    APIFunction: selectedClass ? updateClassAPI : createClassAPI,
  });

  useEffect(() => {
    if (selectedClass) {
      reset({
        topic: selectedClass.topic,
        duration: selectedClass.duration,
        start_time: new Date(selectedClass.start_time)
          .toISOString()
          .slice(0, 16), // for input type="datetime-local"
        batch_id: selectedClass.batch_id.toString(),
      });
      setValue("batch_id", selectedClass.batch_id.toString());
    } else {
      reset({
        topic: "",
        duration: undefined,
        start_time: "",
        batch_id: "",
      });
    }
  }, [selectedClass]);

  useEffect(() => {
    getInstructorBatchAPI().then((res) => {
      setBatches(res.data.data);
    });
    reset();
  }, []);

  const onSubmit = (data: ClassFormType) => {
    createClass(
      { payload: data, id: selectedClass?.id ?? 0 },
      (data) => {
        showToast({ title: data.message });
        onSuccess(data.data);
        reset({
          topic: "",
          duration: undefined,
          start_time: "",
          batch_id: "",
        });
        setOpen(false);
      },
      (e) => {
        handleFormError({ error: e, setError });
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedClass ? "Edit Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("topic")} placeholder="Class topic" />
            {errors.topic && (
              <p className="text-sm text-red-500">{errors.topic.message}</p>
            )}
          </div>
          <div>
            <Input
              type="datetime-local"
              {...register("start_time")}
              placeholder="Start time"
            />
            {errors.start_time && (
              <p className="text-sm text-red-500">
                {errors.start_time.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="number"
              {...register("duration")}
              placeholder="Duration in minutes"
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>
          <div className="w-full">
            <Select onValueChange={(val) => setValue("batch_id", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.batch_id && (
              <p className="text-sm text-red-500">{errors.batch_id.message}</p>
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

export default CreateClassDialog;

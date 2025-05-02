// components/AddInstructorDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/types.ts";

export function AddInstructorDialog({
  instructors,
  selectedIds,
  onChange,
  onConfirm,
  open,
  onClose,
}: {
  instructors: User[];
  selectedIds: number[];
  onChange: (id: number) => void;
  onConfirm: () => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Instructors</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-auto">
          {instructors.map((inst) => (
            <label key={inst.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.includes(inst.id)}
                onCheckedChange={() => onChange(inst.id)}
              />
              <span>{inst.full_name}</span>
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onConfirm}>Add Selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

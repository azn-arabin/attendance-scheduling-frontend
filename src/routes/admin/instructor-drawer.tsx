// components/InstructorManagerDrawer.tsx
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Batch } from "@/lib/types.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export function InstructorManagerDrawer({
  batch,
  open,
  onClose,
  onAddClick,
  onRemoveInstructor,
}: {
  batch: Batch;
  open: boolean;
  onClose: () => void;
  onAddClick: () => void;
  onRemoveInstructor: (id: number) => void;
}) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Manage Instructors for "{batch.name}"</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <ScrollArea className="max-h-[400px] space-y-2">
            {batch.instructors && batch.instructors.length > 0 ? (
              batch.instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{instructor.full_name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveInstructor(instructor.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No instructors added.</p>
            )}
          </ScrollArea>
        </div>

        <DrawerFooter>
          <div className="flex justify-between w-full">
            <Button onClick={onAddClick}>Add Instructors</Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

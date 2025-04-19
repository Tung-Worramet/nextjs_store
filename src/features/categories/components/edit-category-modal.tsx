import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryType } from "@/types/category";
import { Save } from "lucide-react";
import Form from "next/form";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
}

const EditCategoryModal = ({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>

          <DialogDescription>
            Update your category information
          </DialogDescription>
        </DialogHeader>

        <Form action="" className="space-y-4">
          <input type="hidden" name="category-id" value={category?.id} />

          <div className="space-y-2">
            <InputForm
              label="Category name"
              id="category-name"
              placeholder="Enter category name"
              required
              defaultValue={category?.name}
            />
          </div>

          <SubmitBtn name="Update Category" icon={Save} className="w-full" />
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditCategoryModal;

import { ProductType } from "@/types/product";
import { deleteProductAction } from "@/features/products/actions/products";
import { useForm } from "@/hooks/use-form";
import { useEffect } from "react";
import Modal from "@/components/shared/modal";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import SubmitBtn from "@/components/shared/submit-btn";
import { Trash2 } from "lucide-react";

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const DeleteProductModal = ({
  open,
  onOpenChange,
  product,
}: DeleteProductModalProps) => {
  const { state, formAction, isPending } = useForm(deleteProductAction);

  // Close modal when update status success
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Product"
      description={`Are you sure you want to delete the product "${product?.title}" ?`}
    >
      <Form action={formAction}>
        <input type="hidden" name="product-id" value={product?.id} />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <SubmitBtn
            name="Delete"
            icon={Trash2}
            className="bg-destructive hover:bg-destructive/80"
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  );
};
export default DeleteProductModal;

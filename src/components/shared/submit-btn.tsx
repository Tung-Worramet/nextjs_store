import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  pending?: boolean;
}

const SubmitBtn = ({ name, pending = false, ...props }: SubmitBtnProps) => {
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 size={16} className="animate-spin" /> : name}
    </Button>
  );
};
export default SubmitBtn;

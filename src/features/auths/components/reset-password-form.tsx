"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import { resetPasswordAction } from "../actions/auths";
import { useForm } from "@/hooks/use-form";
import ErrorMessage from "@/components/shared/error-message";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { errors, formAction, isPending, clearErrors } = useForm(
    resetPasswordAction,
    "/auth/signin"
  );

  // const { formAction, isPending } = useForm(
  //   resetPasswordAction,
  //   "/auth/signin"
  // );
  return (
    <Form action={formAction} onChange={clearErrors}>
      <input type="hidden" name="token" value={token} />
      <CardContent className="flex flex-col gap-4">
        <div>
          <InputForm
            label="รหัสผ่านใหม่"
            id="password"
            type="password"
            required
          />
          {errors.password && <ErrorMessage error={errors.password[0]} />}
        </div>

        <div>
          <InputForm
            label="ยืนยันรหัสผ่าน"
            id="confirm-password"
            type="password"
            required
          />
          {errors["confirm-password"] && (
            <ErrorMessage error={errors["confirm-password"][0]} />
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <SubmitBtn
          name="เปลี่ยนรหัสผ่าน"
          className="w-full"
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};
export default ResetPasswordForm;

"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { UserType } from "@/types/user";
import { ShoppingBag } from "lucide-react";
import Form from "next/form";
import { checkoutAction } from "../actions/orders";
import ErrorMessage from "@/components/shared/error-message";

interface CheckoutFormProps {
  user: UserType;
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const hasUserData = !!(user.address && user.tel);

  const { formAction, errors, isPending, clearErrors } =
    useForm(checkoutAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ข้อมูลการจัดส่ง</CardTitle>
      </CardHeader>

      <Form action={formAction} onChange={clearErrors}>
        <CardContent className="flex flex-col gap-4">
          {hasUserData && (
            <div className="flex items-center space-x-2 mb-4 border p-3 rounded-md bg-muted/50">
              <Switch
                id="use-profile-data"
                name="use-profile-data"
                defaultChecked
              />
              <Label htmlFor="use-profile-data">
                ใช้ข้อมูลจากโปรไฟล์ของฉัน
              </Label>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <InputForm
              label="เบอร์โทรศัพท์"
              id="phone"
              placeholder="0812345678"
              defaultValue={user.tel || ""}
              required
            />

            {/* Error message */}
            {errors.phone && <ErrorMessage error={errors.phone[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">
              ที่อยู่จัดส่ง <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={user.address || ""}
              placeholder="กรุณาระบุที่อยู่จัดส่ง ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              className="min-h-24"
            />

            {/* Error message */}
            {errors.address && <ErrorMessage error={errors.address[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">หมายเหตุเพิ่มเติม</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
              className="min-h-20"
            />

            {/* Error message */}
            {errors.note && <ErrorMessage error={errors.note[0]} />}
          </div>

          <div className="pt-4">
            <SubmitBtn
              name="ดำเนินการสั่งซื้อ"
              icon={ShoppingBag}
              className="w-full"
              pending={isPending}
            />
          </div>
        </CardContent>
      </Form>
    </Card>
  );
};
export default CheckoutForm;

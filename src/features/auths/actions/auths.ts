"use server";

import { InitialFormState } from "@/types/action";
import { signin, signup } from "../db/auths";

export const authAction = async (_prevState: InitialFormState, formData: FormData) => {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    }

    const result = rawData.confirmPassword ? await signup(rawData) : await signin(rawData)

    return result && result.message ?
        { success: false, message: result.message, errors: result.error }
        :
        { success: true, message: rawData.confirmPassword ? "สมัครสมาชิกสำเร็จ" : "เข้าสู่ระบบสำเร็จ" }
}
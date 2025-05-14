import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  type: "signup" | "signin" | "forgot-password" | "reset-password";
  children: React.ReactNode;
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  let title = "";
  let desc = "";

  switch (type) {
    case "signup":
      title = "สมัครสมาชิก";
      desc = "กรุณากรอกข้อมูลเพื่อสมัครสมาชิก";
      break;
    case "signin":
      title = "เข้าสู่ระบบ";
      desc = "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ";
      break;
    case "forgot-password":
      title = "ลืมรหัสผ่าน";
      desc = "กรุณากรอกอีเมลเพื่อรีเซ็ตรหัสผ่าน";
      break;
    case "reset-password":
      title = "รีเซ็ตรหัสผ่าน";
      desc = "กรุณากรอกรหัสผ่านใหม่";
      break;
  }
  // const title = type === "signup" ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  // const description =
  //   type === "signup"
  //     ? "กรุณากรอกข้อมูลเพื่อสมัครสมาชิก"
  //     : "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ";

  return (
    <div className="px-4 md:px-0">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">{desc}</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
export default AuthHeader;

import HeaderCustomer from "@/components/customer-page/headers/header";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";

interface MaiLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: MaiLayoutProps) => {
  const user = await authCheck();

  if (!user || user.status !== "Active") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-svh flex flex-col">
      <HeaderCustomer user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
};
export default ProtectedLayout;

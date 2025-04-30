import HeaderCustomer from "@/components/customer-page/headers/header";
import { authCheck } from "@/features/auths/db/auths";

interface MaiLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MaiLayoutProps) => {
  const user = await authCheck();

  return (
    <div className="min-h-svh flex flex-col">
      <HeaderCustomer user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
};
export default MainLayout;

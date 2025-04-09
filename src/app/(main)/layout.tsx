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
      <main className="pt-16 max-w-7xl mx-auto px-4 xl:px-0">{children}</main>
    </div>
  );
};
export default MainLayout;

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { useSignout } from "@/hooks/use-sign-out";
import { Loader2 } from "lucide-react";
import { UserType } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface UserCompProps {
  user: UserType;
}
export const AuthButtons = () => {
  return (
    <div className="flex justify-center gap-4">
      {/* asChild เป็นการใช้ Link ใน Button */}
      <Button size="lg" asChild>
        <SheetClose asChild>
          <Link href="/auth/signup">ลงทะเบียน</Link>
        </SheetClose>
      </Button>

      <Button variant="outline" size="lg" asChild>
        <SheetClose asChild>
          <Link href="/auth/signin">เข้าสู่ระบบ</Link>
        </SheetClose>
      </Button>
    </div>
  );
};

export const SignoutButton = () => {
  const { isPending, handleSignout } = useSignout();
  return (
    <SheetClose asChild>
      <Button
        variant="destructive"
        size="lg"
        disabled={isPending}
        onClick={handleSignout}
      >
        {isPending ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          "ออกจากระบบ"
        )}
      </Button>
    </SheetClose>
  );
};

export const UserAvatar = ({ user }: UserCompProps) => {
  return (
    <div className="px-4">
      <Card className="border-primary/50">
        <CardContent className="flex flex-col items-center gap-3">
          {/* Picture */}
          <Image
            alt={user.name || "Profile"}
            src={user.picture || "/images/no-user-image.webp"}
            width={128}
            height={128}
            priority
            className="rounded-full border-2 border-primary object-cover"
          />

          {/* Name & Email */}
          <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
        </CardContent>
      </Card>
    </div>
  );
};

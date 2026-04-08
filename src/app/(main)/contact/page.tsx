import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "ติดต่อเรา - IT Store",
};

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[60vh]">
      <div className="inline-flex items-center px-4 py-1.5 mb-6 gap-2 rounded-full border border-primary/60">
        <Phone size={14} />
        <span>ช่องทางการติดต่อ</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">ติดต่อเรา</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        <div className="space-y-8">
          <p className="text-lg text-muted-foreground">
            หากคุณมีข้อสงสัยเกี่ยวกับสินค้า บริการ หรือต้องการคำปรึกษาเพิ่มเติม
            สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้ ทีมงานของเราพร้อมให้บริการในวันทำการ จันทร์ - ศุกร์
          </p>

          <div className="space-y-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">ที่อยู่ร้านค้า</h3>
                <p className="text-muted-foreground mt-1">
                  123 ถนนสุขุมวิท แขวงคลองเตย<br />เขตคลองเตย กรุงเทพมหานคร 10110
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">เบอร์โทรศัพท์</h3>
                <p className="text-muted-foreground mt-1">02-123-4567<br />089-123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">อีเมล</h3>
                <p className="text-muted-foreground mt-1">support@itstore.com</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>ส่งข้อความหาเรา</CardTitle>
              <CardDescription>
                กรุณากรอกรายละเอียดด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ - นามสกุล</Label>
                  <Input type="text" id="name" placeholder="กรอกชื่อของคุณ" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input type="email" id="email" placeholder="example@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">ข้อความ</Label>
                  <Textarea id="message" rows={4} placeholder="รายละเอียดที่ต้องการติดต่อ" />
                </div>

                <Button type="button" className="w-full mt-2">
                  ส่งข้อความ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;

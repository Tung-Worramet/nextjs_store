import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaFacebook, FaLine, FaPhone } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-neutral-800 leading-tight">
        ติดต่อเรา <br />
        เรายินดีให้บริการคุณ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="shadow-xl border border-neutral-200">
          <CardContent className="space-y-6 p-10">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ</Label>
              <Input
                id="name"
                placeholder="กรอกชื่อของคุณ"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">ข้อความ</Label>
              <Textarea
                id="message"
                placeholder="เขียนข้อความของคุณที่นี่..."
                rows={6}
                className="rounded-xl"
              />
            </div>

            <Button className="w-full rounded-xl text-lg py-6">
              ส่งข้อความ
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info + Map */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 space-y-5 shadow-xl">
            <h2 className="text-2xl font-semibold text-neutral-700">
              ข้อมูลการติดต่อ
            </h2>
            <p className="text-neutral-600">
              📍 123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ
            </p>
            <p className="flex items-center gap-3 text-neutral-700">
              <FaPhone className="text-blue-600" />
              <a href="tel:021234567" className="hover:underline">
                02-123-4567
              </a>
            </p>
            <p className="flex items-center gap-3 text-neutral-700">
              <FaLine className="text-green-500" />
              <a
                href="https://line.me/ti/p/your-line-id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @itstore
              </a>
            </p>
            <p className="flex items-center gap-3 text-neutral-700">
              <FaFacebook className="text-blue-800" />
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                facebook.com/ITStore
              </a>
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-neutral-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7274874081085!2d100.56002171533366!3d13.730134801290993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed5c5a7ef47%3A0xb4d8b5ddfb8070d5!2zMTIzIOC4o-C4reC4meC4tOC4peC4tOC5gOC4geC4meC5gOC4oeC4peC4tOC5gOC4iOC4sOC5ieC4reC4hOC4lOC5hOC4nuC4hOC4geC4meC4tSDguYDguJfguYHguKPguLLguITguJgu!5e0!3m2!1sth!2sth!4v1716100000000"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;

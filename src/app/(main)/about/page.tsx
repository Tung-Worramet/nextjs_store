import { Info } from "lucide-react";

export const metadata = {
  title: "เกี่ยวกับเรา - IT Store",
};

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <div className="inline-flex items-center px-4 py-1.5 mb-6 gap-2 rounded-full border border-primary/60">
        <Info size={14} />
        <span>เกี่ยวกับเรา</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">รู้จักกับ IT Store</h1>

      <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          ยินดีต้อนรับสู่ <strong className="text-foreground">IT Store</strong> ร้านค้าออนไลน์ที่รวบรวมสินค้าไอที สินค้าอิเล็กทรอนิกส์
          และอุปกรณ์แกดเจ็ตที่ทันสมัยที่สุด เราคัดสรรสินค้าคุณภาพจากแบรนด์ชั้นนำทั่วโลก เพื่อให้คุณได้สัมผัสเทคโนโลยีที่ดีที่สุดในราคาที่คุ้มค่า
        </p>

        <p>
          จุดเริ่มต้นของเรามาจากความหลงใหลในเทคโนโลยี และความต้องการที่จะสร้างพื้นที่ที่ผู้คนสามารถค้นหาอุปกรณ์ที่ตอบโจทย์ไลฟ์สไตล์และการทำงานได้อย่างแท้จริง
          ไม่ว่าคุณจะเป็นเกมเมอร์ ครีเอเตอร์ หรือวัยทำงาน เรามีสินค้าที่พร้อมตอบสนองทุกความต้องการของคุณ
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">ทำไมต้องเลือกเรา?</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong className="text-foreground">สินค้าของแท้ 100%</strong> - เราเป็นตัวแทนจำหน่ายที่ถูกต้องจากแบรนด์ชั้นนำ พร้อมการรับประกัน</li>
          <li><strong className="text-foreground">บริการจัดส่งรวดเร็ว</strong> - ส่งไว ทันใจ พร้อมระบบติดตามสถานะพัสดุที่คุณตรวจสอบได้ตลอดเวลา</li>
          <li><strong className="text-foreground">รับประกันสินค้า</strong> - มีบริการหลังการขาย และรับประกันสินค้าตามมาตรฐานสากล</li>
          <li><strong className="text-foreground">ทีมงานพร้อมช่วยเหลือ</strong> - ให้คำปรึกษาและแก้ไขปัญหาโดยทีมผู้เชี่ยวชาญทั้งก่อนและหลังการขาย</li>
        </ul>
      </div>
    </div>
  );
};
export default AboutPage;

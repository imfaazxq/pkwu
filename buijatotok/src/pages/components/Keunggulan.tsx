import React from 'react';

interface KeunggulanItemProps {
  icon: string;
  title: string;
  description: string;
}

const KeunggulanItem: React.FC<KeunggulanItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-left">
      <div className="mb-5">
        <img src={icon} alt={title} className="h-16 w-16" />
      </div>
      <div className="self-start ml-12">
        <h3 className="text-xl lora text-[#314C1C] font-bold">{title}</h3>
        <p className="text-[#58595B] max-w-xs mt-2">{description}</p>
      </div>
    </div>
  );
};

const Keunggulan: React.FC = () => {
  const keunggulanItems = [
    {
      icon: "/certificate.png",
      title: "Terapis Profesional dan Berlisensi",
      description: "Terapis kami memiliki lebih dari 20 tahun pengalaman dalam memberikan layanan terapi yang berkualitas. Dengan keahlian yang mendalam, setiap sesi terapi dirancang khusus untuk memenuhi kebutuhan dan tujuan pribadi Anda."
    },
    {
      icon: "/House.png",
      title: "Kenyamanan di Rumah",
      description: "Nikmati kenyamanan terapi langsung di rumah Anda. Terapis kami akan datang ke tempat Anda, sehingga Anda bisa merasa lebih rileks dan privat selama proses terapi."
    },
    {
      icon: "/Jam.png",
      title: "Layanan Fleksibel",
      description: "Jadwal terapi dapat diatur bersama, sesuai kenyamanan Anda dan terapis. Fleksibilitas dalam pengaturan waktu memastikan Anda mendapatkan layanan yang pas dengan jadwal dan kebutuhan Anda."
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl montserrat font-bold text-center mb-5">KEUNGGULAN THERAPI</h2>
        <p className="text-[#58595B] text-center mb-12 font-bold">Berikut beberapa keunggulan yang kami miliki:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keunggulanItems.map((item, index) => (
            <KeunggulanItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Keunggulan;

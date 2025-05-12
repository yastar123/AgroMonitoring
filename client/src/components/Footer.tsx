import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Daftar fitur
  const features = [
    { name: "Monitoring Suhu", icon: "temperature-half" },
    { name: "Monitoring Cahaya", icon: "sun" },
    { name: "Visualisasi Data", icon: "chart-line" },
    { name: "Analisis Real-time", icon: "bolt" }
  ];
  
  // Tautan cepat - gunakan ID untuk scroll to section
  const quickLinks = [
    { name: "Dashboard", path: "#dashboard" },
    { name: "Statistik", path: "#statistik" },
    { name: "Ringkasan", path: "#ringkasan" },
    { name: "Data Terbaru", path: "#data-terbaru" },
    { name: "Tentang", path: "#tentang" }
  ];

  // Informasi kontak
  const contactInfo = [
    { icon: "envelope", text: "contact@agromonitor.id" },
    { icon: "phone", text: "+62 812-3456-7890" },
    { icon: "map-marker-alt", text: "Jl. Pertanian 123, Indonesia" }
  ];

  return (
    <footer className="bg-gradient-to-b from-primary-dark to-primary-dark">
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-10 border-b border-white border-opacity-10">
          {/* Brand section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-full mr-2">
                <i className="fas fa-leaf text-primary text-xl"></i>
              </div>
              <h2 className="text-white text-xl font-bold">AgroMonitor</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Solusi monitoring pintar untuk pertanian modern. Kami menyediakan teknologi terkini untuk membantu petani meningkatkan hasil panen.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-accent-light transition-colors">
                <i className="fab fa-facebook-f bg-white bg-opacity-10 p-2 rounded-full w-8 h-8 flex items-center justify-center text-sm"></i>
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors">
                <i className="fab fa-twitter bg-white bg-opacity-10 p-2 rounded-full w-8 h-8 flex items-center justify-center text-sm"></i>
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors">
                <i className="fab fa-instagram bg-white bg-opacity-10 p-2 rounded-full w-8 h-8 flex items-center justify-center text-sm"></i>
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors">
                <i className="fab fa-linkedin-in bg-white bg-opacity-10 p-2 rounded-full w-8 h-8 flex items-center justify-center text-sm"></i>
              </a>
            </div>
          </div>
          
          {/* Features list */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Fitur Utama</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <i className={`fas fa-${feature.icon} text-accent-light mr-2 w-5`}></i>
                  <span className="text-gray-300 text-sm">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="text-gray-300 hover:text-accent-light transition-colors text-sm flex items-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.path);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <i className="fas text-white fa-chevron-right mr-2 text-xs"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <i className={`fas fa-${item.icon} text-accent-light mr-2 mt-1 w-5`}></i>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 bg-primary bg-opacity-30 rounded-lg p-3 text-sm text-gray-300">
              <p className="font-semibold text-white">Jam Operasional:</p>
              <p className="mt-1">Senin - Jumat: 08:00 - 17:00</p>
              <p>Sabtu: 09:00 - 15:00</p>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-3 md:mb-0">
              <p className="text-gray-300 text-sm">
                Dibuat oleh <span className="font-semibold text-white">Edu Juanda Pratama</span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs flex items-center justify-center md:justify-start">
                <i className="far fa-copyright mr-1"></i> {currentYear} AgroMonitor. Semua hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative plant element */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-12 left-0 text-primary-light opacity-10 transform rotate-45">
          <i className="fas fa-seedling text-9xl"></i>
        </div>
        <div className="absolute -top-16 right-0 text-primary-light opacity-10 transform -rotate-15">
          <i className="fas fa-leaf text-8xl"></i>
        </div>
      </div>
    </footer>
  );
}

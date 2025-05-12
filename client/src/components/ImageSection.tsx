export default function ImageSection() {
  const features = [
    {
      icon: "microchip",
      title: "Sensor Canggih",
      description: "BH1750 untuk intensitas cahaya dan DS18B20 untuk pengukuran suhu dengan akurasi tinggi."
    },
    {
      icon: "wifi",
      title: "Konektivitas Nirkabel",
      description: "Pengiriman data secara real-time melalui jaringan WiFi dari ESP32 ke database Firebase."
    },
    {
      icon: "chart-line",
      title: "Analisis Data",
      description: "Visualisasi grafik dan pemrosesan data untuk membantu pengambilan keputusan."
    },
    {
      icon: "bell",
      title: "Notifikasi Otomatis",
      description: "Peringatan saat kondisi berada di luar rentang optimal untuk pertumbuhan tanaman."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 overflow-hidden relative">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-light via-secondary-light to-accent-light"></div>
      
      <div className="flex flex-col gap-8">
        {/* Main title */}
        <div className="text-center">
          <h3 className="font-bold text-2xl text-neutral-darkest relative inline-block">
            Sistem Monitoring Modern
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary opacity-70 rounded-full"></div>
          </h3>
          <p className="text-neutral-dark mt-3 max-w-3xl mx-auto">
            Teknologi monitoring canggih yang dirancang khusus untuk memaksimalkan pertumbuhan tanaman 
            dan meningkatkan hasil panen dengan memantau parameter lingkungan secara real-time.
          </p>
        </div>
        
        {/* Images with captions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <div className="rounded-xl overflow-hidden mb-4 shadow-md transition-all duration-300 transform group-hover:shadow-xl group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                alt="Modern smart farming sensor system" 
                className="w-full h-64 md:h-72 object-cover object-center hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark to-transparent opacity-10"></div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary rounded-full p-2 text-white mr-3 mt-1 shadow-md">
                <i className="fas fa-leaf"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-neutral-darkest">Teknologi Sensor Monitoring</h4>
                <p className="text-neutral-dark mt-1">
                  Sistem kami menggunakan sensor presisi tinggi yang terhubung ke mikrokontroler ESP32 untuk 
                  memantau parameter penting seperti intensitas cahaya dan suhu. Data dikirim secara real-time 
                  ke cloud untuk pemantauan jarak jauh.
                </p>
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="rounded-xl overflow-hidden mb-4 shadow-md transition-all duration-300 transform group-hover:shadow-xl group-hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                alt="Modern greenhouse with monitoring technology" 
                className="w-full h-64 md:h-72 object-cover object-center hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-10"></div>
            </div>
            <div className="flex items-start">
              <div className="bg-secondary rounded-full p-2 text-white mr-3 mt-1 shadow-md">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-neutral-darkest">Manfaat Monitoring Berkelanjutan</h4>
                <p className="text-neutral-dark mt-1">
                  Pemantauan berkelanjutan memungkinkan petani untuk mengoptimalkan kondisi pertumbuhan tanaman, 
                  meningkatkan hasil panen, mengurangi penggunaan sumber daya, dan mengidentifikasi masalah 
                  sebelum menyebabkan kerusakan yang signifikan.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="bg-neutral-lightest rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary mb-4 text-white shadow-sm">
                <i className={`fas fa-${feature.icon} text-lg`}></i>
              </div>
              <h5 className="font-semibold mb-2 text-neutral-darkest">{feature.title}</h5>
              <p className="text-sm text-neutral-dark">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Call-to-action button */}
        <div className="flex justify-center mt-4">
          <button className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex items-center font-medium">
            <i className="fas fa-info-circle mr-2"></i>
            Pelajari Lebih Lanjut Tentang Sistem
          </button>
        </div>
      </div>
    </div>
  );
}

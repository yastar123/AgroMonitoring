export default function ImageSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
      <h3 className="font-semibold text-neutral-darkest mb-4">Sistem Monitoring</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="rounded-lg overflow-hidden mb-3">
            <img 
              src="https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
              alt="Modern smart farming sensor system" 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <h4 className="font-medium text-neutral-darkest">Teknologi Sensor Monitoring</h4>
          <p className="text-sm text-neutral-dark mt-1">Sistem monitoring menggunakan sensor BH1750 untuk intensitas cahaya dan DS18B20 untuk pengukuran suhu.</p>
        </div>
        <div>
          <div className="rounded-lg overflow-hidden mb-3">
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
              alt="Modern greenhouse with monitoring technology" 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <h4 className="font-medium text-neutral-darkest">Manfaat Monitoring</h4>
          <p className="text-sm text-neutral-dark mt-1">Pemantauan real-time memungkinkan petani untuk mengoptimalkan kondisi pertumbuhan dan meningkatkan hasil panen.</p>
        </div>
      </div>
    </div>
  );
}

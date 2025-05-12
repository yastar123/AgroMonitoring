export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <i className="fas fa-leaf text-accent mr-2"></i>
              <h2 className="text-lg font-semibold">AgroMonitor</h2>
            </div>
            <p className="text-sm mt-1 text-gray-300">Solusi monitoring pintar untuk pertanian modern</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-300 text-sm">Dibuat oleh <span className="font-semibold">Edu Juanda Pratama</span></p>
            <p className="text-gray-400 text-xs mt-1">© {new Date().getFullYear()} AgroMonitor. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

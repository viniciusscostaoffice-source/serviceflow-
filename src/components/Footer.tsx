export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary text-offwhite py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 overflow-hidden">
      {/* blur decorativo no topo do footer */}
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
      />
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
        <div>
          <h2 className="font-display text-2xl tracking-widest uppercase">
            Tor<span className="text-primary">ke</span> Oficina
          </h2>
        </div>

        <div className="text-gray-500 text-sm space-y-2">
          <p>Torke • CNPJ 12.345.678/0001-99 • Balsas-MA</p>
          <p>© {currentYear} Torke. Todos os direitos reservados.</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
          <a href="https://wa.me/5511999999999" className="hover:text-primary transition-colors">Contato WhatsApp</a>
        </div>
        
      </div>
    </footer>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary text-offwhite py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
        <div>
          <h2 className="font-display text-2xl tracking-widest uppercase">
            Service<span className="text-primary">Flow</span> Oficina
          </h2>
        </div>

        <div className="text-gray-500 text-sm space-y-2">
          <p>ServiceFlow • CNPJ 12.345.678/0001-99 • Balsas-MA</p>
          <p>© {currentYear} ServiceFlow. Todos os direitos reservados.</p>
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

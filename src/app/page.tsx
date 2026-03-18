export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-pixel-dark scanlines crt">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="nes-container is-dark with-title p-4">
            <p className="title text-xs pixel-text">SYSTEM</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl pixel-text text-pixel-light mb-2">
                  MISSION CONTROL
                </h1>
                <p className="text-[10px] text-pixel-gray pixel-text">
                  AGENT WORKFORCE DASHBOARD v1.0
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pixel-green rounded-full animate-pixel-pulse" />
                <span className="text-[10px] text-pixel-green pixel-text">ONLINE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="nes-container is-dark p-6">
            <h2 className="text-sm pixel-text text-pixel-yellow mb-4">
              WELCOME, COMMANDER
            </h2>
            <p className="text-xs text-pixel-light pixel-text leading-relaxed mb-4">
              Your agent workforce dashboard is initialized and ready.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="nes-container is-dark p-4">
                <p className="text-[10px] text-pixel-cyan pixel-text mb-2">STATUS</p>
                <p className="text-xs text-pixel-green pixel-text">OPERATIONAL</p>
              </div>
              <div className="nes-container is-dark p-4">
                <p className="text-[10px] text-pixel-cyan pixel-text mb-2">VERSION</p>
                <p className="text-xs text-pixel-light pixel-text">1.0.0</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] text-pixel-gray pixel-text">
            © 2026 MISSION CONTROL SYSTEM
          </p>
          <p className="text-[8px] text-pixel-gray mt-2 pixel-text">
            SECURE CONNECTION ESTABLISHED
          </p>
        </footer>
      </div>
    </div>
  );
}

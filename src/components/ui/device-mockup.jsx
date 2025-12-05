export const LaptopMockup = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Laptop Frame */}
      <div className="relative mx-auto" style={{ maxWidth: '100%' }}>
        {/* Screen */}
        <div className="relative bg-[#1a1a1a] dark:bg-[#0a0a0a] rounded-t-xl overflow-hidden shadow-2xl" style={{ padding: '0.4%' }}>
          {/* Screen Bezel */}
          <div className="bg-[#0f0f0f] dark:bg-[#050505] rounded-t-lg overflow-hidden" style={{ padding: '0.4%' }}>
            {/* Screen Content */}
            <div className="bg-background rounded-md overflow-hidden aspect-video shadow-inner">
              {children}
            </div>
          </div>
        </div>
        
        {/* Keyboard Base */}
        <div className="relative mx-auto" style={{ width: '108%', marginLeft: '-4%' }}>
          <div className="bg-[#1a1a1a] dark:bg-[#0a0a0a] rounded-b-2xl h-5 shadow-2xl" style={{ marginTop: '-1px' }} />
          <div className="bg-[#0f0f0f] dark:bg-[#050505] rounded-b-xl h-2.5 mx-auto" style={{ width: '12%', marginTop: '-5px' }} />
        </div>
      </div>
    </div>
  )
}

export const DesktopMockup = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monitor Frame */}
      <div className="relative mx-auto" style={{ maxWidth: '100%' }}>
        {/* Screen */}
        <div className="relative bg-[#1a1a1a] dark:bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl" style={{ padding: '0.8%' }}>
          {/* Screen Bezel */}
          <div className="bg-[#0f0f0f] dark:bg-[#050505] rounded-lg overflow-hidden" style={{ padding: '0.5%' }}>
            {/* Screen Content */}
            <div className="bg-background rounded-md overflow-hidden aspect-video shadow-inner">
              {children}
            </div>
          </div>
        </div>
        
        {/* Monitor Stand */}
        <div className="relative mx-auto mt-3" style={{ width: '35%' }}>
          <div className="bg-[#1a1a1a] dark:bg-[#0a0a0a] h-4 rounded-t-lg" />
          <div className="bg-[#0f0f0f] dark:bg-[#050505] h-2.5 rounded-b-lg mx-auto" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  )
}


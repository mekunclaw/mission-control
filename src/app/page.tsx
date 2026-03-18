import { MissionControlHeader } from '@/components/MissionControlHeader'
import { StatusPanel } from '@/components/StatusPanel'
import { IssueList } from '@/components/IssueList'
import { ActivityFeed } from '@/components/ActivityFeed'
import { SystemInfo } from '@/components/SystemInfo'

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Mission Control branding */}
        <MissionControlHeader />
        
        {/* Main Dashboard Content */}
        <main className="space-y-6">
          {/* Status Overview Cards */}
          <StatusPanel />
          
          {/* Two Column Layout for Issues and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IssueList />
            <ActivityFeed />
          </div>
          
          {/* System Information */}
          <SystemInfo />
        </main>
        
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t-4 border-black">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-pixel-gray pixel-text">
                MISSION CONTROL v1.0
              </p>
              <p className="text-[10px] text-pixel-gray mt-1 pixel-text">
                AGENT WORKFORCE DASHBOARD
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/mekunclaw/mission-control" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nes-btn is-primary text-[8px] pixel-text"
              >
                <i className="nes-icon github is-small"></i>
                GITHUB
              </a>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-pixel-gray pixel-text">POWERED BY</span>
                <span className="nes-badge">
                  <span className="is-primary text-[8px] pixel-text">OPENCLAW</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-[8px] text-pixel-gray pixel-text">
              © 2024 DREAM MAKER TEAM • ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

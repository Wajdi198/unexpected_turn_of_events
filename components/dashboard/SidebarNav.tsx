'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Upload, 
  MessageSquare, 
  FileText, 
  Bell, 
  Settings,
  LogOut,
  Sparkles,
  BrainCircuit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface SidebarNavProps {
  activePage?: string
}

const navItems = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'institutions', name: 'Institutions', href: '/dashboard/institutions', icon: Building2 },
  { id: 'upload', name: 'Upload Data', href: '/upload', icon: Upload },
  { id: 'chat', name: 'Ask UCARiq', href: '/dashboard/chat', icon: MessageSquare },
  { id: 'reports', name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { id: 'intelligence', name: 'Intelligence', href: '/dashboard/intelligence', icon: Sparkles, isNew: true },
  { id: 'alerts', name: 'Alerts', href: '/dashboard/alerts', icon: Bell, hasAlert: true },
  { id: 'settings', name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function SidebarNav({ activePage }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hasCriticalAlerts, setHasCriticalAlerts] = useState(false)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('ucariq_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setUser({ name: "Pr. Sami Ben Naceur", role: "Rectorate", initials: "SB", bgColor: "bg-indigo-600" })
    }

    // Check for critical alerts to show the red dot
    const checkAlerts = async () => {
      const { count } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .eq('resolved', false)
      
      setHasCriticalAlerts((count || 0) > 0)
    }
    checkAlerts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ucariq_user')
    router.push('/login')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-slate-950 text-slate-300 border-r border-slate-900">
      <div className="flex h-20 items-center px-6">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          UCAR<span className="text-indigo-500">iq</span>
        </Link>
      </div>
      
      <div className="px-6 mb-6">
        {user?.institutionId ? (
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
            DEAN VIEW · {user.name.split(' ').pop()}
          </div>
        ) : (
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
            RECTORATE VIEW
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = activePage ? activePage === item.id : pathname === item.href
          const showDot = item.id === 'alerts' && hasCriticalAlerts
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                  : 'hover:bg-slate-900 hover:text-white'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-5 w-5 transition-colors',
                isActive ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-300',
                item.isNew && !isActive && 'text-indigo-400 animate-pulse'
              )} />
              <span className="flex-1">{item.name}</span>
              {item.isNew && !isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-ping" />
              )}
              {showDot && (
                <span className="ml-auto h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-800 transition-all group-hover:border-indigo-500",
            user?.bgColor || 'bg-indigo-600'
          )}>
            {user?.initials || 'SB'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{user?.name || 'Pr. Sami Ben Naceur'}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{user?.role?.split(' · ')[0] || 'Rectorate'}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all uppercase tracking-widest"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

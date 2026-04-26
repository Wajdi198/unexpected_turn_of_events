'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, ChevronDown, Calendar, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export function TopBar({ title = "Network Overview", subtitle = "Real-time intelligence across UCAR" }: { title?: string, subtitle?: string }) {
  const now = new Date()
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('ucariq_user')
    if (savedUser) {
      setUserName(JSON.parse(savedUser).name)
    } else {
      setUserName('Pr. Sami Ben Naceur')
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-8 sticky top-0 z-40">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Calendar className="h-3 w-3 text-indigo-500" />
          <span>{format(now, 'EEEE, d MMMM yyyy')}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 text-slate-300 text-xs font-bold rounded-lg border border-slate-800">
            <UserIcon size={14} className="text-indigo-400" />
            {userName}
          </div>

          <Button 
            onClick={() => router.push('/dashboard/reports?auto=true')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest h-9 px-5 shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
          >
            Generate Report
          </Button>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { Layout, Settings } from 'lucide-react'

export function Sidebar() {
    return (
        <aside style={{ width: 250, borderRight: '1px solid var(--surface-border)', height: '100vh', position: 'fixed', left: 0, top: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WidgetAssist" style={{ width: '70%', height: 'auto' }} />
            </div>

            <nav style={{ padding: '0 12px' }}>
                <SidebarItem href="/dashboard" icon={<Layout size={18} />} label="My Widgets" />
                <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
            </nav>
        </aside >
    )
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            color: '#94a3b8',
            borderRadius: 8,
            transition: 'all 0.2s',
            marginBottom: 4
        }}>
            {icon}
            <span>{label}</span>
        </Link>
    )
}

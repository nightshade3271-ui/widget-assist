'use client'

import React, { useState } from 'react'
import { Button, Input, Label, Textarea } from '@/components/ui-elements'
import { updateWidget, createFAQ, deleteFAQ, deleteWidget } from '@/lib/actions'
import { Widget, FAQ } from '@prisma/client'
import { Save, MessageSquare, Code, Settings, Trash2, BarChart, Users, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import clsx from 'clsx'

export default function WidgetEditor({ widget, stats }: { widget: Widget & { faqs: FAQ[], avatarUrl?: string | null, bannerUrl?: string | null }, stats: any }) {
    const [activeTab, setActiveTab] = useState<'settings' | 'faq' | 'embed' | 'analytics' | 'leads'>('settings')

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 className="heading-lg">{widget.name}</h1>
                    <p style={{ color: 'var(--secondary)' }}>{widget.companyName}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', padding: 4, borderRadius: 12, border: '1px solid var(--surface-border)' }}>
                    <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={16} />} label="Settings" />
                    <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={<MessageSquare size={16} />} label="Knowledge Base" />
                    <TabButton active={activeTab === 'embed'} onClick={() => setActiveTab('embed')} icon={<Code size={16} />} label="Install" />
                    <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart size={16} />} label="Analytics" />
                    <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<Users size={16} />} label="Leads" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
                <div>
                    {activeTab === 'settings' && <SettingsForm widget={widget} />}
                    {activeTab === 'faq' && <FAQManager widgetId={widget.id} faqs={widget.faqs} />}
                    {activeTab === 'embed' && <EmbedCode widgetId={widget.id} />}
                    {activeTab === 'analytics' && <AnalyticsView stats={stats} />}
                    {activeTab === 'leads' && <LeadsView widgetId={widget.id} />}
                </div>

                {/* Live Preview */}
                <div style={{ position: 'sticky', top: 40 }}>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Live Preview</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Updates on save</span>
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, height: 550, position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ background: widget.primaryColor, padding: '6px 12px', color: 'white', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative', zIndex: 2, borderBottom: '2px solid rgba(0,0,0,0.15)' }}>
                            <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{widget.name}</span>
                            <span style={{ opacity: 0.5, fontSize: 11 }}>·</span>
                            <span style={{ fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{widget.companyName}</span>
                        </div>

                        {/* Banner Preview */}
                        {widget.bannerUrl && (
                            <div style={{ width: '100%', height: 100, overflow: 'hidden', flexShrink: 0, position: 'relative', zIndex: 1, lineHeight: 0 }}>
                                <img src={widget.bannerUrl} alt="Banner" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block', margin: 0, padding: 0 }} />
                            </div>
                        )}

                        {/* Messages */}
                        <div style={{ padding: 16, flex: 1, background: '#f8fafc', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                {widget.avatarUrl ? (
                                    <img src={widget.avatarUrl} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="AI" />
                                ) : (
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: widget.primaryColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>AI</div>
                                )}
                                <div style={{ background: 'white', padding: '12px 16px', borderRadius: '0 12px 12px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '85%', color: '#334155', fontSize: 14 }}>
                                    {widget.welcomeMessage}
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div style={{ padding: 16, background: 'white', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
                            <input disabled placeholder="Type a message..." style={{ width: '100%', padding: 12, borderRadius: 24, border: '1px solid #e2e8f0', background: '#f1f5f9' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
                background: active ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: active ? 'white' : 'var(--secondary)',
                fontWeight: active ? 600 : 500,
                border: active ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: active ? 'none' : 'none'
            }}
            onMouseDown={(e) => {
                const target = e.currentTarget
                target.style.transform = 'scale(0.95)'
            }}
            onMouseUp={(e) => {
                const target = e.currentTarget
                target.style.transform = 'scale(1)'
            }}
            onMouseLeave={(e) => {
                const target = e.currentTarget
                target.style.transform = 'scale(1)'
            }}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}


function DeleteWidgetButton({ widgetId }: { widgetId: string }) {
    const [confirming, setConfirming] = useState(false)

    const handleClick = () => {
        if (!confirming) {
            setConfirming(true)
            // Reset after 3 seconds if not confirmed
            setTimeout(() => setConfirming(false), 3000)
        }
    }

    return (
        <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: 12 }}>Danger Zone</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: 16 }}>
                Once you delete a widget, there is no going back. Please be certain.
            </p>
            {confirming ? (
                <form action={deleteWidget.bind(null, widgetId)}>
                    <Button type="submit" style={{ background: '#ef4444', color: 'white', border: '1px solid #ef4444' }}>
                        <Trash2 size={16} /> Confirm Delete — Click to permanently delete
                    </Button>
                    <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        style={{ marginLeft: 12, background: 'none', border: '1px solid var(--surface-border)', color: 'var(--secondary)', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <Button
                    type="button"
                    onClick={handleClick}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                    <Trash2 size={16} /> Delete Widget
                </Button>
            )}
        </div>
    )
}

function SettingsForm({ widget }: { widget: any }) {
    const [primaryColor, setPrimaryColor] = useState(widget.primaryColor || '#8b5cf6')
    const [secondaryColor, setSecondaryColor] = useState(widget.secondaryColor || '#64748b')

    const handlePrimarySwatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrimaryColor(e.target.value)
    }
    const handlePrimaryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setPrimaryColor(val)
    }
    const handleSecondarySwatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecondaryColor(e.target.value)
    }
    const handleSecondaryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSecondaryColor(val)
    }

    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <form action={updateWidget.bind(null, widget.id)}>
                <input type="hidden" name="id" value={widget.id} />

                {/* Identity */}
                <div style={{ marginBottom: 20 }}>
                    <Label>Bot Name</Label>
                    <Input name="name" defaultValue={widget.name} />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <Label>Company Name</Label>
                    <Input name="companyName" defaultValue={widget.companyName} />
                </div>

                {/* Behavior */}
                <div style={{ marginBottom: 20 }}>
                    <Label>Welcome Message</Label>
                    <Textarea name="welcomeMessage" className="input" rows={3} defaultValue={widget.welcomeMessage} />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <Label>System Prompt (Personality)</Label>
                    <Textarea name="systemPrompt" className="input" rows={5} defaultValue={widget.systemPrompt} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>Define how the AI should behave.</p>
                </div>

                {/* Appearance */}
                <div style={{ marginBottom: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ImageIcon size={20} /> Appearance
                    </h3>

                    {/* Colors */}
                    <div className="grid-cols-2" style={{ marginBottom: 20 }}>
                        <div>
                            <Label>Primary Color</Label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={handlePrimarySwatchChange}
                                    className="input"
                                    style={{ width: 50, padding: 2, height: 40, cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    name="primaryColor"
                                    value={primaryColor}
                                    onChange={handlePrimaryTextChange}
                                    className="input"
                                    placeholder="#8b5cf6"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Secondary Color</Label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={handleSecondarySwatchChange}
                                    className="input"
                                    style={{ width: 50, padding: 2, height: 40, cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    name="secondaryColor"
                                    value={secondaryColor}
                                    onChange={handleSecondaryTextChange}
                                    className="input"
                                    placeholder="#64748b"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar URL */}
                    <div style={{ marginBottom: 20 }}>
                        <Label>Avatar Image URL</Label>
                        <Input name="avatarUrl" defaultValue={widget.avatarUrl} placeholder="https://example.com/avatar.png" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>
                            <LinkIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            Paste a direct link to your avatar image. Displayed on the chat bubble and next to messages.
                        </p>
                    </div>

                    {/* Banner URL */}
                    <div style={{ marginBottom: 0 }}>
                        <Label>Banner Image URL</Label>
                        <Input name="bannerUrl" defaultValue={widget.bannerUrl} placeholder="https://example.com/banner.png" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>
                            <LinkIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            Paste a direct link to your banner image. Recommended size: <strong>350 × 100px</strong>. Displayed at the top of the chat window.
                        </p>
                    </div>
                </div>

                {/* Lead Capture Settings */}
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Lead Capture Settings</h3>

                    <div style={{ marginBottom: 20 }}>
                        <Label>Lead Popup Message</Label>
                        <Input name="leadFormMessage" defaultValue={widget.leadFormMessage} placeholder="Interested? Let's connect!" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>Message shown in the lead capture popup.</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <Label>Trigger Keywords (comma-separated)</Label>
                        <Textarea name="leadKeywords" className="input" rows={2} defaultValue={widget.leadKeywords} placeholder="price,pricing,cost,interested,quote" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>Popup appears when user or AI mentions these words.</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <Label>Message Count Trigger</Label>
                        <Input type="number" name="leadMessageThreshold" defaultValue={widget.leadMessageThreshold} min="1" max="20" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>Show popup after this many messages (even without keywords).</p>
                    </div>
                </div>

                <Button type="submit">
                    <Save size={16} /> Save Changes
                </Button>
            </form>

            <DeleteWidgetButton widgetId={widget.id} />
        </div>
    )
}

function FAQManager({ widgetId, faqs }: { widgetId: string, faqs: any[] }) {
    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Add New FAQ</h3>
                <form action={createFAQ.bind(null, widgetId)} style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                    <Input name="question" placeholder="Question (e.g. What are your hours?)" required />
                    <Textarea name="answer" placeholder="Answer" className="input" rows={2} required />
                    <Button type="submit" variant="secondary" style={{ alignSelf: 'flex-start' }}>Add FAQ</Button>
                </form>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Existing FAQs ({faqs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {faqs.map(faq => (
                    <div key={faq.id} style={{ padding: 16, border: '1px solid var(--surface-border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'start', background: 'rgba(255,255,255,0.02)' }}>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 4, color: '#e2e8f0' }}>{faq.question}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{faq.answer}</div>
                        </div>
                        <form action={deleteFAQ.bind(null, faq.id, widgetId)}>
                            <button style={{ color: '#ef4444', opacity: 0.6, background: 'none', border: 'none', padding: 4 }} title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </form>
                    </div>
                ))}
                {faqs.length === 0 && <div style={{ color: 'var(--secondary)', textAlign: 'center', padding: 20 }}>No FAQs yet.</div>}
            </div>
        </div>
    )
}

function EmbedCode({ widgetId }: { widgetId: string }) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'
    const code = `<script src="${origin}/widget.js" data-widget-id="${widgetId}" defer></script>`

    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Install on your website</h3>
            <p style={{ color: 'var(--secondary)', marginBottom: 24 }}>Copy and paste this code just before the closing &lt;/body&gt; tag of your website.</p>

            <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0f172a', padding: 20, borderRadius: 8, overflowX: 'auto', border: '1px solid #334155', color: '#f8fafc', fontFamily: 'monospace' }}>
                    {code}
                </pre>
                <Button
                    variant="secondary"
                    style={{ position: 'absolute', top: 12, right: 12 }}
                    onClick={() => navigator.clipboard.writeText(code)}
                >
                    Copy
                </Button>
            </div>
        </div>
    )
}

function AnalyticsView({ stats }: { stats: any }) {
    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>Total Conversations</div>
                    <div className="heading-lg" style={{ fontSize: '2.5rem' }}>{stats.totalConversations}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>Total Messages</div>
                    <div className="heading-lg" style={{ fontSize: '2.5rem' }}>{stats.totalMessages}</div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Recent Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.recentConversations.map((conv: any) => (
                    <div key={conv.id} style={{ padding: 16, border: '1px solid var(--surface-border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Session {conv.id.slice(-6)}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(conv.updatedAt).toLocaleString()}</div>
                        </div>
                        <div className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>
                            {conv._count.messages} msgs
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function LeadsView({ widgetId }: { widgetId: string }) {
    const [leads, setLeads] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch(`/api/leads?widgetId=${widgetId}`)
            .then(res => res.json())
            .then(data => {
                setLeads(data.leads || [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load leads:', err)
                setLoading(false)
            })
    }, [widgetId])

    if (loading) {
        return (
            <div className="glass-panel fade-in" style={{ padding: 24, textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary)' }}>Loading leads...</p>
            </div>
        )
    }

    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>Captured Leads</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>Contact information collected from conversations</p>
                </div>
                <div className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '8px 16px', borderRadius: 8, fontSize: '1rem', fontWeight: 600 }}>
                    {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
                </div>
            </div>

            {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--secondary)' }}>
                    <Users size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p>No leads captured yet.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: 8 }}>Leads will appear here when visitors show interest and fill out the form.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {leads.map((lead: any) => (
                        <div key={lead.id} style={{ padding: 20, border: '1px solid var(--surface-border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{lead.name}</div>
                                    <a href={`mailto:${lead.email}`} style={{ color: '#a78bfa', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        {lead.email}
                                    </a>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>
                                    {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginTop: 12 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: 4 }}>Interest:</div>
                                <div style={{ color: '#e2e8f0' }}>{lead.interest}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


import Header from "../components/common/Header";
import { useEffect, useState } from "react";

const defaultRules = [
    { id: 1, name: "Revenue drop > 10%", channel: "Email", threshold: -10, enabled: true },
    { id: 2, name: "Low stock < 20 items", channel: "Slack", threshold: 20, enabled: true },
];

const AlertsPage = () => {
    const [rules, setRules] = useState(() => {
        const saved = localStorage.getItem("alert_rules");
        return saved ? JSON.parse(saved) : defaultRules;
    });

    useEffect(() => {
        localStorage.setItem("alert_rules", JSON.stringify(rules));
    }, [rules]);

    const toggle = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

    const addRule = () => {
        const id = Date.now();
        setRules(prev => [...prev, { id, name: "New rule", channel: "Email", threshold: 0, enabled: false }]);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Alerts' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <div className='card p-6 mb-4 flex items-center justify-between'>
                    <div>
                        <h2 className='text-lg font-semibold' style={{ color: "rgb(var(--text))" }}>Alert Rules</h2>
                        <p className='muted text-sm'>Configure thresholds and delivery channels.</p>
                    </div>
                    <button className='btn btn-primary' onClick={addRule}>Add Rule</button>
                </div>

                <div className='card'>
                    <table className='w-full text-sm' style={{ color: "rgb(var(--text))" }}>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 text-left muted'>Name</th>
                                <th className='px-4 py-2 text-left muted'>Channel</th>
                                <th className='px-4 py-2 text-left muted'>Threshold</th>
                                <th className='px-4 py-2 text-left muted'>Status</th>
                                <th className='px-4 py-2 text-left muted'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(rule => (
                                <tr key={rule.id} className='hover:opacity-90'>
                                    <td className='px-4 py-2'>
                                        <input className='border rounded px-2 py-1' style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))" }} value={rule.name} onChange={(e) => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, name: e.target.value } : r))} />
                                    </td>
                                    <td className='px-4 py-2'>
                                        <select className='border rounded px-2 py-1' style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))" }} value={rule.channel} onChange={(e) => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, channel: e.target.value } : r))}>
                                            <option>Email</option>
                                            <option>Slack</option>
                                            <option>Webhook</option>
                                        </select>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <input type='number' className='border rounded px-2 py-1 w-28' style={{ borderColor: "rgb(var(--border))", backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))" }} value={rule.threshold} onChange={(e) => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, threshold: Number(e.target.value) } : r))} />
                                    </td>
                                    <td className='px-4 py-2'>
                                        <span className='px-2 py-1 rounded text-xs' style={{ backgroundColor: rule.enabled ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: rule.enabled ? "rgb(var(--accent))" : "rgb(var(--danger))" }}>{rule.enabled ? "Enabled" : "Disabled"}</span>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <button className='btn mr-2' onClick={() => toggle(rule.id)}>{rule.enabled ? "Disable" : "Enable"}</button>
                                        <button className='btn' onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AlertsPage;



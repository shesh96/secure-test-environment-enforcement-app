import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const LogViewerModal = ({ attemptId, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/logs?attemptId=${attemptId}`);
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (error) {
                console.error('Failed to load logs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchLogs();
        }
    }, [attemptId]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-zinc-700 animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50 rounded-t-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Session Logs</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{attemptId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Log Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 dark:bg-black/20">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No logs found for this session.
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm flex items-start gap-4">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.eventType.includes('VIOLATION') || log.eventType.includes('EXIT') || log.eventType.includes('SWITCH')
                                        ? 'bg-red-500'
                                        : 'bg-green-500'
                                    }`}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
                                            {log.eventType.replace(/_/g, ' ')}
                                        </p>
                                        <span className="text-xs text-gray-400 font-mono whitespace-nowrap ml-4">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <pre className="mt-2 text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-black/30 p-2 rounded-lg overflow-x-auto">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors"
                    >
                        Close Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

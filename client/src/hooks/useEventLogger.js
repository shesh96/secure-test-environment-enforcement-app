import { useState, useEffect, useCallback } from 'react';

const BATCH_INTERVAL = 5000; // Send logs every 5 seconds
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/logs/batch`;

export const useEventLogger = (attemptId) => {
    const [logs, setLogs] = useState([]);

    // Add a new log entry
    const logEvent = useCallback((eventType, metadata = {}) => {
        const newLog = {
            attemptId,
            eventType,
            timestamp: new Date().toISOString(),
            metadata,
        };

        console.log('[Security Event]', eventType, metadata);

        // Optimistic UI: Add to local state immediately
        setLogs((prevLogs) => [...prevLogs, newLog]);

        // Also persist to localStorage for recovery
        const storedLogs = JSON.parse(localStorage.getItem('exam_logs') || '[]');
        localStorage.setItem('exam_logs', JSON.stringify([...storedLogs, newLog]));
    }, [attemptId]);

    // Flush logs to backend periodically
    useEffect(() => {
        if (!attemptId) return;

        const interval = setInterval(async () => {
            const storedLogs = JSON.parse(localStorage.getItem('exam_logs') || '[]');

            if (storedLogs.length === 0) return;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ logs: storedLogs }),
                });

                if (response.ok) {
                    // Clear successfully sent logs from localStorage
                    // Note: In a real app, we might need more robust sync logic (e.g., removing only sent IDs)
                    // For now, we clear all assuming robust batch send.
                    localStorage.removeItem('exam_logs');
                    // We don't clear React state 'logs' because we might want to show history in UI
                } else {
                    console.warn('Failed to sync logs');
                }
            } catch (error) {
                console.error('Network error syncing logs:', error);
            }
        }, BATCH_INTERVAL);

        return () => clearInterval(interval);
    }, [attemptId]);

    return { logEvent, logs };
};

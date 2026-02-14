import { useEffect } from 'react';

export const SecurityMonitor = ({ onViolation, logEvent }) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onViolation('Tab Switch Detected');
                logEvent('TAB_SWITCH', { hidden: true });
            } else {
                logEvent('TAB_SWITCH', { hidden: false });
            }
        };

        const handleBlur = () => {
            onViolation('Focus Lost (Window Blur)');
            logEvent('WINDOW_BLUR');
        };

        const handleFocus = () => {
            logEvent('FOCUS_RESTORED');
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                onViolation('Exited Fullscreen Mode');
                logEvent('FULLSCREEN_EXIT');
            }
        };

        const handleCopy = (e) => {
            e.preventDefault();
            onViolation('Copying content is disabled');
            logEvent('COPY_ATTEMPT');
        };

        const handlePaste = (e) => {
            e.preventDefault();
            onViolation('Pasting content is disabled');
            logEvent('PASTE_ATTEMPT');
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            logEvent('CONTEXT_MENU');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [onViolation, logEvent]);

    return null;
};

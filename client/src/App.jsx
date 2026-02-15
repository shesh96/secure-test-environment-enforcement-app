import { useState, useRef } from 'react';
import { SecurityMonitor } from './components/SecurityMonitor';
import { ViolationModal } from './components/ViolationModal';
import { LogViewerModal } from './components/LogViewerModal';
import { useEventLogger } from './hooks/useEventLogger';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [examStarted, setExamStarted] = useState(false);
  const [violation, setViolation] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [showLogs, setShowLogs] = useState(false);
  const [attemptId] = useState(uuidv4());

  const { logEvent } = useEventLogger(attemptId);

  const containerRef = useRef(null);

  const startExam = async () => {
    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        await containerRef.current.webkitRequestFullscreen();
      }
      setExamStarted(true);
      logEvent('EXAM_START');
    } catch (err) {
      console.error("Fullscreen denied:", err);
      alert("Please allow fullscreen to start the exam.");
    }
  };

  const handleViolation = (message) => {
    setViolation(message);
    setViolationCount(prev => prev + 1);
  };

  const dismissViolation = () => {
    setViolation(null);
    logEvent('FOCUS_RESTORED', { action: 'dismiss_warning' });

    // Attempt to re-enter fullscreen if lost
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => { });
    }
  };

  const [examFinished, setExamFinished] = useState(false);

  const finishExam = () => {
    setExamFinished(true);
    logEvent('EXAM_SUBMIT');
    // Exit fullscreen (optional, browser might require user gesture)
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 flex flex-col ${examFinished ? 'h-screen overflow-hidden' : ''}`}
    >
      {/* Header */}
      <header className={`w-full bg-white dark:bg-zinc-800 shadow-sm px-8 py-4 flex justify-between items-center z-10 border-b border-gray-200 dark:border-zinc-700 transition-all duration-500 ${examFinished ? '-mt-24 opacity-0 absolute' : ''}`}>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SecureExam<span className="font-light text-gray-400">Pro</span>
        </h1>
        {examStarted && !examFinished && (
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800">
              Violations: {violationCount}
            </div>
            <div className="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
              Time Remaining: 45:00
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col w-full mx-auto ${!examStarted ? 'p-0 max-w-none' : 'p-6 max-w-7xl items-center justify-center'}`}>
        {!examStarted ? (
          <div className="w-full h-full flex flex-col md:flex-row animate-fade-in-up relative">
            {/* Decorative Background Element - Full Width */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 z-50"></div>

            {/* Left Side: Call to Action */}
            <div className="p-12 md:p-20 text-center md:text-left flex flex-col justify-center md:w-1/2 bg-white dark:bg-zinc-800 relative overflow-hidden">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl rotate-3 mx-auto md:mx-0 mb-8 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
                <span className="text-3xl" role="img" aria-label="rocket">🚀</span>
              </div>
              <h2 className="text-4xl md:text-3xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight leading-tight">
                Ready to take your<br />
                <span className="text-indigo-600 dark:text-indigo-400">Secure Assessment?</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
                This environment is monitored to ensure the highest standards of integrity.
                Please review the rules on the right before beginning.
              </p>
              <button
                onClick={startExam}
                className="w-auto group relative flex items-center justify-center py-3 px-8 border border-transparent text-base font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:translate-y-[-2px] shadow-lg shadow-green-500/20 mx-auto md:mx-0"
              >
                <span className="mr-2">Start Exam</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="rounded" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Right Side: Rules */}
            <div className="bg-gray-50 dark:bg-zinc-900 p-12 md:p-20 md:w-1/2 border-l border-gray-100 dark:border-zinc-800 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Strictly Enforced Rules</h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 text-red-500 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Fullscreen Mode Enforced</p>
                    <p className="text-sm text-red-500 font-medium mt-1">Application must remain in fullscreen at all times. Exiting triggers a violation.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 text-red-500 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /> </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Tab Switching Prohibited</p>
                    <p className="text-sm text-red-500 font-medium mt-1">Leaving the screen or switching tabs is immediately recorded.</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 text-indigo-500 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">Activity is Monitored</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We log all interactions for audit purposes.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        ) : examFinished ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4 animate-fade-in">
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-12 text-center max-w-md w-full animate-bounce-in">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Exam Completed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Your answers have been submitted securely.
                <br />
                You may now close this window.
              </p>
              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-zinc-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Session ID</p>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">{attemptId}</p>
              </div>

              <button
                onClick={() => setShowLogs(true)}
                className="mt-6 w-full py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
              >
                View Session Logs
              </button>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-6 animate-fade-in-up">
            <SecurityMonitor onViolation={handleViolation} logEvent={logEvent} />

            {/* Question Card */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 p-8 flex-1">
              <span className="text-xs font-bold tracking-wider text-indigo-500 uppercase mb-2 block">Question 1 of 10</span>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Explain the significance of the "This feature is intended for high-stakes / employer-vetted assessments" requirement in the context of system security.
              </h3>
              <textarea
                className="w-full h-64 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-black focus:ring-0 transition-all resize-none text-gray-700 dark:text-gray-300 text-lg"
                placeholder="Type your answer here..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-4">
              <button className="px-6 py-3 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700 font-medium transition-colors">
                Previous
              </button>
              <button
                onClick={finishExam}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Submit Exam
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Violation Modal */}
      {violation && (
        <ViolationModal message={violation} onClose={dismissViolation} />
      )}

      {/* Log Viewer Modal */}
      {showLogs && (
        <LogViewerModal attemptId={attemptId} onClose={() => setShowLogs(false)} />
      )}
    </div>
  );
}

export default App;

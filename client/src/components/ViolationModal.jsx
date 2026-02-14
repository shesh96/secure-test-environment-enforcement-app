import React from 'react';

export const ViolationModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-red-500 rounded-lg shadow-2xl p-8 max-w-md w-full animate-bounce-in">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Violation Detected</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <p className="text-sm text-red-500 mb-6 font-semibold">Your actions are being recorded.</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        I Understand, Return to Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

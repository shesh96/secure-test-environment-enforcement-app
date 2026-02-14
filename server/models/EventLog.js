const mongoose = require('mongoose');

const EventLogSchema = new mongoose.Schema({
  attemptId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: [
      'TAB_SWITCH',
      'WINDOW_BLUR',
      'FULLSCREEN_EXIT',
      'COPY_ATTEMPT',
      'PASTE_ATTEMPT',
      'CONTEXT_MENU',
      'DEV_TOOLS_OPEN',
      'EXAM_START',
      'EXAM_SUBMIT',
      'FOCUS_RESTORED'
    ],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});
 
// Index for efficient querying by attempt 
EventLogSchema.index({ attemptId: 1, timestamp: 1 });

module.exports = mongoose.model('EventLog', EventLogSchema);

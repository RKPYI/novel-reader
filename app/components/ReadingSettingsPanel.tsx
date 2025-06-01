import React from 'react';
import { ReadingSettings } from '../hooks/useChapterReader';

interface ReadingSettingsPanelProps {
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  onMarkAsRead: () => Promise<void>;
  onClose: () => void;
  isRead: boolean;
}

export const ReadingSettingsPanel: React.FC<ReadingSettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onMarkAsRead,
  onClose,
  isRead
}) => {
  return (
    <div className="mb-6 p-4 bg-grey-950/30 border border-grey-800/30 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-grey-300">Reading Settings</h3>
        <button
          onClick={onClose}
          className="text-grey-400 hover:text-grey-300 text-xl"
          aria-label="Close settings"
        >
          ×
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Font size */}
        <div>
          <label className="block text-sm text-grey-400 mb-2">Font Size</label>
          <input
            type="range"
            min="14"
            max="24"
            value={settings.fontSize}
            onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-grey-300">{settings.fontSize}px</span>
        </div>

        {/* Line height */}
        <div>
          <label className="block text-sm text-grey-400 mb-2">Line Height</label>
          <input
            type="range"
            min="1.4"
            max="2.0"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => onUpdateSettings({ lineHeight: parseFloat(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-grey-300">{settings.lineHeight}</span>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm text-grey-400 mb-2">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => onUpdateSettings({ theme: e.target.value as 'dark' | 'sepia' | 'light' })}
            className="w-full p-2 bg-grey-900/30 border border-grey-800/30 rounded text-grey-100"
          >
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Mark as read button */}
        <div className="flex items-end">
          <button
            onClick={onMarkAsRead}
            disabled={isRead}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isRead 
                ? 'bg-green-600/50 text-green-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRead ? '✓ Read' : 'Mark as Read'}
          </button>
        </div>
      </div>
    </div>
  );
};

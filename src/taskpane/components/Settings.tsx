import * as React from 'react';
import { useState } from 'react';

interface SettingsProps {
  currentApiKey: string;
  onSave: (apiKey: string) => void;
  onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentApiKey, onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState<string>(currentApiKey);
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter your Smartlead API key');
      return;
    }

    setError('');
    onSave(apiKey.trim());
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Settings</h1>
        <p>Configure your Smartlead integration</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="section">
        <h2 className="section-title">API Configuration</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="api-key">
            Smartlead API Key
          </label>
          <input
            id="api-key"
            type="password"
            className="form-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Smartlead API key"
          />
        </div>

        <div className="info-message">
          <strong>How to find your API key:</strong>
          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Log in to your Smartlead account</li>
            <li>Go to Settings → API</li>
            <li>Copy your API key</li>
          </ol>
        </div>

        <button
          className="button button-primary"
          onClick={handleSave}
          style={{ marginBottom: '12px' }}
        >
          Save API Key
        </button>

        {currentApiKey && (
          <button
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;

import * as React from 'react';
import { useState, useEffect } from 'react';
import SmartleadService from '../../services/smartlead';
import { SmartleadCampaign, EmailContact } from '../../types';
import Settings from './Settings';

/* global Office */

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<SmartleadCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [emailContact, setEmailContact] = useState<EmailContact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      loadCampaigns();
      extractEmailFromMessage();
    } else {
      setLoading(false);
    }
  }, [apiKey]);

  const loadApiKey = () => {
    try {
      const savedApiKey = localStorage.getItem('smartlead_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setShowSettings(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading API key:', err);
      setLoading(false);
    }
  };

  const saveApiKey = (key: string) => {
    try {
      localStorage.setItem('smartlead_api_key', key);
      setApiKey(key);
      setShowSettings(false);
      setError('');
    } catch (err) {
      setError('Failed to save API key');
    }
  };

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const service = new SmartleadService(apiKey);
      const campaignList = await service.getCampaigns();
      setCampaigns(campaignList);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns. Please check your API key.');
      setShowSettings(true);
    } finally {
      setLoading(false);
    }
  };

  const extractEmailFromMessage = () => {
    try {
      // Check if Office APIs are ready
      if (!Office || !Office.context || !Office.context.mailbox) {
        setError('Office APIs not ready. Please reload the add-in.');
        return;
      }

      const item = Office.context.mailbox.item;

      // Check if we have an email item
      if (!item) {
        setError('No email selected. Please select or open an email message.');
        return;
      }

      // Try to get sender information
      // Different Outlook versions may have different API availability
      if (item.from && typeof item.from.getAsync === 'function') {
        // Async API (preferred)
        item.from.getAsync((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded && result.value) {
            const from = result.value;
            const contact: EmailContact = {
              email: from.emailAddress,
              displayName: from.displayName,
            };

            // Parse first and last name from display name
            if (from.displayName) {
              const nameParts = from.displayName.trim().split(' ');
              if (nameParts.length > 1) {
                contact.firstName = nameParts[0];
                contact.lastName = nameParts.slice(1).join(' ');
              } else {
                contact.firstName = from.displayName;
              }
            }

            setEmailContact(contact);
            setError(''); // Clear any previous errors
          } else {
            console.error('getAsync failed:', result.error);
            setError('Unable to read sender information. The email may not be fully loaded.');
          }
        });
      } else if (item.from) {
        // Synchronous property access (fallback for older versions)
        const from = item.from as any;
        if (from.emailAddress && from.displayName) {
          const contact: EmailContact = {
            email: from.emailAddress,
            displayName: from.displayName,
          };

          if (from.displayName) {
            const nameParts = from.displayName.trim().split(' ');
            if (nameParts.length > 1) {
              contact.firstName = nameParts[0];
              contact.lastName = nameParts.slice(1).join(' ');
            } else {
              contact.firstName = from.displayName;
            }
          }

          setEmailContact(contact);
          setError('');
        } else {
          setError('Sender information not available for this message.');
        }
      } else {
        setError('This add-in requires access to sender information. Please ensure you have selected an email message.');
      }
    } catch (err) {
      console.error('Error extracting email:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to extract email from message'}`);
    }
  };

  const handleAddToSmartlead = async () => {
    if (!emailContact || !selectedCampaignId) {
      setError('Please select a campaign');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const service = new SmartleadService(apiKey);

      const lead = {
        email: emailContact.email,
        first_name: emailContact.firstName || '',
        last_name: emailContact.lastName || '',
      };

      await service.addLeadToCampaign(parseInt(selectedCampaignId), lead);

      setSuccess(`Successfully added ${emailContact.email} to campaign!`);

      // Clear selection after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add lead to campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (showSettings) {
    return (
      <Settings
        currentApiKey={apiKey}
        onSave={saveApiKey}
        onCancel={() => apiKey && setShowSettings(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Smartlead Integration</h1>
        <p>Add email contacts to your campaigns</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {emailContact ? (
        <>
          <div className="section">
            <h2 className="section-title">Contact Information</h2>
            <div className="email-info">
              <div className="email-icon">
                {getInitials(emailContact.displayName)}
              </div>
              <div className="email-details">
                {emailContact.displayName && (
                  <div className="email-name">{emailContact.displayName}</div>
                )}
                <div className="email-address">{emailContact.email}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Select Campaign</h2>

            {campaigns.length > 0 ? (
              <div className="form-group">
                <label className="form-label" htmlFor="campaign-select">
                  Choose a Smartlead campaign
                </label>
                <select
                  id="campaign-select"
                  className="form-select"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">Select a campaign...</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="no-campaigns">
                <p>No campaigns found in your Smartlead account.</p>
              </div>
            )}

            <button
              className="button button-primary"
              onClick={handleAddToSmartlead}
              disabled={!selectedCampaignId || submitting}
            >
              {submitting ? 'Adding...' : 'Add to Campaign'}
            </button>
          </div>

          <div className="section">
            <button
              className="button button-secondary"
              onClick={() => setShowSettings(true)}
              disabled={submitting}
            >
              Settings
            </button>
          </div>
        </>
      ) : (
        <div className="info-message">
          Please select an email message to extract contact information.
        </div>
      )}
    </div>
  );
};

export default App;

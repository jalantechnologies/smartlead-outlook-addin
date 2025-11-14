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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [emailContact, setEmailContact] = useState<EmailContact | null>(null);
  const [existingLead, setExistingLead] = useState<any | null>(null);
  const [checkingLead, setCheckingLead] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [justAdded, setJustAdded] = useState<boolean>(false);

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

  useEffect(() => {
    if (apiKey && emailContact?.email) {
      checkLeadExists();
    }
  }, [emailContact, apiKey]);

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

      // Filter unarchived campaigns and sort alphabetically
      const filteredCampaigns = campaignList
        .filter(campaign => campaign.status !== 'ARCHIVED' && campaign.status !== 'archived')
        .sort((a, b) => a.name.localeCompare(b.name));

      setCampaigns(filteredCampaigns);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaigns. Please check your API key.');
      setShowSettings(true);
    } finally {
      setLoading(false);
    }
  };

  const checkLeadExists = async () => {
    if (!emailContact?.email) return;

    try {
      setCheckingLead(true);
      const service = new SmartleadService(apiKey);
      const lead = await service.getLeadByEmail(emailContact.email);
      setExistingLead(lead);
    } catch (err) {
      console.error('Error checking lead:', err);
      setExistingLead(null);
    } finally {
      setCheckingLead(false);
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

      // Get sender information - direct property access for Outlook Web
      if (item.from) {
        const from = item.from as any;

        // Check if we have the necessary information
        if (from.emailAddress || from.displayName) {
          const contact: EmailContact = {
            email: from.emailAddress || '',
            displayName: from.displayName || from.emailAddress || '',
          };

          // Parse first and last name from display name
          if (contact.displayName) {
            const nameParts = contact.displayName.trim().split(' ');
            if (nameParts.length > 1) {
              contact.firstName = nameParts[0];
              contact.lastName = nameParts.slice(1).join(' ');
            } else {
              contact.firstName = contact.displayName;
            }
          }

          // Validate we have at least an email
          if (!contact.email) {
            setError('Email address not found. Please ensure the message has a sender.');
            return;
          }

          setEmailContact(contact);
          setError(''); // Clear any previous errors
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
      setJustAdded(true);

      // Refresh lead data to show updated campaigns
      checkLeadExists();

      // Clear success state after 3 seconds
      setTimeout(() => {
        setSuccess('');
        setJustAdded(false);
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
        <h1>Smartlead</h1>
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

            {checkingLead ? (
              <div className="info-message" style={{ marginTop: '12px' }}>
                Checking if lead exists...
              </div>
            ) : existingLead ? (
              <div className="success-message" style={{ marginTop: '12px', padding: '10px' }}>
                <div style={{ fontSize: '13px' }}>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Lead exists:</strong>{' '}
                    <a
                      href={`https://app.smartlead.ai/app/crm/lists/all-leads-old`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1a73e8', textDecoration: 'none' }}
                    >
                      {existingLead.first_name} {existingLead.last_name}
                    </a>
                  </div>
                  {existingLead.company_name && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                      {existingLead.company_name}
                    </div>
                  )}
                  {existingLead.lead_campaign_data && existingLead.lead_campaign_data.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#107c10' }}>
                        Campaigns ({existingLead.lead_campaign_data.length}):
                      </div>
                      <div style={{ paddingLeft: '8px', borderLeft: '2px solid #4CAF50' }}>
                        {existingLead.lead_campaign_data.map((campaignData: any, index: number) => (
                          <div key={index} style={{ marginBottom: '6px', fontSize: '12px' }}>
                            <div style={{ fontWeight: '500', color: '#333' }}>{campaignData.campaign_name}</div>
                            {campaignData.created_at && (
                              <div style={{ fontSize: '11px', color: '#666' }}>
                                Added: {new Date(campaignData.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : emailContact ? (
              <div className="info-message" style={{ marginTop: '12px' }}>
                Lead does not exist in Smartlead
              </div>
            ) : null}
          </div>

          <div className="section">
            <h2 className="section-title">Select Campaign</h2>

            {campaigns.length > 0 ? (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="campaign-search">
                    Search campaigns
                  </label>
                  <input
                    id="campaign-search"
                    type="text"
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search..."
                    disabled={submitting}
                  />
                </div>

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
                    {campaigns
                      .filter(campaign =>
                        campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                  </select>
                </div>
              </>

            ) : (
              <div className="no-campaigns">
                <p>No campaigns found in your Smartlead account.</p>
              </div>
            )}

            <button
              className={`button ${justAdded ? 'button-success' : 'button-primary'}`}
              onClick={handleAddToSmartlead}
              disabled={!selectedCampaignId || submitting || justAdded}
            >
              {justAdded ? (
                <>
                  <span style={{ marginRight: '6px' }}>✓</span>
                  Added Successfully
                </>
              ) : submitting ? (
                'Adding...'
              ) : (
                'Add to Campaign'
              )}
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

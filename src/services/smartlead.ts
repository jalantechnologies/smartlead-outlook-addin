import axios, { AxiosInstance } from 'axios';
import { SmartleadCampaign, SmartleadLead, SmartleadApiResponse } from '../types';

class SmartleadService {
  private api: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.api = axios.create({
      baseURL: 'https://server.smartlead.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get all campaigns from Smartlead
   */
  async getCampaigns(): Promise<SmartleadCampaign[]> {
    try {
      const response = await this.api.get('/campaigns', {
        params: {
          api_key: this.apiKey,
        },
      });
      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  }

  /**
   * Add a lead to a campaign
   * If the lead already exists, it will be updated
   */
  async addLeadToCampaign(
    campaignId: number,
    lead: SmartleadLead
  ): Promise<boolean> {
    try {
      const response = await this.api.post(
        `/campaigns/${campaignId}/leads`,
        {
          lead_list: [lead],
        },
        {
          params: {
            api_key: this.apiKey,
          },
        }
      );
      return response.data?.success || true;
    } catch (error: any) {
      console.error('Error adding lead to campaign:', error);
      throw new Error(error.response?.data?.message || 'Failed to add lead to campaign');
    }
  }

  /**
   * Check if a lead exists in Smartlead by email and get details with campaign dates
   */
  async getLeadByEmail(email: string): Promise<SmartleadLead | null> {
    try {
      const response = await this.api.get('/leads/', {
        params: {
          api_key: this.apiKey,
          email: email,
        },
      });
      // API returns a single object when lead is found, not an array
      if (response.data && response.data.id) {
        const lead = response.data;

        // Fetch campaign join dates for each campaign
        if (lead.lead_campaign_data && lead.lead_campaign_data.length > 0) {
          console.log('Fetching dates for', lead.lead_campaign_data.length, 'campaigns');

          const campaignPromises = lead.lead_campaign_data.map(async (campaignData: any) => {
            try {
              console.log(`Fetching campaign ${campaignData.campaign_id} leads...`);
              const campResponse = await this.api.get(`/campaigns/${campaignData.campaign_id}/leads`, {
                params: {
                  api_key: this.apiKey,
                  limit: 1000,
                },
                headers: {
                  'Authorization': '', // Remove auth header, use api_key param only
                },
                timeout: 10000, // 10 second timeout
              });

              // Find this lead in the campaign's lead list
              const campaignLeads = campResponse.data?.data || [];
              console.log(`Campaign ${campaignData.campaign_id} has ${campaignLeads.length} leads`);

              const leadInCampaign = campaignLeads.find((cl: any) => {
                const matches = cl.lead?.email?.toLowerCase() === email.toLowerCase();
                if (matches) {
                  console.log(`Found lead in campaign ${campaignData.campaign_id}, created_at:`, cl.created_at);
                }
                return matches;
              });

              if (leadInCampaign && leadInCampaign.created_at) {
                return {
                  ...campaignData,
                  created_at: leadInCampaign.created_at,
                };
              }
              console.warn(`Lead not found in campaign ${campaignData.campaign_id} leads list`);
              return campaignData;
            } catch (err) {
              console.error(`Error fetching campaign ${campaignData.campaign_id} details:`, err);
              return campaignData;
            }
          });

          lead.lead_campaign_data = await Promise.all(campaignPromises);
          console.log('Final lead_campaign_data:', lead.lead_campaign_data);
        }

        return lead;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lead:', error);
      return null;
    }
  }
}

export default SmartleadService;

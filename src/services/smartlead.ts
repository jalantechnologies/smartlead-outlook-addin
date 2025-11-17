import axios, { AxiosInstance } from 'axios';
import { SmartleadCampaign, SmartleadLead, SmartleadApiResponse } from '../types';

const BASE_URL = 'https://server.smartlead.ai/api/v1';

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
          const campaignPromises = lead.lead_campaign_data.map(async (campaignData: any) => {
            try {
              // Paginate through campaign leads to find this lead
              let offset = 0;
              const limit = 100; // API max limit
              let leadInCampaign = null;
              let totalLeads = 0;

              do {
                // Build URL with pagination parameters
                const url = `${BASE_URL}/campaigns/${campaignData.campaign_id}/leads?api_key=${this.apiKey}&offset=${offset}&limit=${limit}`;

                const campResponse = await axios.get(url, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  timeout: 15000,
                });

                // Get total leads count from first response
                if (offset === 0) {
                  totalLeads = campResponse.data?.total_leads || 0;
                }

                // Find this lead in the current page
                const campaignLeads = campResponse.data?.data || [];
                leadInCampaign = campaignLeads.find((cl: any) =>
                  cl.lead?.email?.toLowerCase() === email.toLowerCase()
                );

                // If found, break out of loop
                if (leadInCampaign) {
                  break;
                }

                // Move to next page
                offset += limit;

                // Continue if there are more leads to check
              } while (offset < totalLeads);

              if (leadInCampaign && leadInCampaign.created_at) {
                return {
                  ...campaignData,
                  created_at: leadInCampaign.created_at,
                };
              }
              return campaignData;
            } catch (err: any) {
              console.error(`Error fetching campaign ${campaignData.campaign_id} details:`, err);
              return campaignData;
            }
          });

          lead.lead_campaign_data = await Promise.all(campaignPromises);

          // Sort campaigns by date added (oldest first)
          lead.lead_campaign_data.sort((a: any, b: any) => {
            if (!a.created_at) return 1;
            if (!b.created_at) return -1;
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          });
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

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
   * Check if a lead exists in Smartlead by email and get details
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
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lead:', error);
      return null;
    }
  }
}

export default SmartleadService;

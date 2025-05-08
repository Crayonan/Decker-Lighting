import axios from 'axios';
import type {
  Photo as PayloadGeneratedPhoto,
  Tag as PayloadGeneratedTag,
  TeamMember as PayloadGeneratedTeamMember,
  ShopPackage as PayloadGeneratedShopPackage,
  SiteText as PayloadGeneratedSiteTexts,
} from '@/types/payload-types';

export interface PaginatedDocs<T = any> { 
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface FormField {
  name: string;
  label?: string | null;
  width?: number | null;
  defaultValue?: string | null;
  required?: boolean | null;
  blockType: 'text' | 'textarea' | 'email' | 'select' | 'checkbox' | 'message' | 'number' | 'country' | 'state' | 'payment'; 
  options?: { label: string; value: string }[];
  message?: any | null; 
}

export interface PayloadForm {
  id: string; 
  title: string;
  slug: string; 
  fields: FormField[];
  submitButtonLabel?: string | null;
  confirmationType?: 'message' | 'redirect' | null;
  confirmationMessage?: any | null; 
  redirect?: {
    type?: 'reference' | 'custom' | null;
    url?: string | null;
    reference?: {
      relationTo?: string | null;
      value?: string | number | null; 
    } | null;
  } | null;
  emails?:
    | {
        emailTo?: string | null
        emailFrom?: string | null
        subject: string
        message?: any | null 
        id?: string | null
      }[]
    | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.BACKEND_API_URL;

if (!API_URL) {
  throw new Error('Payload API URL is missing in environment variables. (BACKEND_API_URL)');
}

const payloadClient = axios.create({
  baseURL: API_URL,
});

// --- Tags ---
export const fetchPhotoTags = async (): Promise<PayloadGeneratedTag[]> => {
  try {
    const response = await payloadClient.get<PaginatedDocs<PayloadGeneratedTag>>('/tags', {
      params: {
        limit: 100,
        sort: 'name',
        depth: 0, 
      },
    });
    return response.data.docs;
  } catch (error) {
    console.error("Error fetching tags from Payload:", error);
    return [];
  }
};

// --- Photos ---
export const fetchPhotos = async (tagId?: number): Promise<PaginatedDocs<PayloadGeneratedPhoto>> => {
  try {
    const params: Record<string, any> = {
      depth: 1, 
      limit: 100,
      sort: '-updatedAt',
    };

    if (tagId !== undefined) {
      params.where = {
        'tags': {
          in: [tagId],
        },
      };
    }

    const response = await payloadClient.get<PaginatedDocs<PayloadGeneratedPhoto>>('/photos', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching photos from Payload:", error);
    return { docs: [], totalDocs: 0, limit: 100, totalPages:0, page:1, pagingCounter:0, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
  }
};
// --- Team Members ---
export const fetchTeamMembers = async (): Promise<PaginatedDocs<PayloadGeneratedTeamMember>> => {
  try {
    const response = await payloadClient.get<PaginatedDocs<PayloadGeneratedTeamMember>>('/team-members', {
      params: { depth: 1, limit: 50, sort: '_order' },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team members from Payload:", error);
    return { docs: [], totalDocs: 0, limit: 50, totalPages:0, page:1, pagingCounter:0, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
  }
};

// --- Shop Packages ---
export const fetchShopPackages = async (): Promise<PaginatedDocs<PayloadGeneratedShopPackage>> => {
  try {
    const response = await payloadClient.get<PaginatedDocs<PayloadGeneratedShopPackage>>('/shop-packages', {
      params: { depth: 1, limit: 50, sort: '_order' },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shop packages from Payload:", error);
    return { docs: [], totalDocs: 0, limit: 50, totalPages:0, page:1, pagingCounter:0, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
  }
};

// --- Site Texts (Global) ---
export const fetchSiteTexts = async (): Promise<PayloadGeneratedSiteTexts | null> => {
  try {
    const response = await payloadClient.get<PayloadGeneratedSiteTexts>('/globals/site-texts', {
        params: { depth: 1 }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching site texts from Payload:", error);
    return null;
  }
};

// --- Fetch Form by Title ---
export const fetchFormBySlug = async (title: string): Promise<PayloadForm | null> => {
  try {
    const response = await payloadClient.get<PaginatedDocs<PayloadForm>>('/forms', { 
      params: {
        where: {
          title: { equals: title },
        },
        limit: 1,
        depth: 1, 
      },
    });
    if (response.data.docs && response.data.docs.length > 0) {
      return response.data.docs[0];
    }
    console.warn(`Form with slug "${title}" not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching form with slug ${title} from Payload:`, error);
    throw error; 
  }
};

// --- Submit Form Data ---
export const submitForm = async (formId: string, formData: Record<string, any>): Promise<any> => {
  try {
      const payloadData = {
          form: formId,
          submissionData: Object.entries(formData).map(([key, value]) => ({
              field: key,
              value: value,
          })),
      };
      const response = await payloadClient.post('/form-submissions', payloadData);
      return response.data; 
  } catch (error) {
      console.error("Error submitting form to Payload:", error);
      const errorMessage = (error as any).response?.data?.errors?.[0]?.message || (error as Error).message || 'Submission failed';
      throw new Error(errorMessage);
  }
};


export default payloadClient;
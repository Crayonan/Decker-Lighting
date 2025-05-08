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

export default payloadClient;
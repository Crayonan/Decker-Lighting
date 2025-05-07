import axios from 'axios';
import type {
  Photo as PayloadGeneratedPhoto,
  Tag as PayloadGeneratedTag,
  Media as PayloadGeneratedMedia,
  TeamMember as PayloadGeneratedTeamMember,
  ShopPackage as PayloadGeneratedShopPackage,
  SiteText as PayloadGeneratedSiteTexts,
} from '@/types/payload-types';

export interface PaginatedDocs<T = any> { // Use a generic T for the document type
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

const API_URL = import.meta.env.VITE_PAYLOAD_API_URL;

if (!API_URL) {
  throw new Error('Payload API URL is missing in environment variables. (VITE_PAYLOAD_API_URL)');
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
        depth: 0, // No need to populate relationships for tags themselves
      },
    });
    return response.data.docs;
  } catch (error) {
    console.error("Error fetching tags from Payload:", error);
    return [];
  }
};

// --- Photos ---
// fetchPhotos now accepts an optional numeric tagId
export const fetchPhotos = async (tagId?: number): Promise<PaginatedDocs<PayloadGeneratedPhoto>> => {
  try {
    const params: Record<string, any> = {
      depth: 1, // Depth 1 to populate 'image'. Tags are IDs unless explicitly populated deeper.
                 // If you need tag names directly on Photo.tags, Photos collection needs 'tags' field with depth >=1
                 // or fetchPhotos needs depth: 2 and Photo.tags type needs to be (number | Tag)[]
      limit: 100,
      sort: '-updatedAt',
    };

    // If a tagId is provided, add the where clause
    if (tagId !== undefined) {
      params.where = {
        // This queries photos where the 'tags' relationship field (which stores an array of tag IDs or objects)
        // contains the given tagId.
        // For a 'hasMany' relationship, Payload/Postgres often uses an 'equals' on the ID
        // or a 'contains' if querying a text representation of an array of IDs.
        // Let's assume direct ID matching for hasMany relationships.
        // If Payload's pg adapter stores hasMany as an array of IDs, `in` is better.
        // For now, `equals` would typically work if `tags` was a single relationship.
        // For `hasMany`, the query is often on a join table or array containment.
        // Payload's default query for relationship 'hasMany' on Postgres for filtering is typically:
        // 'tags.id': { equals: tagId } or 'tags': { equals: tagId } if tags stores just IDs
        // Given 'tags' in Photos.ts is `relationTo: 'tags', hasMany: true`,
        // to check if an array of related IDs *contains* a specific ID:
        'tags': {
          // For hasMany relationships, 'contains' often works on the array of IDs.
          // Or, if querying the related collection through the join: 'tags.id': { equals: tagId }
          // Let's try with 'in' as Payload documentation sometimes suggests for array of relations.
          // If Payload stores an array of IDs in the photos table for the tags relation:
          in: [tagId], // This checks if the tagId is one of the IDs in the photo's tags array
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
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

/**
 * API URL Configuration
 * Uses environment variables with sensible defaults
 */
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "https://admin.houseofsenses.vn"
    : process.env.NEXT_PUBLIC_API_URL || "http://admin.houseofsenses.vn";

export const GRAPHQL_ENDPOINT = `${API_URL}/api/graphql`;

/**
 * Apollo Client Setup
 */

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || GRAPHQL_ENDPOINT,
  fetch: function (uri, options) {
    return fetch(uri, {
      ...options,
      next: {
        revalidate: 60,
      },
    });
  },
});

// Error link to catch GraphQL errors
const errorLink = onError(() => {});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache({}),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});

/**
 * Type Definitions
 */

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  heroImagesList?: Array<{
    image?: {
      url: string;
      filename: string;
    };
    id?: string;
  }>;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  shortAboutTitle?: string;
  shortAboutText?: string;
  galleryText?: string;
  ctaTitle?: string;
  ctaText?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  shortAboutCollages?: Array<{
    image?: {
      url: string;
      filename: string;
    };
    id?: string;
  }>;
  aboutusHero?: {
    url: string;
    filename: string;
  };
  aboutus?: any;
  menu?: {
    url: string;
    filename: string;
  };
  newMenu?: Array<{
    src?: {
      url: string;
      filename: string;
    };
    id?: string;
  }>;
  logo?: {
    url: string;
  };
  address?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  topbarNotification?: {
    enabled?: boolean;
    message?: string;
  };
  meta?: {
    title?: string;
    description?: string;
    image?: {
      url: string;
      filename?: string;
    };
  };
}

export interface HomeInformation {
  name?: string;
  CatchPhrase1: string;
  CatchPhrase2: string;
  quote_s_: Array<{ quote: string; id: string }>;
  BackgroundImage_forMobile_?: {
    url: string;
  } | null;
}

export interface GalleryItem {
  id: string;
  image?: {
    url: string;
    filename: string;
    alt?: string;
  };
  caption?: string;
  branch?: {
    id: string;
    name: string;
  };
}

interface TenantsResponse {
  Tenants: {
    docs: Tenant[];
    totalDocs: number;
    limit: number;
  };
}

interface TenantResponse {
  Tenants: {
    docs: Tenant[];
  };
}

interface HomeInformationResponse {
  HomeInformation: HomeInformation;
}

interface GalleryResponse {
  Galleries: {
    docs: GalleryItem[];
    totalDocs: number;
  };
}

interface CustomerResponse {
  Customers: {
    docs: Array<{
      id: string;
      customerName: string;
      customerPhone: string;
    }>;
  };
}

/**
 * QUERIES
 */

const GET_TENANTS = gql`
  query getTenants($limit: Int = 100) {
    Tenants(limit: $limit) {
      docs {
        id
        name
        domain
        heroImagesList {
          image {
            url
            filename
          }
          id
        }
        heroTitle
        heroSubtitle
        heroDescription
        shortAboutTitle
        shortAboutText
        galleryText
        ctaTitle
        ctaText
        aboutTitle
        aboutSubtitle
        shortAboutCollages {
          image {
            url
            filename
          }
          id
        }
        aboutus
        menu {
          url
          filename
        }
        newMenu {
          src {
            url
            filename
          }
          id
        }
        logo {
          url
        }
        address
        location {
          latitude
          longitude
        }
        phone
        email
        facebook
        instagram
        tiktok
        youtube
        topbarNotification {
          enabled
          message
        }
        meta {
          title
          description
          image {
            url
            filename
          }
        }
      }
    }
  }
`;

const GET_TENANT = gql`
  query getTenant($domain: String) {
    Tenants(where: { domain: { equals: $domain } }) {
      docs {
        id
        name
        domain
        heroImagesList {
          image {
            url
            filename
          }
          id
        }
        heroTitle
        heroSubtitle
        heroDescription
        shortAboutTitle
        shortAboutText
        galleryText
        ctaTitle
        ctaText
        aboutTitle
        aboutSubtitle
        shortAboutCollages {
          image {
            url
            filename
          }
          id
        }
        aboutus
        menu {
          url
          filename
        }
        newMenu {
          src {
            url
            filename
          }
          id
        }
        logo {
          url
        }
        address
        location {
          latitude
          longitude
        }
        phone
        email
        facebook
        instagram
        tiktok
        youtube
        topbarNotification {
          enabled
          message
        }
        meta {
          title
          description
          image {
            url
            filename
          }
        }
      }
    }
  }
`;

const GET_HOME_INFORMATION = gql`
  query getHomeInformation {
    HomeInformation {
      name
      CatchPhrase1
      CatchPhrase2
      quote_s_ {
        quote
        id
      }
      BackgroundImage_forMobile_ {
        url
      }
    }
  }
`;

const GET_GALLERY = gql`
  query getGallery {
    Galleries(limit: 100) {
      docs {
        id
        image {
          url
          filename
          alt
        }
        caption
        branch {
          id
          name
        }
      }
      totalDocs
    }
  }
`;

const GET_CUSTOMER = gql`
  query getCustomer($customerPhone: String) {
    Customers(where: { customerPhone: { equals: $customerPhone } }) {
      docs {
        id
        customerName
        customerPhone
      }
    }
  }
`;

/**
 * MUTATIONS
 */

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($customerName: String!, $customerPhone: String!) {
    createCustomer(
      data: { customerName: $customerName, customerPhone: $customerPhone }
    ) {
      id
      customerName
      customerPhone
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation(
    $customer: String!
    $reservationDateTime: String!
    $numberOfGuests: Float!
    $specialRequests: String
    $branch: String!
    $status: Reservation_status_MutationInput!
  ) {
    createReservation(
      data: {
        customer: $customer
        reservationDateTime: $reservationDateTime
        numberOfGuests: $numberOfGuests
        specialRequests: $specialRequests
        branch: $branch
        status: $status
      }
    ) {
      id
      reservationDateTime
      numberOfGuests
    }
  }
`;

const CREATE_CONTACT_MESSAGE = gql`
  mutation CreateContactMessage(
    $customer: String!
    $message: String
    $branch: String!
    $status: ContactMessage_status_MutationInput!
  ) {
    createContactMessage(
      data: {
        customer: $customer
        message: $message
        branch: $branch
        status: $status
      }
    ) {
      id
      customer {
        id
        customerName
        customerPhone
      }
      message
      branch {
        id
        name
      }
      status
    }
  }
`;

/**
 * Query Functions
 */

/**
 * Fetch all tenants from the API
 * @param limit - Maximum number of tenants to fetch
 * @returns Promise with tenants data
 */
export const fetchTenants = async (limit = 100) => {
  try {
    const { data } = await client.query<TenantsResponse>({
      query: GET_TENANTS,
      variables: { limit },
    });
    return data?.Tenants?.docs || [];
  } catch {
    return [];
  }
};

/**
 * Fetch a single tenant by slug
 * @param slug - The tenant slug
 * @returns Promise with tenant data
 */
export const fetchTenantBySlug = async (slug: string) => {
  try {
    const { data } = await client.query<TenantResponse>({
      query: GET_TENANT,
      variables: { domain: slug },
    });

    return data?.Tenants?.docs?.[0] || null;
  } catch {
    return null;
  }
};

/**
 * Fetch home information global settings
 * @returns Promise with home information data
 */
export const fetchHomeInformation = async () => {
  try {
    const { data } = await client.query<HomeInformationResponse>({
      query: GET_HOME_INFORMATION,
    });
    return data?.HomeInformation;
  } catch {
    return null;
  }
};

/**
 * Fetch gallery images
 * @param branchId - Optional branch ID to filter by specific branch
 * @returns Promise with gallery items
 */
export const fetchGallery = async (branchId?: string) => {
  try {
    const { data } = await client.query<GalleryResponse>({
      query: GET_GALLERY,
    });
    // Filter by branch on the client side if branchId is provided
    let docs = data?.Galleries?.docs || [];
    if (branchId && docs.length > 0) {
      docs = docs.filter((item) => item.branch?.id === branchId);
    }

    return docs;
  } catch {
    return [];
  }
};

/* END OF QUERIES */

/**
 * Mutation Functions
 */

/**
 * Get customer by phone number
 * @param phone - Customer phone number
 * @returns Promise with customer data or null
 */
export const getCustomerByPhone = async (phone: string) => {
  try {
    const { data } = await client.query<CustomerResponse>({
      query: GET_CUSTOMER,
      variables: { customerPhone: phone },
    });
    return data?.Customers?.docs?.[0] || null;
  } catch {
    return null;
  }
};

/**
 * Create a new customer
 * @param name - Customer name
 * @param phone - Customer phone
 * @returns Promise with created customer data
 */
export const createCustomer = async (name: string, phone: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_CUSTOMER,
      variables: {
        customerName: name,
        customerPhone: phone,
      },
    });
    return (data as any)?.createCustomer;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new reservation
 * @param customerId - Customer ID (from Customers collection)
 * @param reservationDateTime - ISO date-time string
 * @param numberOfGuests - Number of guests
 * @param specialRequests - Special requests/notes
 * @param branchId - Branch/Tenant ID
 * @returns Promise with created reservation data
 */
export const createReservation = async (
  customerId: string,
  reservationDateTime: string,
  numberOfGuests: number,
  specialRequests: string | undefined,
  branchId: string,
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_RESERVATION,
      variables: {
        customer: customerId,
        reservationDateTime,
        numberOfGuests,
        specialRequests,
        branch: branchId,
        status: "Pending",
      },
    });
    return data as any;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new contact message
 * @param customerId - Customer ID (from Customers collection)
 * @param message - Message content
 * @param branchId - Branch/Tenant ID
 * @returns Promise with created contact message data
 */
export const createContactMessage = async (
  customerId: string,
  message: string | undefined,
  branchId: string,
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_CONTACT_MESSAGE,
      variables: {
        customer: customerId,
        message: message || "",
        branch: branchId,
        status: "Pending",
      },
    });
    return data as any;
  } catch (error) {
    throw error;
  }
};

/* END OF MUTATIONS */

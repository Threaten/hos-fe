import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

/**
 * API URL Configuration
 * Uses environment variables with sensible defaults
 */
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "https://admin.hehehihi.com"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const GRAPHQL_ENDPOINT = `${API_URL}/api/graphql`;

/**
 * Apollo Client Setup
 */

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || GRAPHQL_ENDPOINT,
  fetch: function (uri, options) {
    // Log the API endpoint being used (only in development)
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("🔗 GraphQL Endpoint:", uri);
    }

    return fetch(uri, {
      ...options,
      next: {
        revalidate: 60,
      },
    })
      .then(async (response) => {
        // Debug: Log response details
        console.log("📥 Response Status:", response.status, response.statusText);
        console.log("📥 Response Headers:", Object.fromEntries(response.headers.entries()));
        
        // Clone response to read body for debugging
        const clonedResponse = response.clone();
        
        // Check for error status codes
        if (!response.ok) {
          const errorText = await clonedResponse.text();
          console.error("❌ ERROR DETAILS:");
          console.error({
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
            body: errorText,
          });
          
          // Try to parse as JSON for better error display
          try {
            const errorJson = JSON.parse(errorText);
            console.error("📄 Parsed Error:", JSON.stringify(errorJson, null, 2));
          } catch (e) {
            console.error("📄 Raw Error Body:", errorText);
          }
        }
        
        return response;
      })
      .catch((error) => {
        console.error("❌ NETWORK FETCH ERROR:");
        console.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          endpoint: uri,
          options: {
            method: options?.method,
            headers: options?.headers,
          },
        });
        console.error("Failed endpoint:", uri);
        // Redirect to error page on network failure
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;

        // Prevent redirect loop - don't redirect if already on error page
        if (pathname.includes("somethingwentwrong")) {
          throw error;
        }

        // Redirect to main domain's error page
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;

        // Extract base domain - keep at least 2 parts (domain.tld)
        const parts = hostname.split(".");
        let baseDomain;

        if (hostname.includes("localhost")) {
          // Keep localhost as-is
          baseDomain = hostname;
        } else if (parts.length > 2) {
          // Has subdomain - remove it (e.g., red-bistro.hehehihi.com → hehehihi.com)
          baseDomain = parts.slice(-2).join(".");
        } else {
          // Already base domain (e.g., hehehihi.com)
          baseDomain = hostname;
        }

        window.location.href = `${protocol}//${baseDomain}${port ? `:${port}` : ""}/somethingwentwrong`;
      }
      throw error;
    });
  },
});

// Error link to catch GraphQL errors
const errorLink = onError(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    console.error("❌ GRAPHQL ERRORS:");
    error.errors.forEach(({ message, locations, path, extensions }) => {
      console.error({
        message,
        locations,
        path,
        extensions,
        operation: operation.operationName,
        variables: operation.variables,
      });
    });
  } else {
    console.error("❌ NETWORK ERROR:");
    console.error({
      message: error.message,
      name: error.name,
      stack: (error as any).stack,
      operation: operation.operationName,
      variables: operation.variables,
    });
  }
});

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
  slug: string;
  domain: string;
  menu?: {
    url: string;
    filename: string;
  };
  logo?: {
    url: string;
  };
  address?: string;
  phone?: string;
  email?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: {
    url: string;
    filename: string;
  };
  shortAboutTitle?: string;
  shortAboutText?: string;
  aboutus?: any;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  newMenu?: Array<{
    src?: {
      url: string;
      filename: string;
    };
    id?: string;
  }>;
}

export interface HomeInformation {
  CatchPhrase1: string;
  CatchPhrase2: string;
  quote_s_: Array<{ quote: string; id: string }>;
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
    slug: string;
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
        slug
        domain
        menu {
          url
          filename
        }
        logo {
          url
        }
        address
        phone
        email
        heroTitle
        heroSubtitle
        heroDescription
        heroImage {
          url
          filename
        }
        shortAboutTitle
        shortAboutText
        aboutus
        facebook
        instagram
        tiktok
        youtube
        newMenu {
          src {
            url
            filename
          }
          id
        }
      }
      totalDocs
      limit
    }
  }
`;

const GET_TENANT = gql`
  query getTenant($slug: String) {
    Tenants(where: { slug: { equals: $slug } }) {
      docs {
        id
        name
        slug
        domain
        menu {
          url
          filename
        }
        logo {
          url
        }
        address
        phone
        email
        heroTitle
        heroSubtitle
        heroDescription
        heroImage {
          url
          filename
        }
        shortAboutTitle
        shortAboutText
        aboutus
        facebook
        instagram
        tiktok
        youtube
        newMenu {
          src {
            url
            filename
          }
          id
        }
      }
    }
  }
`;

const GET_HOME_INFORMATION = gql`
  query getHomeInformation {
    HomeInformation {
      CatchPhrase1
      CatchPhrase2
      quote_s_ {
        quote
        id
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
          slug
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
    console.log("🔍 Fetching tenants with limit:", limit);
    const { data } = await client.query<TenantsResponse>({
      query: GET_TENANTS,
      variables: { limit },
    });
    console.log("✅ Tenants received:", data?.Tenants?.docs?.length || 0);
    return data?.Tenants?.docs || [];
  } catch (error) {
    console.error("❌ ERROR fetching tenants:");
    console.error({
      error,
      limit,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
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
    console.log("🔍 Fetching tenant by slug:", slug);
    console.log(
      "📡 GraphQL Endpoint:",
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || GRAPHQL_ENDPOINT,
    );

    const { data } = await client.query<TenantResponse>({
      query: GET_TENANT,
      variables: { slug },
    });

    console.log(
      "✅ Tenant data received:",
      data?.Tenants?.docs?.[0] ? "Found" : "Not found",
    );
    return data?.Tenants?.docs?.[0] || null;
  } catch (error) {
    console.error("❌ Error fetching tenant:", error);
    console.error("   Slug:", slug);
    console.error("   Endpoint:", process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
    return null;
  }
};

/**
 * Fetch home information global settings
 * @returns Promise with home information data
 */
export const fetchHomeInformation = async () => {
  try {
    console.log("🔍 Fetching home information");
    const { data } = await client.query<HomeInformationResponse>({
      query: GET_HOME_INFORMATION,
    });
    console.log("✅ Home information received:", data?.HomeInformation ? "Success" : "No data");
    return data?.HomeInformation;
  } catch (error) {
    console.error("❌ ERROR fetching home information:");
    console.error({
      error,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
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
    console.log("Fetching gallery with branchId:", branchId);
    const { data } = await client.query<GalleryResponse>({
      query: GET_GALLERY,
    });
    console.log("Gallery data received:", data);
    console.log("Gallery docs:", data?.Galleries?.docs);

    // Filter by branch on the client side if branchId is provided
    let docs = data?.Galleries?.docs || [];
    if (branchId && docs.length > 0) {
      docs = docs.filter((item) => item.branch?.id === branchId);
    }

    return docs;
  } catch (error) {
    console.error("Error fetching gallery:", error);
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
    console.log("🔍 Fetching customer by phone:", phone);
    const { data } = await client.query<CustomerResponse>({
      query: GET_CUSTOMER,
      variables: { customerPhone: phone },
    });
    console.log("✅ Customer found:", data?.Customers?.docs?.[0] ? "Yes" : "No");
    return data?.Customers?.docs?.[0] || null;
  } catch (error) {
    console.error("❌ ERROR fetching customer:");
    console.error({
      error,
      phone,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
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
    console.log("🔍 Creating customer:", { name, phone });
    const { data } = await client.mutate({
      mutation: CREATE_CUSTOMER,
      variables: {
        customerName: name,
        customerPhone: phone,
      },
    });
    console.log("✅ Customer created:", (data as any)?.createCustomer);
    return (data as any)?.createCustomer;
  } catch (error) {
    console.error("❌ ERROR creating customer:");
    console.error({
      error,
      name,
      phone,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
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
    console.log("🔍 Creating reservation:", {
      customerId,
      reservationDateTime,
      numberOfGuests,
      specialRequests,
      branchId,
    });
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
    console.log("✅ Reservation created:", data);
    return data as any;
  } catch (error) {
    console.error("❌ ERROR creating reservation:");
    console.error({
      error,
      customerId,
      reservationDateTime,
      numberOfGuests,
      specialRequests,
      branchId,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
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
    console.log("🔍 Creating contact message:", {
      customerId,
      message,
      branchId,
    });
    const { data } = await client.mutate({
      mutation: CREATE_CONTACT_MESSAGE,
      variables: {
        customer: customerId,
        message: message || "",
        branch: branchId,
        status: "Pending",
      },
    });
    console.log("✅ Contact message created:", data);
    return data as any;
  } catch (error) {
    console.error("❌ ERROR creating contact message:");
    console.error({
      error,
      customerId,
      message,
      branchId,
      endpoint: GRAPHQL_ENDPOINT,
      errorDetails: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
    });
    throw error;
  }
};

/* END OF MUTATIONS */

export interface PageAndSortParams {
  pageNumber?: number
  pageSize?: number
  order?: 'asc' | 'desc'
  orderBy?: 'createdAt' | 'updatedAt'
}

// Submit this to the /auth/exchange to get a Self back
export interface ExchangeRequest {
  userId: string
  otp: string
}

// Params received by the /exchange page which then submits the ExchangeRequest
// URL params so all attributes are optional
export interface ExchangeURLParams extends Partial<ExchangeRequest> {
  destination?: string
}

// What we send to /me/google/connect to swap a code for a token and persist it
export interface GoogleOAuthPersistTokenRequest {
  code: string
  redirectUri: string
}

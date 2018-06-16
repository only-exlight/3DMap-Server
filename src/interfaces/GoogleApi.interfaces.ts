export interface GoogleElevationResponse {
    results: GoogleElevation [];
    status: string;
    error_message?: string;
}

export interface GoogleElevation {
    elevation: number;
    resolution: number;
    location: GoogleLocation;
}

export interface GoogleLocation {
    lat: number;
    lng: number;
}
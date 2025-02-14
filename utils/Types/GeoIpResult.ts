import { GeoIpResponse } from "./GeoIpResponse";

export interface GeoIpResult {
    data: GeoIpResponse | null;
    subdivisionCode: string | null;
    postalCode: string | null;
}
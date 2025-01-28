export interface MkData {
  MkId: number;
  IsPresent: boolean;
  IsCoalition: boolean;
  Name: string;
  MkImage: string;
  FactionName: string;
  Phone: string;
  Mail: string; // New field for MK's email
  RolesList: string[]; // New field for list of roles
  isGoverment: boolean;
}

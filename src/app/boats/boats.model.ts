import { Certificate } from '../certificates/certificates.model';

export interface Boat {
  id: string;
  name: string;
  image: string;
  type: string;
  requiredCertificate: Certificate;
}

export interface CreateBoatDto {
  name: string;
  image: string;
  type: string;
  certificateId: string;
}

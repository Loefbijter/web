export interface Certificate {
  id: string;
  name: string;
  showInSkippersList: boolean;
}

export interface CreateCertificateDto {
  name: string;
  showInSkippersList: boolean;
}

export interface PatchCertificateDto {
  name?: string;
  showInSkippersList?: boolean;
}

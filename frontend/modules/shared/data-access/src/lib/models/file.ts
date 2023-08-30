export interface FileResource extends File {
  id: number;
  uploadedBy: string;
  toRemove?: boolean;
}

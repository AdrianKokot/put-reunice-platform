import { FileIconPipe } from './file-icon.pipe';
import { Resource } from '@reunice/modules/shared/data-access';

describe('FileIconPipe', () => {
  let pipe: FileIconPipe;

  beforeEach(() => {
    pipe = new FileIconPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return tuiIconImage for image type', () => {
    const result = pipe.transform({ type: 'image/jpeg' } as Resource);
    expect(result).toBe('tuiIconImage');
  });

  it('should return tuiIconFilm for video type', () => {
    const result = pipe.transform({ type: 'video/mp4' } as Resource);
    expect(result).toBe('tuiIconFilm');
  });

  it('should return tuiIconMusic for audio type', () => {
    const result = pipe.transform({ type: 'audio/mp3' } as Resource);
    expect(result).toBe('tuiIconMusic');
  });

  it('should return tuiIconFileText for text type', () => {
    const result = pipe.transform({ type: 'text/plain' } as Resource);
    expect(result).toBe('tuiIconFileText');
  });

  it('should return tuiIconFolder for zip type', () => {
    const result = pipe.transform({ type: 'application/zip' } as Resource);
    expect(result).toBe('tuiIconFolder');
  });

  it('should return tuiIconFolder for rar type', () => {
    const result = pipe.transform({
      type: 'application/x-rar-compressed',
    } as Resource);
    expect(result).toBe('tuiIconFolder');
  });

  it('should return tuiIconFolder for 7z type', () => {
    const result = pipe.transform({
      type: 'application/x-7z-compressed',
    } as Resource);
    expect(result).toBe('tuiIconFolder');
  });

  it('should return tuiIconFile for unknown type', () => {
    const result = pipe.transform({
      type: 'application/octet-stream',
    } as Resource);
    expect(result).toBe('tuiIconFile');
  });
});

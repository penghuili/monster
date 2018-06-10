import { ByteFormatterPipe } from './byte-formatter.pipe';

describe('ByteFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new ByteFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});

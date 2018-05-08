import { MinuteFormatterPipe } from './minute-formatter.pipe';

describe('MinuteFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new MinuteFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});

import { TodoStatusPipe } from './todo-status.pipe';

describe('TodoStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TodoStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

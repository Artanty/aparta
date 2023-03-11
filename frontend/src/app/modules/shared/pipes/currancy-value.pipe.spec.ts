import { CurrancyValuePipe } from './currancy-value.pipe';

describe('CurrancyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new CurrancyValuePipe();
    expect(pipe).toBeTruthy();
  });
});

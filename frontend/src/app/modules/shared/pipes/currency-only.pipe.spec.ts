import { CurrencyOnlyPipe } from './currency-only.pipe';

describe('CurrencyOnlyPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyOnlyPipe();
    expect(pipe).toBeTruthy();
  });
});

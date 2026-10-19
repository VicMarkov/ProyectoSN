// Suite del formateo de precios chilenos.
import { describe, it, expect } from 'vitest';
import { formatoCLP } from './formato';

describe('formatoCLP', () => {
  it('agrega el símbolo $ y el separador de miles', () => {
    expect(formatoCLP(129990)).toBe('$129.990');
  });

  it('formatea un precio con miles cortos', () => {
    expect(formatoCLP(1800)).toBe('$1.800');
  });

  it('formatea el cero', () => {
    expect(formatoCLP(0)).toBe('$0');
  });
});

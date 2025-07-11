type AttributeOption = string | RegExp | ((name: string) => boolean);

class AttributeMatcher {
  private predicate: (name: string) => boolean;

  constructor(options: AttributeOption | AttributeOption[]) {
    this.predicate = this.compilePredicate(options);
  }

  private compilePredicate(options: AttributeOption | AttributeOption[]): (name: string) => boolean {
    if (!Array.isArray(options)) {
      return this.createSinglePredicate(options);
    }

    if (options.length === 0) {
      return () => false;
    }

    if (options.length === 1) {
      return this.createSinglePredicate(options[0]);
    }

    const predicates = options.map(option => this.createSinglePredicate(option));
    return (name: string) => predicates.some(predicate => predicate(name));
  }

  private createSinglePredicate(option: AttributeOption): (name: string) => boolean {
    if (typeof option === 'function') {
      return option;
    }

    if (typeof option === 'string') {
      return (name: string) => name === option;
    }

    if (option instanceof RegExp) {
      const compiledRegex = new RegExp(option.source, option.flags);
      return (name: string) => compiledRegex.test(name);
    }

    throw new Error('Invalid attribute option type');
  }

  matchAttribute(name: string): boolean {
    return this.predicate(name);
  }
}

export function createAttributeMatcher(options: AttributeOption | AttributeOption[]): AttributeMatcher {
  return new AttributeMatcher(options);
}

export { AttributeMatcher };
export type { AttributeOption };

import { createAttributeMatcher } from './src/matcher';

const matcher1 = createAttributeMatcher('data-test');
console.log('Exact string match:');
console.log(`  data-test: ${matcher1.matchAttribute('data-test')}`);
console.log(`  data-other: ${matcher1.matchAttribute('data-other')}`);

const matcher2 = createAttributeMatcher(/^data-/);
console.log('\nRegex match:');
console.log(`  data-test: ${matcher2.matchAttribute('data-test')}`);
console.log(`  data-id: ${matcher2.matchAttribute('data-id')}`);
console.log(`  id: ${matcher2.matchAttribute('id')}`);

const matcher3 = createAttributeMatcher(['id', 'class', /^data-/]);
console.log('\nMixed array match:');
console.log(`  id: ${matcher3.matchAttribute('id')}`);
console.log(`  class: ${matcher3.matchAttribute('class')}`);
console.log(`  data-test: ${matcher3.matchAttribute('data-test')}`);
console.log(`  style: ${matcher3.matchAttribute('style')}`);

const matcher4 = createAttributeMatcher(name => name.startsWith('custom-'));
console.log('\nFunction match:');
console.log(`  custom-prop: ${matcher4.matchAttribute('custom-prop')}`);
console.log(`  other-prop: ${matcher4.matchAttribute('other-prop')}`);

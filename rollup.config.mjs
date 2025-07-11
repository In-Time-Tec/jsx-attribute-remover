import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  external: [
    'vite',
    '@babel/core',
    '@babel/parser',
    '@babel/traverse',
    '@babel/generator'
  ]
};

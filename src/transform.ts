import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import type { JSXAttribute } from '@babel/types';
import type { NodePath } from '@babel/traverse';
import type { AttributeMatcher } from './matcher';

interface TransformResult {
  code: string;
  map?: any;
}

interface TransformOptions {
  filename?: string;
  sourceMap?: boolean;
}

export function transformCode(
  code: string,
  matcher: AttributeMatcher,
  options: TransformOptions = {}
): TransformResult {
  if (!code || typeof code !== 'string') {
    return { code };
  }

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      ranges: true,
      tokens: true
    });
  } catch (error) {
    return { code };
  }

  let hasModifications = false;

  traverse(ast, {
    JSXAttribute(path: NodePath<JSXAttribute>) {
      const node = path.node;
      
      if (!node.name || node.name.type !== 'JSXIdentifier') {
        return;
      }

      const attributeName = node.name.name;
      
      if (matcher.matchAttribute(attributeName)) {
        path.remove();
        hasModifications = true;
      }
    }
  });

  if (!hasModifications) {
    return { code };
  }

  const result = generate(ast, {
    filename: options.filename,
    sourceMaps: options.sourceMap,
    sourceFileName: options.filename
  });

  return {
    code: result.code,
    map: result.map
  };
}

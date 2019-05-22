import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  source,
} from '@angular-devkit/schematics';

interface ClassTestOptions {
  filePath: string;
}
export function classTest(_options: ClassTestOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log('options!', _options);
    const fileBuffer = tree.read(_options.filePath);
    if (!fileBuffer) {
      throw new SchematicsException('Not a valid file');
    }
    // console.log('fileBuffer!', fileBuffer);

    const fileText = fileBuffer.toString('utf-8');
    // console.log('file', fileText);
    const sourceFile = ts.createSourceFile(
      _options.filePath,
      fileText,
      ts.ScriptTarget.Latest,
      true
    );
    // console.log('file', sourceFile);

    delintNode(sourceFile);
  };
}

function delintNode(node: ts.Node) {
  switch (node.kind) {
    case ts.SyntaxKind.IfStatement:
      const ifStatement = node as ts.IfStatement;
      console.log('FOUND YOU!!', ifStatement);
      break;
      // if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
      //   report(
      //     ifStatement.thenStatement,
      //     'An if statement\'s contents should be wrapped in a block body.'
      //   );
      // }
      // if (
      //   ifStatement.elseStatement &&
      //   ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
      //   ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
      // ) {
      //   report(
      //     ifStatement.elseStatement,
      //     'An else statement\'s contents should be wrapped in a block body.'
      //   );
      // }
      break;
  }

  ts.forEachChild(node, delintNode);
}

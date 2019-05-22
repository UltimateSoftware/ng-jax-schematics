import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  url,
  apply,
  template,
  move,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

interface ClassTestOptions {
  filePath: string;
  fileName: string;
  name: string;
  remainder: string | string[];
  classType: string;
  fileExt: string;
}

// filepath: src/app/hero-detail/hero-detail.component.ts
export function classTest(_options: ClassTestOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const fileBuffer = tree.read(_options.filePath);
    if (!fileBuffer) {
      throw new SchematicsException('Not a valid file');
    }

    const fileText = fileBuffer.toString('utf-8');
    const sourceFile = ts.createSourceFile(
      _options.filePath,
      fileText,
      ts.ScriptTarget.Latest,
      true
    );

    getMethodNames.findMethodNames.bind(getMethodNames)(sourceFile);
    const methodNames = getMethodNames.methodNames.filter((n) => n !== '');
    console.log('getMethodNames.methodNames', methodNames);

    getConditionals.findConditionals.bind(getConditionals)(sourceFile);
    console.log('getConditionals.ifStatementCount', getConditionals.ifStatementCount);
    console.log('getConditionals.ternaryStatementCount', getConditionals.ternaryStatementCount);
    console.log('getConditionals.totalCount', getConditionals.totalCount);

    return createClassTest(tree, _context);
  };

  function createClassTest(tree: Tree, _context: SchematicContext) {
    // TODO: include case without /
    _options.fileName = _options.filePath.substring(_options.filePath.lastIndexOf('/') + 1);

    const fileName = _options.fileName.split('.');
    _options.name = fileName[0];
    _options.classType = fileName[1];
    _options.fileExt = fileName.slice(-1)[0];
    _options.remainder = fileName.slice(2, -2); // Note: this will only work for Angular files
    _options.filePath = _options.filePath.substring(0, _options.filePath.lastIndexOf('/') + 1);

    const source = url('./files');
    return apply(source, [
      template({
        ...strings,
        ..._options,
      }),
      move(_options.filePath),
    ])(_context);
  }
}

const getMethodNames = {
  methodNames: [''],
  findMethodNames: function(node: ts.Node): any {
    switch (node.kind) {
      case ts.SyntaxKind.MethodDeclaration:
        const methodDeclaration = node as ts.MethodDeclaration;
        const nameIdentifier = methodDeclaration.name as ts.Identifier;
        this.methodNames = [...this.methodNames, nameIdentifier.escapedText as string];
        break;
    }
    ts.forEachChild(node, this.findMethodNames.bind(this));
  },
};

const getConditionals = {
  ifStatementCount: 0,
  ternaryStatementCount: 0,
  totalCount: 0,
  findConditionals: function(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.IfStatement:
        this.ifStatementCount += 1;
        break;
      case ts.SyntaxKind.ConditionalExpression:
        this.ternaryStatementCount += 1;
        break;
    }

    this.totalCount = this.ifStatementCount + this.ternaryStatementCount;

    ts.forEachChild(node, this.findConditionals.bind(this));
  },
};

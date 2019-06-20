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
  methods: Method[];
}

interface Branch {
  expression: string;
  branches?: Branch[];
}

interface Method {
  methodName: string;
  branches?: Branch[];
}

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
    const classDeclaration = sourceFile.statements
      .filter((nodes: any) => nodes.kind === ts.SyntaxKind.ClassDeclaration)
      .pop() as ts.Node;

    const mehtods = getMethods(classDeclaration);

    _options.methods = mehtods;

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
        createTests,
        createTestsRec,
      }),
      move(_options.filePath),
    ])(_context);
  }
}

function getMethods(node: any) {
  let methods: Method[] = [];
  const childern = node.members;

  childern.forEach((child: ts.Node) => {
    switch (child.kind) {
      case ts.SyntaxKind.MethodDeclaration:
        const methodDeclaration = child as ts.MethodDeclaration;
        const nameIdentifier = methodDeclaration.name as ts.Identifier;
        const branches: Branch[] = getBranches(methodDeclaration.body);
        const method: Method = {
          methodName: nameIdentifier.escapedText as string,
          branches: branches,
        };
        methods = [...methods, method];
        break;
    }
  });
  return methods;
}

function getBranches(node: any) {
  let branches: Branch[] = [];
  if (!node) {
    return branches;
  }
  const childern = node.statements;

  childern.forEach((child: ts.Node) => {
    switch (child.kind) {
      case ts.SyntaxKind.IfStatement:
        const ifStatement = child as ts.IfStatement;
        const expressionIfStatement = ifStatement.expression.getText();
        const branchIfStatement: Branch = {
          expression: expressionIfStatement,
          branches: [
            ...getBranches(ifStatement.thenStatement),
            ...getBranches(ifStatement.elseStatement),
          ],
        };
        branches = [...branches, branchIfStatement];
        break;
      case ts.SyntaxKind.ConditionalExpression:
        const conditionalExpression = child as ts.ConditionalExpression;
        const expressionConditionalExpression = conditionalExpression.condition.getText();
        const branchConditional: Branch = {
          expression: expressionConditionalExpression,
          branches: [
            ...getBranches(conditionalExpression.whenTrue),
            ...getBranches(conditionalExpression.whenFalse),
          ],
        };
        branches = [...branches, branchConditional];
        break;
    }
  });

  return branches;
}

function createTests(method: Method): string {
  return `it('${method.methodName} should <do something>', () => {
    // Arrange

    // Act

    // Assert

  });`;
}

function createTestsRec(branch: Branch, methodName: string): string {
  branch.branches = branch.branches || [];

  if (!branch.branches.length) {
    return `it('${methodName} (${branch.expression}) true >', () => {
      // Arrange

      // Act

      // Assert

    });

    it('${methodName} (${branch.expression}) false >', () => {
      // Arrange

      // Act

      // Assert

    });`;
  }
  let nestedTests = '';
  for (let nestBracnh of branch.branches) {
    nestedTests =
      nestedTests +
      createTestsRec(nestBracnh, methodName + ` (${branch.expression}) true`) +
      '\n' +
      createTestsRec(nestBracnh, methodName + ` (${branch.expression}) flase`);
  }
  return nestedTests;
}

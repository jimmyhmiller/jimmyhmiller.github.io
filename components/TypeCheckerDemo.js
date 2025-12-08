import { useState, useEffect } from 'react';
import { useTheme } from '../utils';

let ts = null;

export default function TypeCheckerDemo() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');
  const [tsLoaded, setTsLoaded] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    // Load TypeScript from CDN
    if (typeof window !== 'undefined' && !window.ts) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.9.2/typescript.min.js';
      script.onload = () => {
        ts = window.ts;
        setTsLoaded(true);
        setCode(examples.arithmetic);
      };
      document.body.appendChild(script);
    } else if (window.ts) {
      ts = window.ts;
      setTsLoaded(true);
      setCode(examples.arithmetic);
    }
  }, []);

  const examples = {
    arithmetic: `1 + 2 * 3`,
    comparison: `5 > 3`,
    ifExpr: `function max(a: number, b: number): number {
  if (a > b) {
    return a
  } else {
    return b
  }
}
max(10, 20)`,
    multiParam: `function add(x: number, y: number): number {
  return x + y
}
add(10, 20)`,
    stringConcat: `"Hello, " + "World"`,

    // Error examples
    wrongArgType: `const id = (x: number): number => x
id("oops")`,
    branchMismatch: `function confused(x: number): number {
  if (x > 5) {
    return 42
  } else {
    return "not a number"
  }
}
confused(10)`,
    wrongArgCount: `function add(x: number, y: number): number {
  return x + y
}
add(10)`,
    stringArithmetic: `"hello" - "world"`,
    comparisonMismatch: `5 > "three"`,
    nestedError: `function double(x: number): number {
  return x * 2
}
function apply(f: (n: number) => number, x: number): number {
  return f(x)
}
apply(double, "not a number")`
  };

  // Minimal2 Type Checker Implementation
  function synth(ctx, expr) {
    switch (expr.kind) {
      case 'number':
        return { kind: 'number' };

      case 'string':
        return { kind: 'string' };

      case 'boolean':
        return { kind: 'boolean' };

      case 'var':
        const type = ctx.get(expr.name);
        if (!type) throw new Error(`Unbound variable: ${expr.name}`);
        return type;

      case 'app':
        const fnType = synth(ctx, expr.fn);
        if (fnType.kind !== 'function') {
          throw new Error('Cannot apply non-function');
        }

        if (fnType.params.length !== expr.args.length) {
          throw new Error(`Expected ${fnType.params.length} arguments, got ${expr.args.length}`);
        }

        for (let i = 0; i < expr.args.length; i++) {
          check(ctx, expr.args[i], fnType.params[i]);
        }

        return fnType.to;

      case 'lambda':
        throw new Error('Cannot infer type for lambda without annotation');

      case 'let':
        const expectedType = ctx.get(expr.name);
        let valueType;

        if (expectedType && expr.value.kind === 'lambda') {
          check(ctx, expr.value, expectedType);
          valueType = expectedType;
        } else {
          valueType = synth(ctx, expr.value);
        }

        // Check explicit type annotation if present
        if (expr.type) {
          if (!typesEqual(valueType, expr.type)) {
            throw new Error(`Type mismatch in let binding for '${expr.name}': expected ${typeToString(expr.type)}, got ${typeToString(valueType)}`);
          }
        }

        const newCtx = new Map(ctx);
        newCtx.set(expr.name, valueType);
        return synth(newCtx, expr.body);

      case 'if':
        check(ctx, expr.condition, { kind: 'boolean' });
        const thenType = synth(ctx, expr.then);
        check(ctx, expr.else, thenType);
        return thenType;

      case 'binop':
        switch (expr.op) {
          case '+':
            const leftType = synth(ctx, expr.left);
            const rightType = synth(ctx, expr.right);

            if (leftType.kind === 'number' && rightType.kind === 'number') {
              return { kind: 'number' };
            }
            if (leftType.kind === 'string' && rightType.kind === 'string') {
              return { kind: 'string' };
            }
            if ((leftType.kind === 'string' && rightType.kind === 'number') ||
                (leftType.kind === 'number' && rightType.kind === 'string')) {
              return { kind: 'string' };
            }

            throw new Error(`Cannot add ${leftType.kind} and ${rightType.kind}`);

          case '-':
          case '*':
          case '/':
            check(ctx, expr.left, { kind: 'number' });
            check(ctx, expr.right, { kind: 'number' });
            return { kind: 'number' };

          case '>':
          case '<':
          case '>=':
          case '<=':
            check(ctx, expr.left, { kind: 'number' });
            check(ctx, expr.right, { kind: 'number' });
            return { kind: 'boolean' };

          case '===':
          case '!==':
            const leftEqType = synth(ctx, expr.left);
            check(ctx, expr.right, leftEqType);
            return { kind: 'boolean' };
        }

      case 'sequence':
        if (expr.exprs.length === 0) {
          return { kind: 'void' };
        }

        for (let i = 0; i < expr.exprs.length - 1; i++) {
          synth(ctx, expr.exprs[i]);
        }

        return synth(ctx, expr.exprs[expr.exprs.length - 1]);
    }
  }

  function check(ctx, expr, expected) {
    switch (expr.kind) {
      case 'lambda':
        if (expected.kind !== 'function') {
          throw new Error('Lambda must have function type');
        }

        if (expected.params.length !== expr.params.length) {
          throw new Error(`Expected ${expected.params.length} parameters, got ${expr.params.length}`);
        }

        const newCtx = new Map(ctx);
        for (let i = 0; i < expr.params.length; i++) {
          newCtx.set(expr.params[i], expected.params[i]);
        }

        check(newCtx, expr.body, expected.to);
        break;

      default:
        const actual = synth(ctx, expr);
        if (!typesEqual(actual, expected)) {
          throw new Error(`Type mismatch: expected ${typeToString(expected)}, got ${typeToString(actual)}`);
        }
    }
  }

  function typesEqual(a, b) {
    if (a.kind !== b.kind) return false;
    if (a.kind === 'function' && b.kind === 'function') {
      if (a.params.length !== b.params.length) return false;
      for (let i = 0; i < a.params.length; i++) {
        if (!typesEqual(a.params[i], b.params[i])) return false;
      }
      return typesEqual(a.to, b.to);
    }
    return true;
  }

  function typeToString(type) {
    if (type.kind === 'function') {
      const params = type.params.map(typeToString).join(', ');
      return `(${params}) -> ${typeToString(type.to)}`;
    }
    return type.kind;
  }

  // TypeScript to Minimal2 Expression Mapper
  function parseTypeAnnotation(typeNode) {
    if (!typeNode) {
      return { kind: 'void' };
    }

    if (!ts) return { kind: 'void' };

    switch (typeNode.kind) {
      case ts.SyntaxKind.NumberKeyword:
        return { kind: 'number' };
      case ts.SyntaxKind.StringKeyword:
        return { kind: 'string' };
      case ts.SyntaxKind.BooleanKeyword:
        return { kind: 'boolean' };
      case ts.SyntaxKind.VoidKeyword:
        return { kind: 'void' };
      case ts.SyntaxKind.FunctionType:
        const fnType = typeNode;
        const params = fnType.parameters.map(p => parseTypeAnnotation(p.type));
        return {
          kind: 'function',
          params,
          to: parseTypeAnnotation(fnType.type)
        };
    }
    throw new Error(`Unsupported type annotation: ${ts.SyntaxKind[typeNode.kind]}`);
  }

  function mapBinaryOp(op) {
    if (!ts) return '+';

    switch (op) {
      case ts.SyntaxKind.PlusToken: return '+';
      case ts.SyntaxKind.MinusToken: return '-';
      case ts.SyntaxKind.AsteriskToken: return '*';
      case ts.SyntaxKind.SlashToken: return '/';
      case ts.SyntaxKind.GreaterThanToken: return '>';
      case ts.SyntaxKind.LessThanToken: return '<';
      case ts.SyntaxKind.GreaterThanEqualsToken: return '>=';
      case ts.SyntaxKind.LessThanEqualsToken: return '<=';
      case ts.SyntaxKind.EqualsEqualsEqualsToken: return '===';
      case ts.SyntaxKind.ExclamationEqualsEqualsToken: return '!==';
      default:
        throw new Error(`Unsupported binary operator: ${ts.SyntaxKind[op]}`);
    }
  }

  function mapStatementsToExpr(statements, ctx) {
    if (statements.length === 0) {
      return { kind: 'sequence', exprs: [] };
    }

    const [first, ...rest] = statements;

    if (ts.isVariableStatement(first)) {
      const decl = first.declarationList.declarations[0];
      const varName = decl.name.text;
      const valueExpr = mapTsNodeToExpr(decl.initializer, ctx);
      const typeAnnotation = decl.type ? parseTypeAnnotation(decl.type) : undefined;

      const localCtx = new Map(ctx);
      const valueType = synth(localCtx, valueExpr);
      localCtx.set(varName, valueType);

      const bodyExpr = rest.length > 0
        ? mapStatementsToExpr(rest, localCtx)
        : { kind: 'sequence', exprs: [] };

      return {
        kind: 'let',
        name: varName,
        value: valueExpr,
        body: bodyExpr,
        type: typeAnnotation
      };
    }

    if (ts.isReturnStatement(first)) {
      return first.expression
        ? mapTsNodeToExpr(first.expression, ctx)
        : { kind: 'sequence', exprs: [] };
    }

    if (ts.isIfStatement(first)) {
      return mapTsNodeToExpr(first, ctx);
    }

    const firstExpr = mapTsNodeToExpr(first, ctx);

    if (rest.length === 0) {
      return firstExpr;
    }

    const restExpr = mapStatementsToExpr(rest, ctx);

    if (restExpr.kind === 'sequence' && restExpr.exprs.length === 0) {
      return firstExpr;
    }

    return {
      kind: 'sequence',
      exprs: [firstExpr, restExpr]
    };
  }

  function mapTsNodeToExpr(node, ctx) {
    if (!ts) return { kind: 'number', value: 0 };

    switch (node.kind) {
      case ts.SyntaxKind.NumericLiteral:
        return { kind: 'number', value: parseFloat(node.text) };

      case ts.SyntaxKind.StringLiteral:
        return { kind: 'string', value: node.text };

      case ts.SyntaxKind.TrueKeyword:
        return { kind: 'boolean', value: true };

      case ts.SyntaxKind.FalseKeyword:
        return { kind: 'boolean', value: false };

      case ts.SyntaxKind.Identifier:
        return { kind: 'var', name: node.text };

      case ts.SyntaxKind.CallExpression:
        return {
          kind: 'app',
          fn: mapTsNodeToExpr(node.expression, ctx),
          args: node.arguments.map(arg => mapTsNodeToExpr(arg, ctx))
        };

      case ts.SyntaxKind.BinaryExpression:
        return {
          kind: 'binop',
          op: mapBinaryOp(node.operatorToken.kind),
          left: mapTsNodeToExpr(node.left, ctx),
          right: mapTsNodeToExpr(node.right, ctx)
        };

      case ts.SyntaxKind.IfStatement:
        return {
          kind: 'if',
          condition: mapTsNodeToExpr(node.expression, ctx),
          then: mapTsNodeToExpr(node.thenStatement, ctx),
          else: node.elseStatement
            ? mapTsNodeToExpr(node.elseStatement, ctx)
            : { kind: 'sequence', exprs: [] }
        };

      case ts.SyntaxKind.Block:
        return mapStatementsToExpr(Array.from(node.statements), ctx);

      case ts.SyntaxKind.ReturnStatement:
        if (!node.expression) {
          return { kind: 'sequence', exprs: [] };
        }
        return mapTsNodeToExpr(node.expression, ctx);

      case ts.SyntaxKind.ArrowFunction:
      case ts.SyntaxKind.FunctionExpression:
        const params = node.parameters.map(p => p.name.text);

        let bodyExpr;
        if (ts.isBlock(node.body)) {
          bodyExpr = mapStatementsToExpr(Array.from(node.body.statements), ctx);
        } else {
          bodyExpr = mapTsNodeToExpr(node.body, ctx);
        }

        return {
          kind: 'lambda',
          params,
          body: bodyExpr
        };

      case ts.SyntaxKind.VariableStatement:
        const decl = node.declarationList.declarations[0];
        const varName = decl.name.text;
        const init = decl.initializer;

        if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) && (init.type || init.parameters.some(p => p.type))) {
          const params = init.parameters.map(p => parseTypeAnnotation(p.type));
          const returnType = parseTypeAnnotation(init.type);
          const funcType = {
            kind: 'function',
            params,
            to: returnType
          };
          ctx.set(varName, funcType);
        }

        const valueExpr = mapTsNodeToExpr(decl.initializer, ctx);
        const typeAnnotation = decl.type ? parseTypeAnnotation(decl.type) : undefined;

        return {
          kind: 'let',
          name: varName,
          value: valueExpr,
          body: { kind: 'var', name: varName },
          type: typeAnnotation
        };

      case ts.SyntaxKind.FunctionDeclaration:
        const funcName = node.name.text;
        const funcParams = node.parameters.map(p => p.name.text);

        const funcType = {
          kind: 'function',
          params: node.parameters.map(p => parseTypeAnnotation(p.type)),
          to: parseTypeAnnotation(node.type)
        };
        ctx.set(funcName, funcType);

        const bodyCtx = new Map(ctx);
        for (let i = 0; i < funcParams.length; i++) {
          bodyCtx.set(funcParams[i], funcType.params[i]);
        }

        const lambdaExpr = {
          kind: 'lambda',
          params: funcParams,
          body: mapStatementsToExpr(Array.from(node.body.statements), bodyCtx)
        };

        return {
          kind: 'let',
          name: funcName,
          value: lambdaExpr,
          body: { kind: 'var', name: funcName }
        };

      case ts.SyntaxKind.ExpressionStatement:
        return mapTsNodeToExpr(node.expression, ctx);
    }

    throw new Error(`Unsupported node kind: ${ts.SyntaxKind[node.kind]}`);
  }

  function buildProgramExpr(statements, ctx) {
    if (statements.length === 0) {
      throw new Error('Empty program');
    }

    if (statements.length === 1) {
      return mapTsNodeToExpr(statements[0], ctx);
    }

    const [first, ...rest] = statements;
    const firstExpr = mapTsNodeToExpr(first, ctx);

    if (firstExpr.kind === 'let') {
      return {
        kind: 'let',
        name: firstExpr.name,
        value: firstExpr.value,
        body: buildProgramExpr(rest, ctx)
      };
    } else {
      return buildProgramExpr(rest, ctx);
    }
  }

  function typecheckTypeScript(code) {
    if (!ts) {
      throw new Error('TypeScript not loaded yet');
    }

    const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);
    const ctx = new Map();

    const expr = buildProgramExpr(Array.from(sourceFile.statements), ctx);

    if (!expr) {
      throw new Error('Empty program');
    }

    const type = synth(ctx, expr);
    return { expr, type };
  }

  const handleCheck = () => {
    if (!tsLoaded) {
      setResult({
        success: false,
        error: 'TypeScript is still loading, please wait...'
      });
      setStatus('error');
      return;
    }

    try {
      const { expr, type } = typecheckTypeScript(code);
      setResult({
        success: true,
        type: typeToString(type),
        expr: JSON.stringify(expr, null, 2)
      });
      setStatus('success');
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
      setStatus('error');
    }
  };

  const loadExample = (exampleCode) => {
    setCode(exampleCode);
    setStatus('idle');
    setResult(null);
  };

  const colors = isDark ? {
    background: '#1a202c',
    surface: '#2d3748',
    surfaceLight: '#4a5568',
    border: '#4a5568',
    text: '#e2e8f0',
    textMuted: '#a0aec0',
    textareaBackground: '#2d3748',
    textareaPlaceholder: '#718096',
    buttonBackground: '#3182ce',
    buttonHover: '#2c5282',
    success: '#48bb78',
    error: '#f56565',
    exampleButton: '#374151',
    exampleButtonBorder: '#4b5563',
    exampleButtonHover: '#4b5563',
    resultBackground: '#2d3748',
    resultBorder: '#4a5568',
    highlightBackground: '#374151',
    highlightBorder: '#3182ce'
  } : {
    background: 'white',
    surface: '#edf2f7',
    surfaceLight: '#f7fafc',
    border: '#e2e8f0',
    text: '#2d3748',
    textMuted: '#4a5568',
    textareaBackground: '#fff',
    textareaPlaceholder: '#a0aec0',
    buttonBackground: '#4299e1',
    buttonHover: '#3182ce',
    success: '#38a169',
    error: '#e53e3e',
    exampleButton: '#edf2f7',
    exampleButtonBorder: '#cbd5e0',
    exampleButtonHover: '#e2e8f0',
    resultBackground: '#f7fafc',
    resultBorder: '#e2e8f0',
    highlightBackground: '#fff',
    highlightBorder: '#4299e1'
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      background: colors.background,
      borderRadius: '8px',
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative' }}>
        <textarea
          style={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace',
            fontSize: '14px',
            lineHeight: '1.6',
            padding: '16px',
            border: 'none',
            width: '100%',
            minHeight: '300px',
            resize: 'vertical',
            outline: 'none',
            background: code ? colors.textareaBackground : colors.surfaceLight,
            color: colors.text,
            boxSizing: 'border-box',
            WebkitTextFillColor: colors.text,
            opacity: 1
          }}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus('idle');
          }}
          placeholder="Enter TypeScript code here..."
          spellCheck={false}
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`
      }}>
        <div style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: 500,
          color: status === 'success' ? colors.success : status === 'error' ? colors.error : colors.textMuted
        }}>
          {'\u00A0'}
        </div>
        <button
          style={{
            padding: '8px 16px',
            background: colors.buttonBackground,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.background = colors.buttonHover}
          onMouseOut={(e) => e.target.style.background = colors.buttonBackground}
          onClick={handleCheck}
        >
          Check Types
        </button>
      </div>

      {result && (
        <div style={{
          padding: '16px 20px',
          background: colors.resultBackground,
          borderTop: `1px solid ${colors.resultBorder}`,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace',
          fontSize: '13px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {result.success ? (
            <div style={{ color: colors.success }}>
              <div>✓ Type check successful!</div>
              <div style={{
                marginTop: '8px',
                padding: '8px',
                background: colors.highlightBackground,
                borderLeft: `3px solid ${colors.highlightBorder}`,
                borderRadius: '2px'
              }}>
                <strong>Inferred Type:</strong> {result.type}
              </div>
            </div>
          ) : (
            <div style={{ color: colors.error, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '20px', borderTop: `1px solid ${colors.border}` }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: colors.text }}>Try these examples:</h3>

        <div style={{ marginBottom: '12px' }}>
          <strong style={{ fontSize: '13px', color: colors.textMuted }}>✓ Valid Programs:</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.arithmetic)}>Arithmetic</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.comparison)}>Comparison</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.ifExpr)}>If Expression</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.multiParam)}>Multi-Param Function</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.stringConcat)}>String Concat</ExampleButton>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <strong style={{ fontSize: '13px', color: colors.textMuted }}>✗ Type Errors:</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.wrongArgType)}>Wrong Arg Type</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.branchMismatch)}>Branch Mismatch</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.wrongArgCount)}>Wrong Arg Count</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.stringArithmetic)}>String Arithmetic</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.comparisonMismatch)}>Comparison Mismatch</ExampleButton>
          <ExampleButton colors={colors} onClick={() => loadExample(examples.nestedError)}>Nested Error</ExampleButton>
        </div>
      </div>
    </div>
  );
}

function ExampleButton({ colors, onClick, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        padding: '6px 12px',
        background: isHovered ? colors.exampleButtonHover : colors.exampleButton,
        color: colors.text,
        border: `1px solid ${colors.exampleButtonBorder}`,
        borderRadius: '4px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

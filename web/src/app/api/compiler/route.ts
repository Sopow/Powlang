import { NextResponse } from 'next/server';
import tokenize from '@/../../compiler/lexer';
import parse from '@/../../compiler/parser';
import evaluate from '@/../../compiler/generator';

export async function POST(req: Request): Promise<Response> {
  const { code, enableLogs } = await req.json();

  try {
    const startTime = Date.now();
    let output = '';

    // Capture console.log
    const originalLog = console.log;
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    const tokens = tokenize(code, enableLogs);
    if (enableLogs) console.log('Tokens:', tokens);

    const ast = parse(tokens, enableLogs);
    if (enableLogs) console.log('AST:', JSON.stringify(ast, null, 2));

    evaluate(ast, enableLogs);

    // Restore console.log
    console.log = originalLog;

    const endTime = Date.now();
    const compilationTime = `Code compiled in ${endTime - startTime} ms ✨`;

    return NextResponse.json({ output, time: compilationTime }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Error during compilation: ${error.message}` }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import tokenize from '@/../../compiler/lexer';
import parse from '@/../../compiler/parser';
import evaluate from '@/../../compiler/generator';

const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export async function POST(req: Request): Promise<Response> {
  const { code, enableLogs } = await req.json();
  const logDetails = enableLogs ?? false;

  return new Promise((resolve) => {
    const startTime = Date.now();
    let waitingMessageTimeout: NodeJS.Timeout;
    let spinnerInterval: NodeJS.Timeout;

    const showWaitingMessage = () => {
      let frameIndex = 0;
      spinnerInterval = setInterval(() => {
        const spinnerFrame = spinnerFrames[frameIndex];
        resolve(
          NextResponse.json({ output: `Compiling... This is taking longer than usual. ${spinnerFrame}` }, { status: 202 })
        );
        frameIndex = (frameIndex + 1) % spinnerFrames.length;
      }, 100);
    };

    waitingMessageTimeout = setTimeout(showWaitingMessage, 200);

    try {
      const tokens = tokenize(code, logDetails);
      if (logDetails) console.log('Tokens:', tokens);

      const ast = parse(tokens, logDetails);
      if (logDetails) console.log('AST:', JSON.stringify(ast, null, 2));

      let output = '';
      const originalLog = console.log;
      console.log = (...args) => {
        output += args.join(' ') + '\n';
        originalLog(...args);
      };

      evaluate(ast, logDetails);
      console.log = originalLog;

      clearTimeout(waitingMessageTimeout);
      clearInterval(spinnerInterval);

      const endTime = Date.now();
      const compilationTime = `Code compiled in ${endTime - startTime} ms ✨`;

      resolve(NextResponse.json({ output, time: compilationTime }, { status: 200 }));
    } catch (error: any) {
      clearTimeout(waitingMessageTimeout);
      clearInterval(spinnerInterval);
      resolve(NextResponse.json({ error: `Error during compilation: ${error.message}` }, { status: 500 }));
    }
  });
}

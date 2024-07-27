import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { code } = await req.json();
  const filePath = path.resolve('temp.pow');

  fs.writeFileSync(filePath, code);

  return new Promise((resolve) => {
    const startTime = Date.now();
    exec(`node ${path.resolve('../compiler.js')} ${filePath}`, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);  // Ensure the file is deleted

      if (error) {
        const errorMessage = stderr.split('\n')[0]; // Extract only the first line of the error message
        resolve(
          NextResponse.json({ error: `Error during compilation: ${errorMessage}` }, { status: 500 })
        );
      } else {
        const endTime = Date.now();
        const compilationTime = `Code compiled in ${endTime - startTime} ms ✨`;
        resolve(
          NextResponse.json({ output: stdout, time: compilationTime }, { status: 200 })
        );
      }
    });
  });
}

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';

export async function POST(req: Request) {
  const { code } = await req.json();

  fs.writeFileSync('temp.pow', code);

  return new Promise((resolve) => {
    exec('node /Users/samy/Développement/pow_compiler/compiler.js temp.pow', (error, stdout, stderr) => {
      if (error) {
        resolve(
          NextResponse.json({ error: stderr }, { status: 500 })
        );
      } else {
        resolve(
          NextResponse.json({ output: stdout }, { status: 200 })
        );
      }
      fs.unlinkSync('temp.pow');
    });
  });
}

import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth-config';

export async function GET() {
  return NextResponse.json({
    mode: authConfig.mode,
    allowRegistration: authConfig.allowRegistration,
  });
}

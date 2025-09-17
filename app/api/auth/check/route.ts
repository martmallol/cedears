import { NextResponse } from 'next/server';
import { portfolioPersonalAPI } from '@/lib/portfolio-personal-api';

export async function GET() {
  try {
    // Try to load credentials from environment variables
    const hasEnvCredentials = portfolioPersonalAPI.loadCredentialsFromEnv();
    
    if (!hasEnvCredentials) {
      return NextResponse.json(
        { error: 'No environment credentials found' },
        { status: 401 }
      );
    }

    // Test authentication
    const isAuthenticated = await portfolioPersonalAPI.authenticate();

    if (isAuthenticated) {
      return NextResponse.json({ 
        success: true, 
        message: 'Environment credentials authenticated successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Environment credentials authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Environment auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

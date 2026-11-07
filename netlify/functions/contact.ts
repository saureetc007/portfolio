import { POST } from '../../api/contact.ts';

export default async function (request: Request) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return POST(request);
}

export const config = {
  path: '/api/contact',
};


export default async function handler(request) {
  const url = new URL(request.url);
  const affiliateId = url.searchParams.get('ref');
  
  if (affiliateId) {
    // Track affiliate click at edge
    await trackAffiliateClick(affiliateId, request);
    
    // Set affiliate cookie
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `affiliate_id=${affiliateId}; Max-Age=7776000; Path=/; SameSite=Lax`
      }
    });
    
    return response;
  }
  
  return new Response('Invalid affiliate link', { status: 400 });
}

async function trackAffiliateClick(affiliateId, request) {
  // Real-time affiliate tracking
  const data = {
    affiliateId,
    timestamp: Date.now(),
    ip: request.headers.get('cf-connecting-ip'),
    userAgent: request.headers.get('user-agent'),
    country: request.geo?.country,
    referer: request.headers.get('referer')
  };
  
  // Send to analytics
  await fetch(process.env.AFFILIATE_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

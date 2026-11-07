// Automated verification test suite for Contact Form validation and serverless API
import { validateContactForm, sanitizeText, CONTACT_LIMITS } from '../src/lib/contactValidation.ts';
import { POST } from '../api/contact.ts';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('\n=== RUNNING CONTACT VALIDATION & API TESTS ===\n');

  // Test 1: Valid contact submission
  console.log('1. Valid payload validation:');
  const validResult = validateContactForm({
    name: 'Alex Developer',
    email: 'alex@example.com',
    subject: 'AI Pipeline Collaboration Inquiry',
    message: 'Hello Saureet, I saw your work on DecisionVault and would love to collaborate on local LLM workflows.',
  });
  assert(validResult.isValid === true, 'Valid payload passes validation');
  assert(Object.keys(validResult.errors).length === 0, 'No errors on valid payload');
  assert(validResult.sanitized.email === 'alex@example.com', 'Email normalized and preserved');

  // Test 2: Missing fields
  console.log('\n2. Missing required fields validation:');
  const emptyResult = validateContactForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  assert(emptyResult.isValid === false, 'Empty payload fails validation');
  assert(emptyResult.errors.name !== undefined, 'Name required error present');
  assert(emptyResult.errors.email !== undefined, 'Email required error present');
  assert(emptyResult.errors.subject !== undefined, 'Subject required error present');
  assert(emptyResult.errors.message !== undefined, 'Message required error present');

  // Test 3: Invalid email formats
  console.log('\n3. Invalid email formats:');
  const invalidEmails = ['plainaddress', '@missingusername.com', 'user@.com', 'user@domain'];
  for (const email of invalidEmails) {
    const res = validateContactForm({
      name: 'Test User',
      email,
      subject: 'Valid Subject',
      message: 'This is a valid test message with sufficient length.',
    });
    assert(res.errors.email !== undefined, `Rejected invalid email: "${email}"`);
  }

  // Test 4: Length constraints
  console.log('\n4. Length constraints:');
  const shortSubject = validateContactForm({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Hi', // < 3 chars
    message: 'This is a valid test message with sufficient length.',
  });
  assert(shortSubject.errors.subject !== undefined, 'Subject < 3 chars rejected');

  const shortMessage = validateContactForm({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Valid Subject',
    message: 'Too short', // < 10 chars
  });
  assert(shortMessage.errors.message !== undefined, 'Message < 10 chars rejected');

  // Test 5: HTML Sanitization
  console.log('\n5. HTML sanitization:');
  const dirty = '<script>alert("xss")</script> & <b>Hello</b>';
  const clean = sanitizeText(dirty);
  assert(!clean.includes('<script>'), 'Script tags escaped');
  assert(clean.includes('&lt;script&gt;'), 'LT/GT replaced with HTML entities');

  // Test 6: Honeypot handling in API handler
  console.log('\n6. API handler honeypot trap:');
  const botRequest = new Request('http://localhost:5173/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Spam Bot',
      email: 'bot@spam.com',
      subject: 'Buy cheap watches',
      message: 'Buy now click this link immediately',
      website: 'http://spamwebsite.com', // Filled honeypot
    }),
  });
  const botResponse = await POST(botRequest);
  const botData = await botResponse.json();
  assert(botResponse.status === 200, 'Honeypot returns 200 decoy');
  assert(botData.success === true, 'Honeypot returns success decoy without dispatching email');

  // Test 7: Missing credentials error in API handler
  console.log('\n7. API handler when RESEND_API_KEY is unset:');
  delete process.env.RESEND_API_KEY;
  const legitRequest = new Request('http://localhost:5173/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.100' },
    body: JSON.stringify({
      name: 'Valid Visitor',
      email: 'visitor@example.com',
      subject: 'Valid Inquiry',
      message: 'Hello Saureet, I would like to discuss an engineering project.',
    }),
  });
  const legitResponse = await POST(legitRequest);
  const legitData = await legitResponse.json();
  assert(legitResponse.status === 503, 'Returns 503 when RESEND_API_KEY is not configured');
  assert(legitData.success === false, 'Returns success: false when provider is unconfigured');
  assert(legitData.error.includes('saureetc007@gmail.com'), 'Provides direct fallback email in error response');

  console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner encountered fatal error:', err);
  process.exit(1);
});

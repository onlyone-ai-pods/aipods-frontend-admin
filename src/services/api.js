/**
 * Admin Portal API Service Connector
 * Connects the Senior Review Hub to the Go Backend Engine (aipods-core-engine)
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function fetchPendingApprovals(tenantId = 'GLOBAL') {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/approvals?tenant_id=${tenantId}`);
    if (!res.ok) throw new Error('API server unreachable');
    return await res.json();
  } catch (err) {
    console.warn('Backend Go API offline. Using Senior Review Hub fallback data.', err);
    return null;
  }
}

export async function submitActionReview(approvalToken, isApproved) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/approvals/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approval_token: approvalToken,
        action: isApproved ? 'APPROVE' : 'REJECT',
      }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Submitting review in offline fallback mode.', err);
    return { status: isApproved ? 'APPROVED' : 'REJECTED' };
  }
}

import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

// Security incident reporting and monitoring API
interface SecurityIncident {
  id: string;
  type: 'suspicious_activity' | 'integrity_violation' | 'unauthorized_access' | 'scraping_attempt';
  timestamp: number;
  fingerprint: string;
  sessionId: string;
  data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress: string;
  userAgent: string;
  url: string;
}

interface ThreatResponse {
  action: 'log' | 'block' | 'investigate' | 'legal_action';
  severity: number;
  automated: boolean;
  notifyAdmins: boolean;
}

// In-memory storage for demo (use database in production)
const securityIncidents: SecurityIncident[] = [];
const suspiciousIPs = new Set<string>();
const blockedFingerprints = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const body = await request.json();
    
    // Validate security token
    const securityToken = request.headers.get('X-Security-Token');
    if (!isValidSecurityToken(securityToken, body.sessionId)) {
      return NextResponse.json(
        { error: 'Invalid security token' },
        { status: 401 }
      );
    }

    // Create incident record
    const incident: SecurityIncident = {
      id: generateIncidentId(),
      type: body.type,
      timestamp: body.timestamp || Date.now(),
      fingerprint: body.fingerprint,
      sessionId: body.sessionId,
      data: body.data,
      severity: determineSeverity(body.type, body.data),
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent') || '',
      url: body.data?.url || '',
    };

    // Store incident
    securityIncidents.push(incident);

    // Analyze and respond to threat
    const response = await analyzeThreat(incident);
    
    // Take automated action if necessary
    if (response.automated) {
      await takeAutomatedAction(incident, response);
    }

    // Notify administrators for high severity incidents
    if (response.notifyAdmins) {
      await notifyAdministrators(incident);
    }

    // Log incident for monitoring
    console.log(`🚨 Security Incident [${incident.severity.toUpperCase()}]:`, {
      type: incident.type,
      ip: incident.ipAddress,
      fingerprint: incident.fingerprint.substring(0, 8) + '...',
      timestamp: new Date(incident.timestamp).toISOString()
    });

    return NextResponse.json({
      success: true,
      incidentId: incident.id,
      severity: incident.severity,
      action: response.action,
      message: 'Security incident recorded and processed'
    });

  } catch (error) {
    console.error('Security incident processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process security incident' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminToken = searchParams.get('adminToken');
    
    // Verify admin access (simplified for demo)
    if (!isValidAdminToken(adminToken)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Return security statistics
    const stats = generateSecurityStats();
    
    return NextResponse.json({
      stats,
      recentIncidents: securityIncidents
        .slice(-50) // Last 50 incidents
        .map(incident => ({
          ...incident,
          fingerprint: incident.fingerprint.substring(0, 8) + '...',
          ipAddress: maskIP(incident.ipAddress)
        }))
    });

  } catch (error) {
    console.error('Security stats retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve security data' },
      { status: 500 }
    );
  }
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function isValidSecurityToken(token: string | null, sessionId: string): boolean {
  if (!token || !sessionId) return false;
  
  // Verify HMAC signature (simplified)
  const expectedToken = CryptoJS.HmacSHA256(
    sessionId + Math.floor(Date.now() / 60000), // 1-minute window
    'dropify-security-key'
  ).toString();
  
  return token === expectedToken;
}

function generateIncidentId(): string {
  return `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function determineSeverity(
  type: SecurityIncident['type'], 
  data: any
): SecurityIncident['severity'] {
  switch (type) {
    case 'integrity_violation':
      return 'critical';
    case 'unauthorized_access':
      return 'high';
    case 'scraping_attempt':
      return 'medium';
    case 'suspicious_activity':
      // Determine based on data
      if (data?.rapidClicks > 100) return 'high';
      if (data?.botIndicators) return 'medium';
      return 'low';
    default:
      return 'medium';
  }
}

async function analyzeThreat(incident: SecurityIncident): Promise<ThreatResponse> {
  const response: ThreatResponse = {
    action: 'log',
    severity: getSeverityScore(incident.severity),
    automated: false,
    notifyAdmins: false
  };

  // Check if IP is already suspicious
  if (suspiciousIPs.has(incident.ipAddress)) {
    response.severity += 2;
    response.action = 'block';
    response.automated = true;
  }

  // Check for repeated incidents from same fingerprint
  const recentIncidents = securityIncidents.filter(
    i => i.fingerprint === incident.fingerprint && 
         Date.now() - i.timestamp < 300000 // Last 5 minutes
  );

  if (recentIncidents.length > 3) {
    response.severity += 3;
    response.action = 'investigate';
    response.notifyAdmins = true;
    suspiciousIPs.add(incident.ipAddress);
  }

  // High severity incidents require immediate attention
  if (incident.severity === 'critical' || incident.severity === 'high') {
    response.notifyAdmins = true;
    response.automated = true;
    
    if (incident.severity === 'critical') {
      response.action = 'legal_action';
      blockedFingerprints.add(incident.fingerprint);
    }
  }

  return response;
}

async function takeAutomatedAction(
  incident: SecurityIncident, 
  response: ThreatResponse
): Promise<void> {
  switch (response.action) {
    case 'block':
      // Add to blocklist
      suspiciousIPs.add(incident.ipAddress);
      blockedFingerprints.add(incident.fingerprint);
      console.log(`🚫 Blocked IP and fingerprint: ${incident.ipAddress}`);
      break;
      
    case 'investigate':
      // Flag for manual review
      console.log(`🔍 Flagged for investigation: ${incident.fingerprint.substring(0, 8)}...`);
      break;
      
    case 'legal_action':
      // Prepare evidence for legal action
      await prepareEvidencePackage(incident);
      console.log(`⚖️ Prepared legal evidence package for incident: ${incident.id}`);
      break;
  }
}

async function notifyAdministrators(incident: SecurityIncident): Promise<void> {
  // In production, send email/SMS alerts to administrators
  console.log(`📧 Admin notification sent for incident: ${incident.id}`);
  
  // Could integrate with services like:
  // - SendGrid for email notifications
  // - Twilio for SMS alerts
  // - Slack for team notifications
  // - PagerDuty for on-call alerts
}

async function prepareEvidencePackage(incident: SecurityIncident): Promise<void> {
  const evidence = {
    incidentId: incident.id,
    timestamp: new Date(incident.timestamp).toISOString(),
    ipAddress: incident.ipAddress,
    userAgent: incident.userAgent,
    fingerprint: incident.fingerprint,
    violationType: incident.type,
    evidence: incident.data,
    relatedIncidents: securityIncidents.filter(
      i => i.ipAddress === incident.ipAddress || i.fingerprint === incident.fingerprint
    )
  };

  // Store evidence package (in production, store securely and notify legal team)
  console.log('📁 Evidence package prepared:', evidence);
}

function getSeverityScore(severity: SecurityIncident['severity']): number {
  switch (severity) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    case 'critical': return 4;
    default: return 1;
  }
}

function isValidAdminToken(token: string | null): boolean {
  // In production, implement proper admin authentication
  return token === 'dropify-admin-security-token';
}

function maskIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  return 'xxx.xxx.xxx.xxx';
}

function generateSecurityStats() {
  const now = Date.now();
  const last24h = now - (24 * 60 * 60 * 1000);
  const last7d = now - (7 * 24 * 60 * 60 * 1000);

  const incidents24h = securityIncidents.filter(i => i.timestamp > last24h);
  const incidents7d = securityIncidents.filter(i => i.timestamp > last7d);

  return {
    totalIncidents: securityIncidents.length,
    incidentsLast24h: incidents24h.length,
    incidentsLast7d: incidents7d.length,
    suspiciousIPs: suspiciousIPs.size,
    blockedFingerprints: blockedFingerprints.size,
    severityBreakdown: {
      critical: securityIncidents.filter(i => i.severity === 'critical').length,
      high: securityIncidents.filter(i => i.severity === 'high').length,
      medium: securityIncidents.filter(i => i.severity === 'medium').length,
      low: securityIncidents.filter(i => i.severity === 'low').length,
    },
    topThreats: getTopThreats(),
    protectionStatus: 'active',
    lastUpdate: new Date().toISOString()
  };
}

function getTopThreats() {
  const threatCounts = securityIncidents.reduce((acc, incident) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(threatCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
}

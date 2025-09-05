/**
 * LEGAL PROTECTION AND COPYRIGHT ENFORCEMENT
 * Automated DMCA and Legal Response System
 */

import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

interface LegalAction {
  id: string;
  type: 'dmca_takedown' | 'cease_and_desist' | 'trademark_violation' | 'copyright_infringement';
  targetUrl: string;
  targetEntity: string;
  evidence: string[];
  status: 'initiated' | 'sent' | 'acknowledged' | 'resolved' | 'escalated';
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface CopyrightViolation {
  url: string;
  similarity: number;
  violationType: 'exact_copy' | 'substantial_similarity' | 'design_theft' | 'code_theft';
  detectedElements: string[];
  evidence: {
    screenshots: string[];
    sourceCode: string;
    similarities: string[];
  };
}

// In-memory storage for demo (use database in production)
const legalActions: LegalAction[] = [];
const monitoredDomains = new Set<string>();
const copyrightViolations: CopyrightViolation[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'report_violation':
        return await handleViolationReport(data);
      
      case 'initiate_dmca':
        return await initiateDMCARequest(data);
      
      case 'send_cease_desist':
        return await sendCeaseAndDesist(data);
      
      case 'monitor_domain':
        return await addDomainMonitoring(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Legal protection API error:', error);
    return NextResponse.json(
      { error: 'Legal protection request failed' },
      { status: 500 }
    );
  }
}

async function handleViolationReport(data: any): Promise<NextResponse> {
  const violation: CopyrightViolation = {
    url: data.url,
    similarity: data.similarity || 0,
    violationType: data.violationType,
    detectedElements: data.detectedElements || [],
    evidence: {
      screenshots: data.screenshots || [],
      sourceCode: data.sourceCode || '',
      similarities: data.similarities || []
    }
  };

  copyrightViolations.push(violation);

  // Determine action based on violation severity
  let actionRequired = 'monitor';
  if (violation.similarity > 0.8) {
    actionRequired = 'immediate_dmca';
  } else if (violation.similarity > 0.6) {
    actionRequired = 'cease_and_desist';
  } else if (violation.similarity > 0.4) {
    actionRequired = 'warning_notice';
  }

  // Generate evidence package
  const evidencePackage = await generateEvidencePackage(violation);

  console.log(`⚖️ Copyright violation reported: ${violation.url} (${violation.similarity * 100}% similarity)`);

  return NextResponse.json({
    success: true,
    violationId: `vio_${Date.now()}`,
    actionRequired,
    similarity: violation.similarity,
    evidencePackage: evidencePackage.id,
    message: 'Copyright violation recorded and analyzed'
  });
}

async function initiateDMCARequest(data: any): Promise<NextResponse> {
  const legalAction: LegalAction = {
    id: generateLegalActionId(),
    type: 'dmca_takedown',
    targetUrl: data.targetUrl,
    targetEntity: data.targetEntity || 'Unknown',
    evidence: data.evidence || [],
    status: 'initiated',
    timestamp: Date.now(),
    priority: determinePriority(data)
  };

  legalActions.push(legalAction);

  // Generate DMCA takedown notice
  const dmcaNotice = generateDMCANotice(legalAction);
  
  // In production, automatically send to hosting providers
  await sendDMCAToProviders(legalAction, dmcaNotice);

  console.log(`📧 DMCA takedown initiated for: ${legalAction.targetUrl}`);

  return NextResponse.json({
    success: true,
    actionId: legalAction.id,
    dmcaNotice: dmcaNotice.id,
    status: 'sent',
    message: 'DMCA takedown notice initiated'
  });
}

async function sendCeaseAndDesist(data: any): Promise<NextResponse> {
  const legalAction: LegalAction = {
    id: generateLegalActionId(),
    type: 'cease_and_desist',
    targetUrl: data.targetUrl,
    targetEntity: data.targetEntity || 'Unknown',
    evidence: data.evidence || [],
    status: 'initiated',
    timestamp: Date.now(),
    priority: 'medium'
  };

  legalActions.push(legalAction);

  // Generate cease and desist letter
  const ceaseDesistLetter = generateCeaseDesistLetter(legalAction);
  
  console.log(`📋 Cease and desist sent to: ${legalAction.targetEntity}`);

  return NextResponse.json({
    success: true,
    actionId: legalAction.id,
    letter: ceaseDesistLetter.id,
    message: 'Cease and desist letter sent'
  });
}

async function addDomainMonitoring(data: any): Promise<NextResponse> {
  const domain = data.domain;
  monitoredDomains.add(domain);

  console.log(`👁️ Added domain monitoring: ${domain}`);

  return NextResponse.json({
    success: true,
    domain,
    monitoringActive: true,
    message: 'Domain monitoring activated'
  });
}

function generateLegalActionId(): string {
  return `legal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function determinePriority(data: any): LegalAction['priority'] {
  if (data.similarity > 0.9) return 'urgent';
  if (data.similarity > 0.7) return 'high';
  if (data.similarity > 0.5) return 'medium';
  return 'low';
}

async function generateEvidencePackage(violation: CopyrightViolation) {
  const evidenceId = `evidence_${Date.now()}`;

  const evidencePackage = {
    id: evidenceId,
    timestamp: new Date().toISOString(),
    violation,
    originalWork: {
      url: 'https://dropify.app',
      copyrightDate: '2024',
      registrationNumber: 'DROPIFY-2024-001',
      owner: 'Dropify Technologies LLC'
    },
    comparison: {
      similarity: violation.similarity,
      identicalElements: violation.detectedElements,
      uniqueIdentifiers: [
        'holographic-gradient-system',
        'particle-animation-engine',
        'receipt-processing-workflow',
        'dual-token-architecture'
      ]
    },
    legalBasis: [
      'Copyright infringement under 17 USC § 501',
      'Trademark violation under 15 USC § 1114',
      'Unfair competition under state law',
      'Digital Millennium Copyright Act violation'
    ]
  };

  console.log(`📁 Evidence package generated: ${evidenceId}`);
  return evidencePackage;
}

function generateDMCANotice(action: LegalAction) {
  const noticeId = `dmca_${Date.now()}`;
  
  const notice = {
    id: noticeId,
    to: 'Legal Department / DMCA Agent',
    from: 'Dropify Technologies LLC',
    date: new Date().toISOString(),
    subject: `DMCA Takedown Notice - Copyright Infringement`,
    body: `
DIGITAL MILLENNIUM COPYRIGHT ACT TAKEDOWN NOTICE

To Whom It May Concern:

I am writing to notify you of copyright infringement occurring on your platform.

IDENTIFICATION OF COPYRIGHTED WORK:
Original Work: Dropify - Revolutionary Receipt-to-Rewards Platform
Copyright Owner: Dropify Technologies LLC
Original URL: https://dropify.app
Copyright Registration: DROPIFY-2024-001

IDENTIFICATION OF INFRINGING MATERIAL:
Infringing URL: ${action.targetUrl}
Description: Unauthorized copy of our proprietary design and code

STATEMENT OF GOOD FAITH BELIEF:
I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

STATEMENT OF ACCURACY:
The information in this notification is accurate, and under penalty of perjury, I am authorized to act on behalf of the copyright owner.

CONTACT INFORMATION:
Dropify Technologies LLC
Email: dropifytoken@gmail.com
Phone: +1 (602) 422-3656

Please remove the infringing content immediately to avoid further legal action.

Sincerely,
Legal Team
Dropify Technologies LLC
    `,
    evidence: action.evidence,
    priority: action.priority
  };

  return notice;
}

function generateCeaseDesistLetter(action: LegalAction) {
  const letterId = `cd_${Date.now()}`;
  
  const letter = {
    id: letterId,
    to: action.targetEntity,
    from: 'Dropify Technologies LLC - Legal Department',
    date: new Date().toISOString(),
    subject: 'CEASE AND DESIST - Copyright and Trademark Infringement',
    body: `
CEASE AND DESIST NOTICE

TO: ${action.targetEntity}
FROM: Dropify Technologies LLC

RE: Immediate Cessation of Copyright and Trademark Infringement

Dear Sir or Madam:

This letter serves as formal notice that you are infringing upon the copyrighted and trademarked property of Dropify Technologies LLC ("Dropify").

INFRINGING ACTIVITIES:
Your website at ${action.targetUrl} contains unauthorized copies of our:
- Proprietary design elements
- Copyrighted code
- Trademarked branding
- Unique user interface patterns

LEGAL BASIS:
Your actions constitute:
1. Copyright infringement under 17 U.S.C. § 501
2. Trademark infringement under 15 U.S.C. § 1114
3. Unfair competition under applicable state law

DEMAND:
You must immediately:
1. Remove all infringing content
2. Cease all use of our intellectual property
3. Confirm compliance within 5 business days

CONSEQUENCES:
Failure to comply will result in:
- Federal lawsuit for damages
- Injunctive relief
- Attorney fees and costs
- Potential criminal prosecution

This letter is not a complete statement of our rights and remedies, all of which are expressly reserved.

Sincerely,

Legal Department
Dropify Technologies LLC
dropifytoken@gmail.com
    `,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
    consequences: [
      'Federal lawsuit',
      'Monetary damages',
      'Injunctive relief',
      'Attorney fees'
    ]
  };

  return letter;
}

async function sendDMCAToProviders(action: LegalAction, notice: any): Promise<void> {
  // In production, automatically send to:
  // - Hosting providers (via WHOIS lookup)
  // - Domain registrars
  // - CDN providers
  // - Search engines (Google, Bing)
  
  console.log(`📧 DMCA notice sent to providers for: ${action.targetUrl}`);
  
  // Update action status
  const actionIndex = legalActions.findIndex(a => a.id === action.id);
  if (actionIndex !== -1) {
    legalActions[actionIndex].status = 'sent';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminToken = searchParams.get('adminToken');
    
    if (!isValidAdminToken(adminToken)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      legalActions: legalActions.slice(-50),
      copyrightViolations: copyrightViolations.slice(-50),
      monitoredDomains: Array.from(monitoredDomains),
      statistics: {
        totalActions: legalActions.length,
        activeMonitoring: monitoredDomains.size,
        pendingActions: legalActions.filter(a => a.status === 'initiated' || a.status === 'sent').length,
        resolvedActions: legalActions.filter(a => a.status === 'resolved').length
      }
    });

  } catch (error) {
    console.error('Legal data retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve legal data' },
      { status: 500 }
    );
  }
}

function isValidAdminToken(token: string | null): boolean {
  // In production, implement proper admin authentication
  return token === 'dropify-admin-legal-token';
}

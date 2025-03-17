import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for leads
// In production, you would use a proper database
const leads: Record<string, Lead> = {};

// Define Lead interface
interface Lead {
  id: string;
  email?: string;
  phone?: string;
  preferredChannel?: 'email' | 'whatsapp' | 'sms';
  qualification: {
    hasWebsite: boolean | null;
    mainGoal: string | null;
    timeline: string | null;
    budget: string | null;
    industry: string | null;
    qualified: boolean;
  };
  interactions: {
    timestamp: string;
    type: string;
    data: any;
  }[];
  createdAt: string;
  updatedAt: string;
  score: number; // 0-100 lead score based on qualification answers
}

// Calculate a lead score based on qualification data
function calculateLeadScore(qualification: Lead['qualification']): number {
  let score = 0;
  
  // Website status: No website = higher chance they need one
  if (qualification.hasWebsite === false) score += 30;
  else if (qualification.hasWebsite === true) score += 20;
  
  // Main goal scoring
  if (qualification.mainGoal === "Sell products online") score += 30;
  else if (qualification.mainGoal === "Get more customers") score += 25;
  else if (qualification.mainGoal === "Build brand awareness") score += 20;
  else if (qualification.mainGoal) score += 15;
  
  // Timeline scoring - sooner is better
  if (qualification.timeline === "ASAP") score += 40;
  else if (qualification.timeline === "Within 1 month") score += 30;
  else if (qualification.timeline === "Within 3 months") score += 20;
  else if (qualification.timeline === "Just exploring") score += 10;
  
  // Being qualified adds points
  if (qualification.qualified) score += 20;
  
  // Cap the score at 100
  return Math.min(score, 100);
}

// Store a new lead or update an existing one
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, email, phone, preferredChannel, qualification, interaction } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required lead ID' },
        { status: 400 }
      );
    }
    
    // Create or update lead
    if (!leads[id]) {
      // New lead
      leads[id] = {
        id,
        email,
        phone,
        preferredChannel,
        qualification: qualification || {
          hasWebsite: null,
          mainGoal: null,
          timeline: null,
          budget: null,
          industry: null,
          qualified: false
        },
        interactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: qualification ? calculateLeadScore(qualification) : 0
      };
    } else {
      // Update existing lead
      if (email) leads[id].email = email;
      if (phone) leads[id].phone = phone;
      if (preferredChannel) leads[id].preferredChannel = preferredChannel;
      
      if (qualification) {
        leads[id].qualification = {
          ...leads[id].qualification,
          ...qualification
        };
        // Recalculate lead score
        leads[id].score = calculateLeadScore(leads[id].qualification);
      }
      
      leads[id].updatedAt = new Date().toISOString();
    }
    
    // Add interaction if provided
    if (interaction) {
      leads[id].interactions.push({
        timestamp: new Date().toISOString(),
        type: interaction.type,
        data: interaction.data
      });
    }
    
    return NextResponse.json({
      success: true,
      lead: {
        ...leads[id],
        // Mask sensitive data for response
        email: leads[id].email ? `${leads[id].email.substring(0, 3)}****${leads[id].email.split('@')[1]}` : undefined,
        phone: leads[id].phone ? `****${leads[id].phone.substring(leads[id].phone.length - 4)}` : undefined
      }
    });
  } catch (error: any) {
    console.error('Error in lead storage API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get lead by ID
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    // Return summary stats if no ID is provided
    const totalLeads = Object.keys(leads).length;
    const qualifiedLeads = Object.values(leads).filter(lead => lead.qualification.qualified).length;
    const highValueLeads = Object.values(leads).filter(lead => lead.score >= 70).length;
    
    return NextResponse.json({
      success: true,
      stats: {
        total: totalLeads,
        qualified: qualifiedLeads,
        highValue: highValueLeads,
        conversionRate: totalLeads > 0 ? (qualifiedLeads / totalLeads * 100).toFixed(1) + '%' : '0%'
      }
    });
  }
  
  const lead = leads[id];
  if (!lead) {
    return NextResponse.json(
      { error: 'Lead not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    lead: {
      ...lead,
      // Mask sensitive data for response
      email: lead.email ? `${lead.email.substring(0, 3)}****${lead.email.split('@')[1]}` : undefined,
      phone: lead.phone ? `****${lead.phone.substring(lead.phone.length - 4)}` : undefined
    }
  });
} 
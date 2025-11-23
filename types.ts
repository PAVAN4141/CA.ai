
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  TAX_CHAT = 'TAX_CHAT',
  ADVISORY = 'ADVISORY',
  FIN_VIZ = 'FIN_VIZ',
  AUDIT_PLANNER = 'AUDIT_PLANNER',
  TAX_TRACKER = 'TAX_TRACKER',
  CLIENT_DATA = 'CLIENT_DATA',
  CLIENT_COMMUNICATION = 'CLIENT_COMMUNICATION',
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingSources?: { uri: string; title: string }[];
}

export interface FinancialDataPoint {
  category: string;
  value: number;
}

export interface VisualizationResponse {
  summary: string;
  data: FinancialDataPoint[];
}

export interface AuditEntry {
  id: string;
  clientName: string;
  auditType: string;
  date: string;
  team: string;
  timeEstimate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface TaxEntry {
  id: string;
  clientName: string;
  returnType: string;
  dueDate: string;
  status: 'Not Started' | 'Filed' | 'Processing';
}

export interface ClientDataEntry {
  id: string;
  name: string;
  email: string;
}

export interface ClientQueryEntry {
  id: string;
  fromEmail: string; // We map this to ClientDataEntry to get the name
  subject: string;
  queryText: string;
  status: 'New' | 'Replied';
  timestamp: string;
  replyText?: string;
}

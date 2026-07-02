// src/component/UC10/EmailDetail.jsx

import React, { useState } from 'react';
import { 
  Badge, ConfBar, DetailPanel, InfoGrid, ActionBtn, AlertBox, SubTitle 
} from '../index';
import ClassificationBreakdown from './ClassificationBreakdown';
import AttachmentsList from './AttachmentsList';
import InvestorInsight from './InvestorInsight';
import JIRASection from './JIRASection';
import ReviewWorkflow from './ReviewWorkflow';
import AuditTrail from './AuditTrail';

export default function EmailDetail({ 
  email, 
  onClose, 
  onAction,
  onApprove,
  onReject,
  onOverride,
  onMarkGoldenDataset,
  onCreateTicket,
  onAddComment,
}) {
  const [loading, setLoading] = useState('');

  if (!email) return null;

  const { 
    id, 
    subject, 
    from, 
    client, 
    status, 
    owner, 
    receivedAt, 
    priority, 
    slaRisk,
    classification,
    attachments,
    investorInsight,
    jiraTickets,
    review,
    exceptions,
    auditTrail,
    acknowledgement,
  } = email;

  async function handleAssign() {
    setLoading('assign');
    await onAction?.('assign', id, 'Sarah Lee');
    setLoading('');
  }

  async function handleCreateJira() {
    setLoading('jira');
    await onAction?.('createJira', id);
    setLoading('');
  }

  async function handleResolve() {
    setLoading('resolve');
    await onAction?.('resolve', id);
    setLoading('');
  }

  async function handleSendAcknowledgement() {
    setLoading('ack');
    await onAction?.('sendAcknowledgement', id);
    setLoading('');
  }

  const canAssign = status === 'Pending' || status === 'Normalized' || status === 'Validating';
  const canCreateJira = (status === 'Assigned' || status === 'Validating') && (!jiraTickets || jiraTickets.length === 0);
  const canResolve = status !== 'Resolved' && status !== 'Pending';

  // Check for exceptions
  const hasExceptions = exceptions && exceptions.length > 0;
  const highSeverityExceptions = exceptions?.filter(e => e.severity === 'high') || [];

  return (
    <DetailPanel 
      title="Email Processing Pipeline" 
      badge={status} 
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {canAssign && (
            <ActionBtn color="var(--blue)" onClick={handleAssign} disabled={!!loading}>
              {loading === 'assign' ? '…Assigning' : `↳ Assign to Team`}
            </ActionBtn>
          )}
          {canCreateJira && (
            <ActionBtn color="var(--teal)" onClick={handleCreateJira} disabled={!!loading}>
              {loading === 'jira' ? '…Creating' : 'Create JIRA ↗'}
            </ActionBtn>
          )}
          {canResolve && (
            <ActionBtn color="var(--green)" onClick={handleResolve} disabled={!!loading}>
              {loading === 'resolve' ? '…Resolving' : '✓ Resolve'}
            </ActionBtn>
          )}
          {!acknowledgement?.sent && (
            <ActionBtn color="var(--text2)" outline onClick={handleSendAcknowledgement} disabled={!!loading}>
              {loading === 'ack' ? '…Sending' : '✉️ Acknowledge'}
            </ActionBtn>
          )}
        </div>
      }
    >
      {/* Header Info */}
      <InfoGrid items={[
        ['Subject', subject, true],
        ['From', from],
        ['Client', client],
        ['Status', <Badge size="lg">{status}</Badge>],
        ['Priority', <Badge>{priority}</Badge>],
        ['Received', receivedAt],
        ['Owner', owner || 'Unassigned'],
      ]} />

      {slaRisk && (
        <AlertBox type="warning" title="⚠️ SLA Risk Detected">
          This email has a confidence score below 84% and requires human review. 
          It has been flagged for immediate attention.
        </AlertBox>
      )}

      {hasExceptions && (
        <AlertBox type="error" title={`⚠️ ${exceptions.length} Exception${exceptions.length > 1 ? 's' : ''} Detected`}>
          {highSeverityExceptions.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <strong>High severity:</strong> {highSeverityExceptions.map(e => e.description).join('; ')}
            </div>
          )}
          <div>Please review and resolve before proceeding.</div>
        </AlertBox>
      )}

      {/* Classification */}
      <ClassificationBreakdown classification={classification} />

      {/* Attachments */}
      <AttachmentsList attachments={attachments} />

      {/* Investor Insight */}
      <InvestorInsight data={investorInsight} />

      {/* JIRA Tickets */}
      <JIRASection 
        tickets={jiraTickets} 
        onAddComment={onAddComment}
        onCreateTicket={onCreateTicket}
        emailId={id}
      />

      {/* Human Review */}
      <ReviewWorkflow 
        review={review}
        classification={classification}
        onApprove={onApprove}
        onReject={onReject}
        onOverride={onOverride}
        onMarkGoldenDataset={onMarkGoldenDataset}
        emailId={id}
      />

      {/* Audit Trail */}
      <AuditTrail entries={auditTrail} />

      {/* Acknowledgement status */}
      {acknowledgement && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--bg4)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
            ✉️ Outlook Acknowledgement
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
            <span style={{ color: 'var(--text2)' }}>
              Status: {acknowledgement.status === 'sent' ? '✅ Sent' : acknowledgement.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
            </span>
            {acknowledgement.sentAt && (
              <span style={{ color: 'var(--text3)' }}>{acknowledgement.sentAt}</span>
            )}
          </div>
          {acknowledgement.error && (
            <div style={{ fontSize: 9, color: 'var(--red)', marginTop: 2 }}>Error: {acknowledgement.error}</div>
          )}
        </div>
      )}
    </DetailPanel>
  );
}
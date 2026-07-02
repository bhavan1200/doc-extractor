// src/component/UC10/ReviewWorkflow.jsx

import React, { useState } from 'react';
import { ActionBtn } from '../index';

export default function ReviewWorkflow({ 
  review, 
  classification, 
  onApprove, 
  onReject, 
  onOverride,
  onMarkGoldenDataset,
  emailId 
}) {
  const [notes, setNotes] = useState('');
  const [overrideCategory, setOverrideCategory] = useState('');
  const [showOverride, setShowOverride] = useState(false);

  if (!review) return null;

  const statusLabels = {
    pending_review: '⏳ Pending Review',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
    overridden: '🔄 Overridden',
    golden_dataset: '⭐ Golden Dataset',
  };

  const statusColors = {
    pending_review: 'var(--amber)',
    approved: 'var(--green)',
    rejected: 'var(--red)',
    overridden: 'var(--blue)',
    golden_dataset: 'var(--purple)',
  };

  const isPending = review.status === 'pending_review';

  const categories = [
    'Investor Inquiry', 'Account Maintenance', 'Reporting Request',
    'Onboarding', 'Document Request', 'Compliance',
    'Wire Instruction', 'Redemption Request'
  ];

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          ✅ Human Review
        </div>
        <span style={{ 
          fontSize: 10, 
          color: statusColors[review.status],
          fontWeight: 500,
        }}>
          {statusLabels[review.status] || review.status}
        </span>
      </div>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
        {/* Review status info */}
        {review.reviewedBy && (
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6 }}>
            Reviewed by: {review.reviewedBy} · {review.reviewedAt}
          </div>
        )}
        
        {review.overriddenClassification && (
          <div style={{ fontSize: 10, color: 'var(--blue)', marginBottom: 6 }}>
            Overridden from: {review.originalClassification} → {review.overriddenClassification}
            {review.overrideReason && ` (${review.overrideReason})`}
          </div>
        )}
        
        {review.isGoldenDataset && (
          <div style={{ fontSize: 10, color: 'var(--purple)', marginBottom: 6, fontWeight: 500 }}>
            ⭐ This is a Golden Dataset entry (used for model training)
          </div>
        )}
        
        {/* Actions for pending reviews */}
        {isPending && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <ActionBtn color="var(--green)" onClick={() => onApprove?.(emailId)}>
                ✓ Accept Classification
              </ActionBtn>
              <ActionBtn color="var(--red)" outline onClick={() => onReject?.(emailId, notes || 'No reason provided')}>
                ✗ Reject
              </ActionBtn>
              <ActionBtn color="var(--blue)" outline onClick={() => setShowOverride(!showOverride)}>
                ✎ Override
              </ActionBtn>
            </div>
            
            <div style={{ marginBottom: 6 }}>
              <input
                placeholder="Review notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '5px 8px', 
                  fontSize: 10, 
                  background: 'var(--bg4)', 
                  border: '0.5px solid var(--border)', 
                  borderRadius: 'var(--radius)', 
                  color: 'var(--text)',
                }}
              />
            </div>
            
            {showOverride && (
              <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
                <select
                  value={overrideCategory}
                  onChange={e => setOverrideCategory(e.target.value)}
                  style={{ 
                    flex: 1,
                    padding: '4px 8px', 
                    fontSize: 10, 
                    background: 'var(--bg4)', 
                    border: '0.5px solid var(--border)', 
                    borderRadius: 'var(--radius)', 
                    color: 'var(--text)',
                  }}
                >
                  <option value="">Select new classification...</option>
                  {categories.filter(c => c !== classification?.primary).map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {overrideCategory && (
                  <ActionBtn 
                    color="var(--blue)" 
                    onClick={() => {
                      onOverride?.(emailId, overrideCategory, notes || 'Manual override');
                      setShowOverride(false);
                      setOverrideCategory('');
                    }}
                  >
                    Apply Override
                  </ActionBtn>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <input
                type="checkbox"
                id="goldenDataset"
                onChange={() => onMarkGoldenDataset?.(emailId)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="goldenDataset" style={{ fontSize: 10, color: 'var(--text2)', cursor: 'pointer' }}>
                Mark as Golden Dataset for Training
              </label>
            </div>
          </div>
        )}
        
        {/* Show for non-pending */}
        {!isPending && review.notes && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '0.5px solid var(--border)' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>Review Notes:</div>
            <div style={{ fontSize: 10, color: 'var(--text2)' }}>{review.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
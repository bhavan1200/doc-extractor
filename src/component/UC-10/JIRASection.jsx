// src/component/UC10/JIRASection.jsx

import React, { useState } from 'react';
import { Badge, ActionBtn } from '../index';

const JIRA_STATUS_COLORS = {
  'Open': 'var(--blue)',
  'In Progress': 'var(--amber)',
  'Resolved': 'var(--green)',
  'Closed': 'var(--text3)',
  'Pending': 'var(--text3)',
};

export default function JIRASection({ tickets, onAddComment, onCreateTicket, emailId }) {
  const [comment, setComment] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    summary: '',
    description: '',
    priority: 'Medium',
    assignee: '',
  });

  if (!tickets || tickets.length === 0) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            🔗 JIRA Tickets (0)
          </div>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              fontSize: 10,
              color: 'var(--blue)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Create Ticket
          </button>
        </div>
        <div style={{ background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
          No JIRA tickets linked
        </div>
        {showCreateForm && (
          <div style={{ marginTop: 8, background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
            <input
              placeholder="Summary"
              value={newTicket.summary}
              onChange={e => setNewTicket({...newTicket, summary: e.target.value})}
              style={{ width: '100%', padding: '5px 8px', fontSize: 11, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', marginBottom: 6 }}
            />
            <textarea
              placeholder="Description"
              value={newTicket.description}
              onChange={e => setNewTicket({...newTicket, description: e.target.value})}
              rows={2}
              style={{ width: '100%', padding: '5px 8px', fontSize: 11, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', marginBottom: 6 }}
            />
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <select
                value={newTicket.priority}
                onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                style={{ flex: 1, padding: '4px 8px', fontSize: 10, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)' }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                value={newTicket.assignee}
                onChange={e => setNewTicket({...newTicket, assignee: e.target.value})}
                style={{ flex: 1, padding: '4px 8px', fontSize: 10, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)' }}
              >
                <option value="">Unassigned</option>
                {['John Smith', 'Sarah Lee', 'Michael Davis', 'Lisa Wong'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <ActionBtn color="var(--green)" onClick={() => { onCreateTicket?.(emailId, newTicket); setShowCreateForm(false); }}>
                Create Ticket
              </ActionBtn>
              <ActionBtn color="var(--text3)" outline onClick={() => setShowCreateForm(false)}>
                Cancel
              </ActionBtn>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleAddComment = (ticketId) => {
    if (comment.trim()) {
      onAddComment?.(ticketId, comment);
      setComment('');
    }
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          🔗 JIRA Tickets ({tickets.length})
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            fontSize: 10,
            color: 'var(--blue)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + Create New
        </button>
      </div>
      
      {tickets.map((ticket, index) => (
        <div 
          key={ticket.id}
          style={{
            background: 'var(--bg3)',
            borderRadius: 'var(--radius)',
            padding: '10px 12px',
            marginBottom: index < tickets.length - 1 ? 6 : 0,
            border: '0.5px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
                [{ticket.id}] {ticket.summary}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                {ticket.assignee} · Updated {ticket.updatedAt}
              </div>
            </div>
            <Badge>{ticket.status}</Badge>
          </div>
          
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6 }}>
            {ticket.description}
          </div>
          
          {/* Comments */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: '0.5px solid var(--border)' }}>
              {ticket.comments.map((c, i) => (
                <div key={c.id} style={{ marginBottom: i < ticket.comments.length - 1 ? 4 : 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>
                    <strong>{c.user}</strong> · {c.timestamp}
                    {c.type === 'internal' && <span style={{ marginLeft: 6, color: 'var(--amber)' }}>🔒 Internal</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>{c.text}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add comment */}
          <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
            <input
              placeholder="Add comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment(ticket.id)}
              style={{ flex: 1, padding: '4px 8px', fontSize: 10, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)' }}
            />
            <button
              onClick={() => handleAddComment(ticket.id)}
              style={{ padding: '4px 10px', fontSize: 10, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
            >
              Post
            </button>
          </div>
        </div>
      ))}
      
      {showCreateForm && (
        <div style={{ marginTop: 8, background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
          <input
            placeholder="Summary"
            value={newTicket.summary}
            onChange={e => setNewTicket({...newTicket, summary: e.target.value})}
            style={{ width: '100%', padding: '5px 8px', fontSize: 11, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', marginBottom: 6 }}
          />
          <textarea
            placeholder="Description"
            value={newTicket.description}
            onChange={e => setNewTicket({...newTicket, description: e.target.value})}
            rows={2}
            style={{ width: '100%', padding: '5px 8px', fontSize: 11, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', marginBottom: 6 }}
          />
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <select
              value={newTicket.priority}
              onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
              style={{ flex: 1, padding: '4px 8px', fontSize: 10, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)' }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              value={newTicket.assignee}
              onChange={e => setNewTicket({...newTicket, assignee: e.target.value})}
              style={{ flex: 1, padding: '4px 8px', fontSize: 10, background: 'var(--bg4)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)' }}
            >
              <option value="">Unassigned</option>
              {['John Smith', 'Sarah Lee', 'Michael Davis', 'Lisa Wong'].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <ActionBtn color="var(--green)" onClick={() => { onCreateTicket?.(emailId, newTicket); setShowCreateForm(false); }}>
              Create Ticket
            </ActionBtn>
            <ActionBtn color="var(--text3)" outline onClick={() => setShowCreateForm(false)}>
              Cancel
            </ActionBtn>
          </div>
        </div>
      )}
    </div>
  );
}
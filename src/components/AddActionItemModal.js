// File: /src/components/AddActionItemModal.js

import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, auth } from '../firebase';
import { getNameFromEmail } from '../utils/userUtils';

/**
 * Fields: action item name, additional notes, completion date, assigned to, time estimate, urgency (1-3).
 * Optionally parentId if we are adding a subtask under a parent.
 * For subtasks, we inherit the assignedTo value from the parent.
 * The 'createdBy' field is automatically set here and is not displayed to the user.
 */
function AddActionItemModal({ onClose, onAdded, parentId, parentAssignedTo, defaultAssignee }) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [urgency, setUrgency] = useState('1');

  useEffect(() => {
    // For subtasks, use parent's assignedTo
    if (parentId) {
      setAssignedTo(parentAssignedTo);
    }
    // For new tasks with default assignee
    else if (defaultAssignee) {
      setAssignedTo(defaultAssignee);
    }
    // For new tasks without default, use current user's name
    else if (auth.currentUser) {
      setAssignedTo(getNameFromEmail(auth.currentUser.email));
    }
  }, [parentId, parentAssignedTo, defaultAssignee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDoc = {
      name,
      notes,
      completionDate: date,
      timeEstimate,
      assignedTo: parentId ? parentAssignedTo : assignedTo,
      createdAt: new Date().toISOString(),
      parentId: parentId || null,

      // New fields:
      urgency: parseInt(urgency, 10),
      createdBy: getNameFromEmail(auth.currentUser?.email || '') || 'Open Task'
    };
    await addDoc(collection(db, 'actionItems'), newDoc);
    onAdded();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{parentId ? 'Add Subtask' : 'Add Action Item'}</h3>
          <button 
            onClick={onClose} 
            className="delete-btn" 
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter action item name"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Additional Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details or context"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Time Estimate:</label>
            <input
              type="text"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
              placeholder="e.g. 2 hours, 3 days"
            />
          </div>
          
          <div className="form-group">
            <label>Completion Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Only show assignedTo dropdown if top-level task */}
          {!parentId && (
            <div className="form-group">
              <label>Assigned To:</label>
              <div className="action-items-dropdown">
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="Open Task">Open Task</option>
                  <option value="Finn">Finn</option>
                  <option value="Clay">Clay</option>
                  <option value="Ryder">Ryder</option>
                </select>
              </div>
            </div>
          )}

          {/* Urgency field for both top-level tasks and subtasks */}
          <div className="form-group">
            <label>Urgency (1=Low, 3=High):</label>
            <select 
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
            >
              <option value="1">1 - Low</option>
              <option value="2">2 - Medium</option>
              <option value="3">3 - High</option>
            </select>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {parentId ? 'Add Subtask' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddActionItemModal;
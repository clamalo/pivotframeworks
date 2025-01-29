import React, { useState } from 'react';
import { db, collection, addDoc, auth } from '../firebase';
import { getNameFromEmail } from '../utils/userUtils';

function AddAgendaItemModal({ onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        title,
        notes,
        createdBy: getNameFromEmail(auth.currentUser?.email || ''),
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'agendaItems'), newItem);
      onAdded();
      onClose();
    } catch (error) {
      console.error('Error adding agenda item:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Agenda Item</h3>
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter agenda item title"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or details"
              rows={4}
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAgendaItemModal; 
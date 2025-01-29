import React, { useState } from 'react';

function EditAgendaItemModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...item,
      title,
      notes
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Agenda Item</h3>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAgendaItemModal; 
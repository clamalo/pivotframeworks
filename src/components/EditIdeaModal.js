import React, { useState } from 'react';

function EditIdeaModal({ idea, onClose, onSave }) {
  const [title, setTitle] = useState(idea.title);
  const [info, setInfo] = useState(idea.info);
  const [creator, setCreator] = useState(idea.creator);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...idea,
      title,
      info,
      creator
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Idea</h3>
          <button 
            className="btn-icon" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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
              placeholder="Enter idea title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="info">Additional Information</label>
            <textarea
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Enter additional information"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="creator">Creator</label>
            <select
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              required
            >
              <option value="Finn">Finn</option>
              <option value="Clay">Clay</option>
              <option value="Ryder">Ryder</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
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

export default EditIdeaModal; 
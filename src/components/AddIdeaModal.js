import React, { useState, useEffect } from 'react';
import { db, addDoc, collection, auth } from '../firebase';
import { getNameFromEmail } from '../utils/userUtils';

/**
 * Fields: title, additional info, creator tag (Clay, Finn, Ryder).
 */
function AddIdeaModal({ onClose, onIdeaAdded }) {
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [creator, setCreator] = useState('');

  useEffect(() => {
    // Set default creator based on logged in user
    if (auth.currentUser) {
      setCreator(getNameFromEmail(auth.currentUser.email));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create an idea with rank=null and blank votes for each user
    await addDoc(collection(db, 'ideas'), {
      title,
      info,
      creator,
      rank: null,
      votes: {
        Clay: null,
        Finn: null,
        Ryder: null
      }
    });
    onIdeaAdded();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Idea</h3>
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
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Additional Info:</label>
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Describe your idea"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Creator:</label>
            <select 
              value={creator} 
              onChange={(e) => setCreator(e.target.value)}
            >
              <option value="Clay">Clay</option>
              <option value="Finn">Finn</option>
              <option value="Ryder">Ryder</option>
            </select>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddIdeaModal;
import React, { useState } from 'react';
import { db, collection, addDoc, auth } from '../firebase';
import { getNameFromEmail } from '../utils/userUtils';

/**
 * Fields: title, additional info, creator tag (Clay, Finn, Ryder).
 */
function AddIdeaModal({ onClose, onIdeaAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newIdea = {
        title,
        description,
        creator: getNameFromEmail(auth.currentUser?.email || ''),
        createdAt: new Date().toISOString(),
        votes: {},
        rank: null
      };
      
      await addDoc(collection(db, 'ideas'), newIdea);
      onIdeaAdded();
      onClose();
    } catch (error) {
      console.error('Error adding idea:', error);
    }
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea"
              rows={4}
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddIdeaModal;
import React, { useState } from 'react';
import EditIdeaModal from './EditIdeaModal';

/**
 * For unranked ideas: 
 * - A text input to store temporary rank in "onRankInput"
 * For ranked ideas:
 * - Display the rank in a text input, and call "onRankChange" when changed
 */
function IdeaCard({ idea, isUnranked, onRankInput, onRankChange, onDelete, onEdit }) {
  const [localRank, setLocalRank] = useState(idea.rank || '');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleChange = (e) => {
    setLocalRank(e.target.value);
    if (isUnranked) {
      onRankInput(e.target.value);
    } else if (onRankChange) {
      onRankChange(idea.id, e.target.value);
    }
  };

  return (
    <>
      <div className="idea-card">
        <div className="idea-card-header">
            <h4>{idea.title}</h4>
          <div className="idea-card-actions">
            <button
              onClick={() => setShowEditModal(true)}
              className="edit-btn"
              aria-label="Edit idea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="delete-btn"
              aria-label="Delete idea"
            >
              ×
            </button>
          </div>
        </div>
        <p>{idea.info}</p>
        <div className="idea-card-footer">
          <div className="creator-tag">Creator: {idea.creator}</div>
            <div className="rank-input-group">
            <label>Rank:</label>
              <input
                type="number"
              step="0.1"
                min="0"
                max="10"
              value={localRank}
              onChange={handleChange}
                className="rank-input"
              />
            </div>
        </div>
      </div>

      {showEditModal && (
        <EditIdeaModal
          idea={idea}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedIdea) => {
            onEdit(updatedIdea);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}

export default IdeaCard;
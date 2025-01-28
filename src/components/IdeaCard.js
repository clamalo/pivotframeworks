import React, { useState } from 'react';
import EditIdeaModal from './EditIdeaModal';
import { auth } from '../firebase';
import { getNameFromEmail } from '../utils/userUtils';

/**
 * Each user sees one voting box (or an Edit button if they've already voted).
 * Once all three users have voted, the average is computed and the idea automatically moves to ranked.
 * If the idea is ranked, we display its final average rank. Users can still edit their own vote.
 */
function IdeaCard({ idea, onDelete, onEdit, onSaveVote }) {
  const userName = getNameFromEmail(auth.currentUser?.email || '');
  const [showEditModal, setShowEditModal] = useState(false);

  // Current user's existing vote
  const userVote = idea.votes?.[userName];
  const [isEditingVote, setIsEditingVote] = useState(userVote === null);
  const [tempVote, setTempVote] = useState(
    userVote !== null && userVote !== undefined ? userVote : ''
  );

  const handleSaveVoteClick = () => {
    const parsed = parseFloat(tempVote);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onSaveVote(idea.id, userName, parsed);
      setIsEditingVote(false);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

        {/* Voting Section for Current User */}
        <div style={{ marginTop: '1rem' }}>
          {isEditingVote ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label>Your Vote:</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={tempVote}
                onChange={(e) => setTempVote(e.target.value)}
                style={{ width: '70px' }}
              />
              <button onClick={handleSaveVoteClick} className="btn-primary">
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p>Your Vote: {userVote}</p>
              <button
                onClick={() => setIsEditingVote(true)}
                className="edit-btn"
                aria-label="Edit your vote"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="idea-card-footer">
          <div className="creator-tag">Creator: {idea.creator}</div>
          {idea.rank !== null && (
            <div style={{ fontWeight: 'bold' }}>Final Rank: {idea.rank}</div>
          )}
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
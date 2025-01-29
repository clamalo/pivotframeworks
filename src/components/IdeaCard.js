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
  const [showEditModal, setShowEditModal] = useState(false);
  const [voteValue, setVoteValue] = useState('');
  const [isEditingVote, setIsEditingVote] = useState(false);

  const userName = getNameFromEmail(auth.currentUser?.email || '');
  const userVote = idea.votes?.[userName];

  // Get the count of votes cast
  const votesCount = idea.votes ? Object.values(idea.votes).filter(vote => vote !== null && vote !== undefined).length : 0;

  const handleSaveVote = () => {
    const vote = parseFloat(voteValue);
    if (!isNaN(vote) && vote >= 0 && vote <= 10) {
      onSaveVote(idea.id, userName, vote);
      setIsEditingVote(false);
    }
  };

  const handleEditVote = () => {
    setVoteValue(userVote?.toString() || '');
    setIsEditingVote(true);
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

        <div className="idea-card-footer">
          <div className="creator-tag">Creator: {idea.creator}</div>
          
          {/* Voting Section */}
          <div className="voting-section">
            {userVote && !isEditingVote ? (
              <div className="vote-display">
                <span>Your Vote: {userVote}</span>
                <button
                  onClick={handleEditVote}
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
            ) : (
              <div className="vote-input-group">
                <label>Your Vote (0-10):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={voteValue}
                  onChange={(e) => setVoteValue(e.target.value)}
                  className="vote-input"
                />
                <button
                  onClick={handleSaveVote}
                  className="btn btn-primary"
                  disabled={!voteValue || isNaN(parseFloat(voteValue))}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Vote Count Display */}
          {idea.rank === null && (
            <div className="vote-count">
              {votesCount}/3 votes cast
            </div>
          )}

          {idea.rank !== null && (
            <div className="rank-display">
              <strong>Final Rank: {idea.rank.toFixed(1)}</strong>
            </div>
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
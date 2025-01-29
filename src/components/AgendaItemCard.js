import React, { useState } from 'react';
import EditAgendaItemModal from './EditAgendaItemModal';

function AgendaItemCard({ item, onDelete, onEdit }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="action-item-card">
      <div className="action-item-header">
        <h4>{item.title}</h4>
        <div className="card-buttons">
          <button
            onClick={() => setShowEditModal(true)}
            className="edit-btn"
            aria-label="Edit agenda item"
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
            onClick={() => onDelete(item.id)}
            className="delete-btn"
            aria-label="Delete agenda item"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <p>{item.notes}</p>

      <div className="card-footer">
        <div className="creator-tag">Added by: {item.createdBy}</div>
      </div>

      {showEditModal && (
        <EditAgendaItemModal
          item={item}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedItem) => {
            onEdit(item.id, updatedItem);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

export default AgendaItemCard; 

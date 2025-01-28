// File: /src/components/ActionItemCard.js

import React, { useState } from 'react';
import AddActionItemModal from './AddActionItemModal';

function ActionItemCard({
  task,
  subtasks,
  onDelete,
  onEdit,
  onAddSubtask,
  refresh,
  depth = 0
}) {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedNotes, setEditedNotes] = useState(task.notes);
  const [editedDate, setEditedDate] = useState(task.completionDate || '');
  const [editedTimeEstimate, setEditedTimeEstimate] = useState(task.timeEstimate || '');
  const [editedAssignedTo, setEditedAssignedTo] = useState(task.assignedTo);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, {
      name: editedName,
      notes: editedNotes,
      completionDate: editedDate,
      timeEstimate: editedTimeEstimate,
      assignedTo: editedAssignedTo
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedName(task.name);
    setEditedNotes(task.notes);
    setEditedDate(task.completionDate || '');
    setEditedTimeEstimate(task.timeEstimate || '');
    setEditedAssignedTo(task.assignedTo);
  };

  return (
    <div className={`action-item-card depth-${depth}`}>
      {editing ? (
        <div className="edit-fields">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
          />
          <label>Time Estimate: </label>
          <input
            type="text"
            value={editedTimeEstimate}
            onChange={(e) => setEditedTimeEstimate(e.target.value)}
            placeholder="e.g. 2 hours, 3 days"
          />
          <label>Completion Date: </label>
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
          />
          <label>Assigned To: </label>
          <div className="action-items-dropdown">
            <select
              value={editedAssignedTo}
              onChange={(e) => setEditedAssignedTo(e.target.value)}
            >
              <option value="Open Task">Open Task</option>
              <option value="Finn">Finn</option>
              <option value="Clay">Clay</option>
              <option value="Ryder">Ryder</option>
            </select>
          </div>

          <div className="card-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h4>{task.name}</h4>
          {task.notes && <p>{task.notes}</p>}
          {task.timeEstimate && (
            <p>
              <strong>Time Estimate:</strong> {task.timeEstimate}
            </p>
          )}
          <p>
            <strong>Completion Date:</strong> {task.completionDate || '(none)'}
          </p>
          <p>
            <strong>Assigned To:</strong> {task.assignedTo || 'Open Task'}
          </p>

          <div className="card-buttons">
            <button
              onClick={handleEdit}
              className="edit-btn"
              aria-label="Edit action item"
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
              onClick={() => onDelete(task.id)}
              className="delete-btn"
              aria-label="Delete action item"
            >
              ×
            </button>
            <button
              onClick={() => onAddSubtask(task)}
              className="edit-btn"
              aria-label="Add subtask"
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          {subtasks && subtasks.length > 0 && (
            <div className="subtasks">
              {subtasks.map(childTask => (
                <ActionItemCard
                  key={childTask.id}
                  task={childTask}
                  subtasks={childTask.children || []}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onAddSubtask={onAddSubtask}
                  refresh={refresh}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ActionItemCard;
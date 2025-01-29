import React, { useState, useEffect } from 'react';
import {
  auth,
  signOut,
  db,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot
} from '../firebase';
import { useNavigate } from 'react-router-dom';
import AddAgendaItemModal from '../components/AddAgendaItemModal';
import AgendaItemCard from '../components/AgendaItemCard';

function MeetingAgenda({ isNavOpen, setIsNavOpen }) {
  const [agendaItems, setAgendaItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Meeting Agenda - Pivot Frameworks';
  }, []);

  // Real-time listener for agenda items
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'agendaItems'), (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation time, newest first
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAgendaItems(items);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'agendaItems', id));
    } catch (error) {
      console.error('Error deleting agenda item:', error);
    }
  };

  const handleEdit = async (id, updatedItem) => {
    try {
      await setDoc(doc(db, 'agendaItems', id), updatedItem, { merge: true });
    } catch (error) {
      console.error('Error editing agenda item:', error);
    }
  };

  return (
    <div className="action-items-container">
      <div className="top-bar">
        <button
          className={`hamburger-btn ${isNavOpen ? 'active' : ''}`}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2>Meeting Agenda</h2>
        <button onClick={handleSignOut}>Logout</button>
      </div>

      <div className="master-container">
        <div className="actions-header">
          <div className="actions-controls">
            <h3>Agenda Items</h3>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              Add Item
            </button>
          </div>

          <div className="action-items-list">
            {agendaItems.map((item) => (
              <AgendaItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddAgendaItemModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {}}
        />
      )}
    </div>
  );
}

export default MeetingAgenda; 
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
import AddIdeaModal from '../components/AddIdeaModal';
import IdeaCard from '../components/IdeaCard';

function IdeaSpace({ isNavOpen, setIsNavOpen }) {
  const [unrankedIdeas, setUnrankedIdeas] = useState([]);
  const [rankedIdeas, setRankedIdeas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'ideas'), (snapshot) => {
      const allIdeas = [];
      snapshot.forEach((docItem) => {
        allIdeas.push({ id: docItem.id, ...docItem.data() });
      });

      // Separate ideas by whether rank is set
      const unranked = allIdeas.filter(
        (idea) => idea.rank === null || idea.rank === undefined
      );
      const ranked = allIdeas.filter(
        (idea) => idea.rank !== null && idea.rank !== undefined
      );
      // Sort ranked (descending)
      ranked.sort((a, b) => b.rank - a.rank);

      setUnrankedIdeas(unranked);
      setRankedIdeas(ranked);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.title = 'Ideas - Pivot Frameworks';
  }, []);

  const fetchIdeas = async () => {
    const snapshot = await getDocs(collection(db, 'ideas'));
    const allIdeas = [];
    snapshot.forEach((docItem) => {
      allIdeas.push({ id: docItem.id, ...docItem.data() });
    });
    const unranked = allIdeas.filter(
      (idea) => idea.rank === null || idea.rank === undefined
    );
    const ranked = allIdeas.filter(
      (idea) => idea.rank !== null && idea.rank !== undefined
    );
    ranked.sort((a, b) => b.rank - a.rank);

    setUnrankedIdeas(unranked);
    setRankedIdeas(ranked);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'ideas', id));
      fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  // Merge existing doc with the updated fields so we don't lose 'votes'
  const handleEdit = async (updatedIdea) => {
    try {
      await setDoc(doc(db, 'ideas', updatedIdea.id), updatedIdea, { merge: true });
      fetchIdeas();
    } catch (error) {
      console.error('Error editing idea:', error);
    }
  };

  /**
   * Handle a user's vote: set the user's vote in the idea's "votes" object.
   * If all three votes are present, compute the average and store in "rank".
   * Otherwise, keep "rank" as null.
   */
  const handleSaveVote = async (ideaId, userName, voteValue) => {
    const docRef = doc(db, 'ideas', ideaId);

    // Find the idea in our current state
    let currentIdea =
      unrankedIdeas.find((i) => i.id === ideaId) ||
      rankedIdeas.find((i) => i.id === ideaId);

    if (!currentIdea) return;

    const updatedVotes = {
      ...currentIdea.votes,
      [userName]: voteValue
    };

    // Check if all three users have voted
    const { Clay, Finn, Ryder } = updatedVotes;
    const allVoted =
      Clay !== null && Clay !== undefined &&
      Finn !== null && Finn !== undefined &&
      Ryder !== null && Ryder !== undefined;

    let newRank = null;
    if (allVoted) {
      const avg = (Clay + Finn + Ryder) / 3;
      newRank = parseFloat(avg.toFixed(1));
    }

    try {
      await setDoc(
        docRef,
        {
          votes: updatedVotes,
          rank: newRank
        },
        { merge: true }
      );
      fetchIdeas();
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };

  return (
    <div className="idea-space-container">
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
        <h2>Idea Space</h2>
        <button onClick={handleSignOut}>Logout</button>
      </div>

      <div className="tabs">
        <div className="tab-section">
          <h3>Unranked Ideas</h3>
          <button onClick={() => setShowAddModal(true)}>Add Idea</button>
          <div className="ideas-list" style={{ marginTop: '1rem' }}>
            {unrankedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSaveVote={handleSaveVote}
              />
            ))}
          </div>
        </div>

        <div className="tab-section">
          <h3>Ranked Ideas</h3>
          <div className="ideas-list" style={{ marginTop: '1rem' }}>
            {rankedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSaveVote={handleSaveVote}
              />
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddIdeaModal
          onClose={() => setShowAddModal(false)}
          onIdeaAdded={fetchIdeas}
        />
      )}
    </div>
  );
}

export default IdeaSpace;
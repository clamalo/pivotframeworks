import React, { useState, useEffect } from 'react';
import { auth, signOut, db, collection, getDocs, setDoc, doc, deleteDoc, onSnapshot } from '../firebase';
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

      const unranked = allIdeas.filter((idea) => idea.rank === null || idea.rank === undefined);
      const ranked = allIdeas.filter((idea) => idea.rank !== null && idea.rank !== undefined);
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
    const unranked = allIdeas.filter((idea) => idea.rank === null || idea.rank === undefined);
    const ranked = allIdeas.filter((idea) => idea.rank !== null && idea.rank !== undefined);
    ranked.sort((a, b) => b.rank - a.rank);

    setUnrankedIdeas(unranked);
    setRankedIdeas(ranked);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleMoveToRanked = async () => {
    const validRanked = unrankedIdeas.filter(
      (idea) => idea.tempRank !== undefined && idea.tempRank !== null && idea.tempRank !== ''
    );
    for (let item of validRanked) {
      const rankNum = parseFloat(item.tempRank);
      if (!isNaN(rankNum) && rankNum >= 0 && rankNum <= 10) {
        await setDoc(doc(db, 'ideas', item.id), {
          ...item,
          rank: rankNum
        });
      }
    }
    fetchIdeas();
  };

  const handleRankChange = async (id, newRank) => {
    const rankNum = parseFloat(newRank);
    if (!isNaN(rankNum)) {
      await setDoc(doc(db, 'ideas', id), { rank: rankNum }, { merge: true });
      fetchIdeas();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'ideas', id));
      fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEdit = async (updatedIdea) => {
    try {
      await setDoc(doc(db, 'ideas', updatedIdea.id), updatedIdea);
      fetchIdeas();
    } catch (error) {
      console.error('Error editing idea:', error);
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
          <button onClick={handleMoveToRanked} style={{ float: 'right' }}>
            Move
          </button>
          <div className="ideas-list">
            {unrankedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isUnranked
                onRankInput={(val) => {
                  idea.tempRank = val;
                }}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>

        <div className="tab-section">
          <h3>Ranked Ideas</h3>
          <div className="ideas-list">
            {rankedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isUnranked={false}
                onRankChange={handleRankChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
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
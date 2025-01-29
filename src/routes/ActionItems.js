// File: /src/routes/ActionItems.js

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
import AddActionItemModal from '../components/AddActionItemModal';
import ActionItemCard from '../components/ActionItemCard';
import { getNameFromEmail } from '../utils/userUtils';

function ActionItems({ isNavOpen, setIsNavOpen }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Open Tasks');
  const [tasks, setTasks] = useState([]);
  const [isOpenTasksCollapsed, setIsOpenTasksCollapsed] = useState(true);
  const [defaultAssignee, setDefaultAssignee] = useState(null);

  const navigate = useNavigate();

  // Set default filter based on logged in user
  useEffect(() => {
    if (auth.currentUser) {
      const defaultFilter = getNameFromEmail(auth.currentUser.email);
      setSelectedFilter(defaultFilter);
    }
  }, []);

  /**
   * Real-time listener to fetch all actionItems from Firestore.
   */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'actionItems'), (snapshot) => {
      const all = [];
      snapshot.forEach((docItem) => {
        all.push({ id: docItem.id, ...docItem.data() });
      });
      setTasks(all);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Manually refetch tasks if needed.
   */
  const fetchTasks = async () => {
    const snap = await getDocs(collection(db, 'actionItems'));
    const all = [];
    snap.forEach((docItem) => {
      all.push({ id: docItem.id, ...docItem.data() });
    });
    setTasks(all);
  };

  /**
   * Build a tree of tasks (unlimited nesting),
   * then sort them by urgency descending (3 highest → 1 lowest).
   */
  function buildFullTree(allTasks) {
    // Create a map of all tasks with their children arrays
    const taskMap = new Map();
    allTasks.forEach((task) => {
      taskMap.set(task.id, { ...task, children: [] });
    });

    // Build parent-child relationships
    const roots = [];
    allTasks.forEach((task) => {
      const mappedTask = taskMap.get(task.id);
      if (task.parentId && taskMap.has(task.parentId)) {
        // Add this task to the parent's children
        const parent = taskMap.get(task.parentId);
        parent.children.push(mappedTask);
      } else if (!task.parentId) {
        // Top-level task
        roots.push(mappedTask);
      }
    });

    // Recursively sort children by urgency descending
    function sortChildren(task) {
      if (task.children && task.children.length > 0) {
        // Sort immediate children by urgency descending, defaulting to 1
        task.children.sort(
          (a, b) => (b.urgency || 1) - (a.urgency || 1)
        );
        task.children.forEach(sortChildren);
      }
    }

    // Sort top-level tasks by urgency descending
    roots.sort((a, b) => (b.urgency || 1) - (a.urgency || 1));
    roots.forEach(sortChildren);

    return roots;
  }

  const fullTree = buildFullTree(tasks);

  // Separate open tasks (assignedTo="Open Task") from user tasks
  const openTasks = fullTree.filter((root) => root.assignedTo === 'Open Task');
  const userTasks = fullTree.filter((root) => {
    if (selectedFilter === 'Open Tasks') {
      return false;
    }
    return root.assignedTo === selectedFilter;
  });

  /**
   * CRUD operations + sign out
   */
  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDelete = async (id) => {
    function gatherDescendants(taskId) {
      const directChildren = tasks.filter((t) => t.parentId === taskId);
      let allIds = [taskId];
      directChildren.forEach((child) => {
        allIds = [...allIds, ...gatherDescendants(child.id)];
      });
      return allIds;
    }
    const idsToDelete = gatherDescendants(id);
    for (const childId of idsToDelete) {
      await deleteDoc(doc(db, 'actionItems', childId));
    }
    fetchTasks();
  };

  const handleEdit = async (id, updated) => {
    await setDoc(doc(db, 'actionItems', id), updated, { merge: true });
    fetchTasks();
  };

  const handleAddSubtask = (parentTask) => {
    setSelectedParentTask(parentTask);
    setShowSubtaskModal(true);
  };

  const handleAddItemClick = (assignee) => {
    setDefaultAssignee(assignee);
    setShowAddModal(true);
  };

  useEffect(() => {
    document.title = 'Action Items - Pivot Frameworks';
  }, []);

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
        <h2>Action Items</h2>
        <button onClick={handleSignOut}>Logout</button>
      </div>

      <div className="actions-content">
        {/* Open Tasks Master Container */}
        <div className="master-container">
          <h2>Open Tasks</h2>
          <div className="actions-header">
            <div className="actions-controls">
              <div
                className="section-title"
                onClick={() => setIsOpenTasksCollapsed(!isOpenTasksCollapsed)}
              >
                <button className="collapse-btn">
                  {isOpenTasksCollapsed ? '▶' : '▼'}
                </button>
                <h3>
                  Unassigned Items{' '}
                  {isOpenTasksCollapsed && `(${openTasks.length})`}
                </h3>
              </div>
              <button
                onClick={() => handleAddItemClick('Open Task')}
                className="btn-primary"
              >
                Add Item
              </button>
            </div>

            {!isOpenTasksCollapsed && (
              <div className="action-items-list">
                {openTasks.map((root) => (
                  <ActionItemCard
                    key={root.id}
                    task={root}
                    subtasks={root.children || []}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onAddSubtask={handleAddSubtask}
                    refresh={fetchTasks}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personal Tasks Master Container */}
        <div className="master-container">
          <h2>Personal Tasks</h2>
          <div className="actions-header">
            <div className="actions-controls">
              <div className="action-items-dropdown">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="Finn">Finn</option>
                  <option value="Clay">Clay</option>
                  <option value="Ryder">Ryder</option>
                  {/* It's possible the user might set to "Open Tasks" also,
                      but typically we do that above */}
                  <option value="Open Tasks">Open Tasks</option>
                </select>
              </div>
              <button
                onClick={() => handleAddItemClick(selectedFilter)}
                className="btn-primary"
              >
                Add Item
              </button>
            </div>

            <div className="action-items-list">
              {userTasks.map((root) => (
                <ActionItemCard
                  key={root.id}
                  task={root}
                  subtasks={root.children || []}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onAddSubtask={handleAddSubtask}
                  refresh={fetchTasks}
                  depth={0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddActionItemModal
          onClose={() => {
            setShowAddModal(false);
            setDefaultAssignee(null);
          }}
          onAdded={fetchTasks}
          defaultAssignee={defaultAssignee}
        />
      )}

      {showSubtaskModal && selectedParentTask && (
        <AddActionItemModal
          onClose={() => setShowSubtaskModal(false)}
          onAdded={fetchTasks}
          parentId={selectedParentTask.id}
          parentAssignedTo={selectedParentTask.assignedTo}
        />
      )}
    </div>
  );
}

export default ActionItems;
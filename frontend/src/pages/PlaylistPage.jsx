import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Edit3, 
  Trash2, 
  Calendar,
  User,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import Navbar from "../components/Navbar";

function PlaylistPage() {
  const { id } = useParams();
  const { getPlaylistDetails, currentPlaylist, deletePlaylist, isLoading } = usePlaylistStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      getPlaylistDetails(id);
    }
  }, [id, getPlaylistDetails]);

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(id);
      setShowDeleteConfirm(false);
      // Redirect to profile or home page after deletion
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Playlist not found</h2>
            <Link to="/profile" className="btn btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/profile" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{currentPlaylist.name}</h1>
            <p className="text-base-content/70 mt-1">
              {currentPlaylist.description || "No description"}
            </p>
          </div>
        </div>

        {/* Playlist Stats */}
        <div className="stats shadow mb-6 bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Problems</div>
            <div className="stat-value text-primary">
              {currentPlaylist.problems?.length || 0}
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Created</div>
            <div className="stat-value text-secondary text-lg">
              {new Date(currentPlaylist.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-accent">
              <User className="w-8 h-8" />
            </div>
            <div className="stat-title">Created By</div>
            <div className="stat-value text-accent text-lg">You</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="btn btn-primary">
            <Edit3 className="w-4 h-4" />
            Edit Playlist
          </button>
          <button 
            className="btn btn-error"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Playlist
          </button>
        </div>

        {/* Problems List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Problems in this Playlist</h2>
            
            {currentPlaylist.problems?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlaylist.problems.map((problemRelation, index) => {
                      const problem = problemRelation.problem;
                      return (
                        <tr key={problem.id}>
                          <td>{index + 1}</td>
                          <td>
                            <Link 
                              to={`/problem/${problem.id}`}
                              className="link link-primary font-semibold hover:link-hover"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td>
                            <div className={`badge ${
                              problem.difficulty === 'EASY' ? 'badge-success' :
                              problem.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-error'
                            }`}>
                              {problem.difficulty}
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-1 flex-wrap">
                              {problem.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="badge badge-outline badge-xs">
                                  {tag}
                                </span>
                              ))}
                              {problem.tags?.length > 2 && (
                                <span className="badge badge-outline badge-xs">
                                  +{problem.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {problem.solvedBy?.length > 0 ? (
                              <div className="badge badge-success gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Solved
                              </div>
                            ) : (
                              <div className="badge badge-ghost">Not Solved</div>
                            )}
                          </td>
                          <td>
                            <Link 
                              to={`/problem/${problem.id}`}
                              className="btn btn-sm btn-ghost"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/60 mb-4">No problems in this playlist yet</p>
                <Link to="/" className="btn btn-primary">
                  Browse Problems
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete the playlist "{currentPlaylist.name}"? 
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error" 
                onClick={handleDeletePlaylist}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;
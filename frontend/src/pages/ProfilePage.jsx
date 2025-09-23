import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  BookOpen, 
  Code2, 
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import CreatePlaylistModel from "../components/CreatePlaylistModel";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const { authUser } = useAuthStore();
  const { getAllSolvedProblemsByUser, solvedProblems, isLoading: isProblemsLoading } = useProblemStore();
  const { getAllPlaylists, playlists, deletePlaylist, isLoading: isPlaylistsLoading } = usePlaylistStore();
  const { getAllSubmissionsForUser, submissions, isLoading: isSubmissionsLoading } = useSubmissionStore();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  useEffect(() => {
    if (authUser) {
      getAllSolvedProblemsByUser();
      getAllPlaylists();
      getAllSubmissionsForUser();
    }
  }, [authUser, getAllSolvedProblemsByUser, getAllPlaylists, getAllSubmissionsForUser]);

  const stats = {
    totalSolved: solvedProblems?.length || 0,
    totalSubmissions: submissions?.length || 0,
    totalPlaylists: playlists?.length || 0,
    successRate: submissions?.length > 0 
      ? Math.round((solvedProblems?.length / submissions?.length) * 100) 
      : 0,
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      await deletePlaylist(playlistId);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="h-full w-full overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stats Cards */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="stats shadow bg-base-200">
                    <div className="stat">
                      <div className="stat-figure text-success">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="stat-title">Problems Solved</div>
                      <div className="stat-value text-success text-2xl">{stats.totalSolved}</div>
                    </div>
                  </div>

                  <div className="stats shadow bg-base-200">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <div className="stat-title">Total Submissions</div>
                      <div className="stat-value text-primary text-2xl">{stats.totalSubmissions}</div>
                    </div>
                  </div>

                  <div className="stats shadow bg-base-200">
                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="stat-title">Playlists Created</div>
                      <div className="stat-value text-secondary text-2xl">{stats.totalPlaylists}</div>
                    </div>
                  </div>

                  <div className="stats shadow bg-base-200">
                    <div className="stat">
                      <div className="stat-figure text-accent">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="stat-title">Success Rate</div>
                      <div className="stat-value text-accent text-2xl">{stats.successRate}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="h-full">
                <h3 className="text-xl font-bold mb-4">Recent Submissions</h3>
                <div className="card bg-base-200 shadow-xl h-80">
                  <div className="card-body">
                    {isSubmissionsLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <span className="loading loading-spinner"></span>
                      </div>
                    ) : submissions?.length > 0 ? (
                      <div className="space-y-3 overflow-auto">
                        {submissions.slice(0, 5).map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                            <div>
                              <p className="font-semibold">Problem #{submission.problemId.slice(0, 8)}</p>
                              <p className="text-sm text-base-content/60">
                                {new Date(submission.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`badge ${submission.status === 'ACCEPTED' ? 'badge-success' : 'badge-error'}`}>
                              {submission.status || 'Pending'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center text-base-content/60">No submissions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "problems":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 flex-shrink-0">
              <h3 className="text-xl font-bold">Solved Problems ({stats.totalSolved})</h3>
            </div>
            
            <div className="flex-1 overflow-auto">
              {isProblemsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : solvedProblems?.length > 0 ? (
                <div className="overflow-x-auto h-full">
                  <table className="table table-zebra w-full">
                    <thead className="sticky top-0 bg-base-100">
                      <tr>
                        <th className="min-w-[200px]">Title</th>
                        <th className="min-w-[100px]">Difficulty</th>
                        <th className="min-w-[120px] hidden sm:table-cell">Tags</th>
                        <th className="min-w-[120px] hidden md:table-cell">Solved Date</th>
                        <th className="min-w-[80px]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solvedProblems.map((problem) => (
                        <tr key={problem.id}>
                          <td>
                            <div className="font-semibold">
                              <Link to={`/problem/${problem.id}`} className="link link-primary hover:link-hover">
                                {problem.title}
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className={`badge badge-sm ${
                              problem.difficulty === 'EASY' ? 'badge-success' :
                              problem.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-error'
                            }`}>
                              {problem.difficulty}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell">
                            <div className="flex gap-1 flex-wrap">
                              {problem.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="badge badge-outline badge-xs">{tag}</span>
                              ))}
                              {problem.tags?.length > 2 && (
                                <span className="badge badge-outline badge-xs">+{problem.tags.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="hidden md:table-cell text-sm">
                            {problem.solvedBy?.[0]?.createdAt ? 
                              new Date(problem.solvedBy[0].createdAt).toLocaleDateString() : 
                              'Unknown'
                            }
                          </td>
                          <td>
                            <Link to={`/problem/${problem.id}`} className="btn btn-sm btn-ghost">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                  <p className="text-base-content/60 mb-4">No problems solved yet. Start coding!</p>
                  <Link to="/" className="btn btn-primary">Browse Problems</Link>
                </div>
              )}
            </div>
          </div>
        );

      case "playlists":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 flex-shrink-0">
              <h3 className="text-xl font-bold">My Playlists ({stats.totalPlaylists})</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreatePlaylist(true)}
              >
                <Plus className="w-4 h-4" />
                Create Playlist
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {isPlaylistsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : playlists?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-fit">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="card bg-base-200 shadow-xl h-fit">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{playlist.name}</h4>
                        <p className="text-base-content/70 text-sm line-clamp-2 flex-grow">
                          {playlist.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mt-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{playlist.problems?.length || 0} problems</span>
                        </div>
                        <div className="card-actions justify-end mt-4 gap-2">
                          <Link to={`/playlist/${playlist.id}`} className="btn btn-sm btn-ghost" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="btn btn-sm btn-ghost" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                  <p className="text-base-content/60 mb-4">No playlists created yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreatePlaylist(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Playlist
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="avatar">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full">
                  <img 
                    src={authUser.image || "https://avatar.iran.liara.run/public/boy"} 
                    alt="Profile"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{authUser.name}</h1>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-sm md:text-base text-base-content/70">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{authUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(authUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="capitalize">{authUser.role.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card bg-base-100 shadow-xl" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="card-body p-0 h-full flex flex-col">
            {/* Tabs */}
            <div className="tabs tabs-bordered flex-shrink-0">
              <button 
                className={`tab gap-2 ${activeTab === "overview" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </button>
              <button 
                className={`tab gap-2 ${activeTab === "problems" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("problems")}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Solved Problems</span>
                <span className="sm:hidden">Problems</span>
              </button>
              <button 
                className={`tab gap-2 ${activeTab === "playlists" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("playlists")}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">My Playlists</span>
                <span className="sm:hidden">Playlists</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-6 w-full h-full">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <CreatePlaylistModel 
          isOpen={showCreatePlaylist}
          onClose={() => setShowCreatePlaylist(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
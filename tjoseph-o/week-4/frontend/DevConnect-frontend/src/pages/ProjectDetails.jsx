import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchComments();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data.data);
    } catch (error) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByProject(id);
      setComments(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await commentsAPI.create(id, newComment);
      setNewComment('');
      fetchComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete comment?')) return;
    try {
      await commentsAPI.delete(commentId);
      fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Project not found</h2><Link to="/projects" className="btn-primary">Back</Link></div></div>;
  }

  const isOwner = user && project.userId && user._id === project.userId._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card mb-8">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          {isOwner && <div className="flex gap-2"><button onClick={handleDeleteProject} className="p-2 text-red-600"><FaTrash size={20} /></button></div>}
        </div>
        <div className="flex items-center space-x-2 text-gray-600 mb-4"><FaUser /><span>By {project.userId ? project.userId.username : 'Unknown'}</span></div>
        <p className="text-gray-700 mb-6">{project.description}</p>
        <div className="mb-6"><div className="flex flex-wrap gap-2">{project.techStack.map((tech, i) => <span key={i} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">{tech}</span>)}</div></div>
      </div>
      <div className="card"><h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
        {isAuthenticated && <form onSubmit={handleAddComment} className="mb-8"><textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="input-field" rows={3} placeholder="Add comment..." maxLength={1000} /><button type="submit" disabled={!newComment.trim() || commentLoading} className="btn-primary mt-2">{commentLoading ? 'Posting...' : 'Post'}</button></form>}
        {!isAuthenticated && <div className="mb-8 p-4 bg-gray-50 rounded text-center"><Link to="/login" className="text-primary-600">Login</Link> to comment</div>}
        <div className="space-y-4">{comments.map((comment) => <div key={comment._id} className="border-b pb-4"><div className="flex justify-between mb-2"><div className="flex items-center space-x-2"><FaUser className="text-gray-400" /><span className="font-medium">{comment.userId ? comment.userId.username : 'Unknown'}</span></div>{user && comment.userId && user._id === comment.userId._id && <button onClick={() => handleDeleteComment(comment._id)} className="text-red-600"><FaTrash size={14} /></button>}</div><p className="ml-6">{comment.content}</p></div>)}</div>
      </div>
    </div>
  );
};

export default ProjectDetails;

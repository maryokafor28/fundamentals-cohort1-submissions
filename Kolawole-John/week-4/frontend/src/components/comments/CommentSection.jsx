import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';
import { useComments, useAddComment, useDeleteComment } from '../../hooks/useComments';
import { useGetMe } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatRelativeTime } from '../../utils/helpers';

export default function CommentSection({ projectId }) {
  const [page, setPage] = useState(1);
  const { data: user } = useGetMe();
  const { data: commentsData, isLoading } = useComments(projectId, page);
  const { mutate: addComment, isPending: isAdding } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    addComment(
      { projectId, content: data.content },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      deleteComment({ projectId, commentId });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const { comments, pagination } = commentsData;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({pagination.total})
        </h2>
      </div>

      {user && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <textarea
            {...register('content', {
              required: 'Comment cannot be empty',
              maxLength: { value: 1000, message: 'Comment too long' },
            })}
            rows={3}
            className="input-field mb-2"
            placeholder="Share your thoughts..."
          />
          {errors.content && (
            <p className="text-sm text-red-600 mb-2">{errors.content.message}</p>
          )}
          <button
            type="submit"
            disabled={isAdding}
            className="btn-primary flex items-center space-x-2"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{comment.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatRelativeTime(comment.createdAt)}
                  </p>
                </div>
                {user?._id === comment.author._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
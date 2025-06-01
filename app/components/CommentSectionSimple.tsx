import React, { useState, useEffect, useRef, FormEvent } from 'react'; // Added FormEvent
import { useAuthContext } from '../contexts/AuthContext';
import { useModalContext } from '../contexts/ModalContext';
import { commentService } from '../services/commentRatingService';
import { formatDistanceToNowStrict } from 'date-fns';
import { Comment as GlobalCommentType, User as GlobalUserType } from '../types'; // Import global types
import { FaThumbsUp, FaThumbsDown, FaReply, FaEdit, FaTrashAlt, FaExclamationTriangle, FaSpinner, FaPaperPlane, FaEllipsisV, FaUserShield, FaCheckCircle } from 'react-icons/fa'; // Added FaUserShield, FaCheckCircle
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

// Local comment type for this component, extending or aligning with global one
interface Comment extends GlobalCommentType {
  // is_spoiler is already in GlobalCommentType
  // Ensure all fields used in this component are present
}

interface CommentSectionSimpleProps {
  novelSlug: string;
  chapterId?: number;
  novelId?: number;
  className?: string;
}

const CommentSectionSimple: React.FC<CommentSectionSimpleProps> = ({
  novelSlug,
  chapterId,
  novelId,
  className = '',
}) => {
  const { user } = useAuthContext();
  const { openAuthModal } = useModalContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [votingStates, setVotingStates] = useState<Record<number, boolean>>({});
  const [userVotes, setUserVotes] = useState<Record<number, { is_upvote: boolean } | null>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [actionsMenuOpenId, setActionsMenuOpenId] = useState<number | null>(null); // State for actions menu

  // Spoiler states
  const [newCommentIsSpoiler, setNewCommentIsSpoiler] = useState(false);
  const [replyIsSpoiler, setReplyIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

  // Helper function to transform API comment structure to local comment structure
  const mapApiCommentToLocal = (apiComment: any): Comment => {
    const mappedUser: GlobalUserType = {
      id: apiComment.user?.id || 0,
      name: apiComment.user?.name || 'Anonymous',
      avatar: apiComment.user?.avatar,
      is_admin: apiComment.user?.is_admin || false,
      email_verified: !!apiComment.user?.email_verified_at, // Check for presence of email_verified_at
    };

    return {
      id: apiComment.id,
      user_id: apiComment.user_id || apiComment.user?.id,
      novel_id: apiComment.novel_id,
      chapter_id: apiComment.chapter_id,
      parent_id: apiComment.parent_id,
      content: apiComment.content,
      likes: apiComment.likes ?? 0,
      dislikes: apiComment.dislikes ?? 0,
      is_spoiler: apiComment.is_spoiler || false, // Map is_spoiler, default to false
      is_approved: apiComment.is_approved === undefined ? true : apiComment.is_approved,
      created_at: apiComment.created_at || new Date().toISOString(),
      updated_at: apiComment.updated_at || new Date().toISOString(),
      user: mappedUser,
      replies: apiComment.replies ? apiComment.replies.map(mapApiCommentToLocal) : [],
      userVote: apiComment.user_vote || apiComment.userVote,
    };
  };

  useEffect(() => {
    // When novelSlug or chapterId changes, reset the comment section state
    // This ensures that for a new novel/chapter, comments are hidden and must be explicitly loaded.
    setCommentsVisible(false);
    setComments([]);
    setTotalCommentsCount(0);
    setUserVotes({}); // Reset votes specific to the previous comment set
    setLoading(false); // Reset loading state, as comments are not being loaded automatically
    setRevealedSpoilers(new Set()); // Reset revealed spoilers on navigation
  }, [novelSlug, chapterId]);

  // Effect to focus reply textarea
  useEffect(() => {
    if (replyingTo !== null && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [replyingTo]);

  // Function to load comments
  const loadComments = async () => {
    if (!novelSlug) {
      console.warn("CommentSectionSimple: Attempted to load comments without a valid novelSlug. Aborting.");
      setComments([]);
      setTotalCommentsCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let response;
      if (chapterId) {
        response = await commentService.getChapterComments(novelSlug, chapterId);
      } else {
        response = await commentService.getNovelComments(novelSlug);
      }
      if (response && response.comments && response.comments.data) {
        const localComments = response.comments.data.map(mapApiCommentToLocal);
        setComments(localComments);
        setTotalCommentsCount(response.total_comments_count || 0);
        if (localComments.length > 0) {
          loadUserVotes(localComments);
        }
      } else {
        setComments([]);
        setTotalCommentsCount(0);
      }
    } catch (err: any) {
      console.error("Failed to load comments:", err);
      // Clear comments and count on error to prevent stale data display
      setComments([]);
      setTotalCommentsCount(0);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
      } else if (err.request) {
        console.error('Error request:', err.request);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllCommentIds = (commentsToProcess: Comment[]): number[] => {
    const ids: number[] = [];
    commentsToProcess.forEach(comment => {
      ids.push(comment.id);
      if (comment.replies && comment.replies.length > 0) {
        ids.push(...getAllCommentIds(comment.replies));
      }
    });
    return ids;
  };

  const loadUserVotes = async (commentsToLoadVotesFor: Comment[]) => {
    try {
      const commentIds = getAllCommentIds(commentsToLoadVotesFor);
      if (commentIds.length === 0) {
        setUserVotes({});
        return;
      }
      const votePromises = commentIds.map(async (id) => {
        try {
          const response = await commentService.getUserVote(id);
          return { id, vote: response.data?.vote || null };
        } catch (error) {
          console.error(`Failed to load vote for comment ${id}:`, error); // Corrected template literal
          return { id, vote: null };
        }
      });
      const voteResults = await Promise.all(votePromises);
      const voteMap: Record<number, { is_upvote: boolean } | null> = {};
      voteResults.forEach(({ id, vote }) => {
        voteMap[id] = vote;
      });
      setUserVotes(voteMap);
    } catch (error) {
      console.error('Failed to load user votes:', error);
    }
  };

  const handleSubmitComment = async (e: FormEvent) => { // Added FormEvent type
    e.preventDefault();
    if (!user) {
      openAuthModal('signin');
      return;
    }
    if (!newComment.trim() || !novelId) {
      console.error('Novel ID and comment content are required.');
      return;
    }
    setSubmitting(true);
    try {
      await commentService.createComment({
        novel_id: novelId,
        chapter_id: chapterId,
        content: newComment.trim(),
        is_spoiler: newCommentIsSpoiler, // Include spoiler status
      });
      setNewComment('');
      setNewCommentIsSpoiler(false); // Reset spoiler toggle
      await loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: FormEvent, parentId: number) => { // Added FormEvent type
    e.preventDefault();
    if (!user) {
      openAuthModal('signin');
      return;
    }
    if (!replyContent.trim() || !novelId) {
      console.error('Novel ID and reply content are required.');
      return;
    }
    setSubmitting(true);
    try {
      await commentService.createComment({
        novel_id: novelId,
        chapter_id: chapterId,
        parent_id: parentId,
        content: replyContent.trim(),
        is_spoiler: replyIsSpoiler, // Include spoiler status
      });
      setReplyContent('');
      setReplyingTo(null);
      setReplyIsSpoiler(false); // Reset spoiler toggle
      await loadComments();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      await commentService.updateComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
      await loadComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleVoteComment = async (commentId: number, isUpvote: boolean) => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    // Prevent multiple votes while processing
    if (votingStates[commentId]) return;
    try {
      setVotingStates(prev => ({ ...prev, [commentId]: true }));
      const currentVote = userVotes[commentId];
      let newVoteState: { is_upvote: boolean } | null = null;
      let likesChange = 0;
      let dislikesChange = 0;
      // Determine the action and vote changes
      if (currentVote) {
        if (currentVote.is_upvote === isUpvote) {
          // Clicking the same button - remove vote
          newVoteState = null;
          likesChange = isUpvote ? -1 : 0;
          dislikesChange = !isUpvote ? -1 : 0;
        } else {
          // Clicking opposite button - change vote
          newVoteState = { is_upvote: isUpvote };
          likesChange = isUpvote ? 1 : -1;
          dislikesChange = !isUpvote ? 1 : -1;
        }
      } else {
        // No previous vote - add new vote
        newVoteState = { is_upvote: isUpvote };
        likesChange = isUpvote ? 1 : 0;
        dislikesChange = !isUpvote ? 1 : 0;
      }
      // Optimistically update UI
      setUserVotes(prev => ({ ...prev, [commentId]: newVoteState }));
      setComments(prevComments =>
        prevComments.map(comment =>
          updateCommentVotesOptimisticNew(comment, commentId, likesChange, dislikesChange)
        )
      );
      // Make API call
      const response = await commentService.voteComment(commentId, isUpvote);
      // Update with actual server response if available
      if (response.data) {
        const { likes, dislikes } = response.data;
        setComments(prevComments =>
          prevComments.map(comment =>
            updateCommentVotes(comment, commentId, likes, dislikes)
          )
        );
      }
    } catch (error) {
      console.error('Failed to vote on comment:', error);
      // Revert optimistic updates on error
      await loadComments();
    } finally {
      setVotingStates(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const updateCommentVotes = (comment: Comment, targetId: number, likes: number, dislikes: number): Comment => {
    if (comment.id === targetId) {
      return { ...comment, likes, dislikes };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(reply => updateCommentVotes(reply, targetId, likes, dislikes))
      };
    }
    return comment;
  };

  const updateCommentVotesOptimisticNew = (comment: Comment, targetId: number, likesChange: number, dislikesChange: number): Comment => {
    if (comment.id === targetId) {
      return {
        ...comment,
        likes: (comment.likes ?? 0) + likesChange,
        dislikes: (comment.dislikes ?? 0) + dislikesChange
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(reply => updateCommentVotesOptimisticNew(reply, targetId, likesChange, dislikesChange))
      };
    }
    return comment;
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const startReply = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyContent('');
    setReplyIsSpoiler(false); // Reset spoiler state for new reply
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const toggleExpandReplies = (commentId: number) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleActionsMenu = (commentId: number) => {
    setActionsMenuOpenId(prev => (prev === commentId ? null : commentId));
  };

  const renderComment = (comment: Comment, level = 0): React.ReactElement | null => {
    if (!comment || !comment.user) return null;

    const isOwner = user && (user.id === comment.user_id || (user.is_admin && comment.user.name === user.name));
    const maxLevel = 2; // Changed from 3 to 2 to hide reply button on 3rd nested comment (level 2)
    const indentClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : '';
    const currentUserVote = userVotes[comment.id];

    const isSpoiler = comment.is_spoiler;
    const isRevealed = revealedSpoilers.has(comment.id);

    return (
      <div key={comment.id} className={`comment-item bg-gray-850 p-3 rounded-lg shadow ${indentClass} ${level > 0 ? 'border-l-2 border-gray-700 mt-2' : ''}`}>
        <div className="flex items-start space-x-3">
          <img
            src={comment.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=random`}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-semibold ${
                comment.user.is_admin ? 'text-red-400' : (comment.user.email_verified ? 'text-blue-400' : 'text-gray-300')
              }`}>
                {comment.user.name}
              </span>
              {comment.user.is_admin && 
                <span className="text-red-500" title="Admin">
                  <FaUserShield />
                </span>
              }
              {comment.user.email_verified && !comment.user.is_admin && (
                <span className="text-blue-500" title="Verified">
                  <FaCheckCircle />
                </span>
              )}
              <span className="text-xs text-gray-500">
                · {formatDistanceToNowStrict(new Date(comment.created_at), { addSuffix: true })}
              </span>
              {comment.updated_at && comment.updated_at !== comment.created_at && (
                <span className="text-xs text-gray-500 ml-1">(edited)</span>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="space-y-2 mt-1">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button onClick={() => handleEditComment(comment.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin mr-1" /> : <FaEdit className="mr-1" />} Save
                  </button>
                  <button onClick={cancelEdit} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {isSpoiler && !isRevealed ? (
                  <div
                    className="p-3 my-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 text-center"
                    onClick={() => setRevealedSpoilers(prev => new Set(prev).add(comment.id))}
                  >
                    <p className="text-yellow-400 font-semibold text-sm flex items-center justify-center">
                      <FaExclamationTriangle className="inline mr-1.5" />
                      Spoiler - Click to reveal
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed mb-2">{comment.content}</p>
                )}

                {(!isSpoiler || isRevealed) && (
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                    <button
                      onClick={() => handleVoteComment(comment.id, true)}
                      disabled={!user || votingStates[comment.id]}
                      className={`flex items-center space-x-1 hover:text-green-400 ${currentUserVote?.is_upvote ? 'text-green-500' : ''}`}
                    >
                      <FaThumbsUp /> <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => handleVoteComment(comment.id, false)}
                      disabled={!user || votingStates[comment.id]}
                      className={`flex items-center space-x-1 hover:text-red-400 ${currentUserVote?.is_upvote === false ? 'text-red-500' : ''}`}
                    >
                      <FaThumbsDown /> <span>{comment.dislikes}</span>
                    </button>
                    {level < maxLevel && (
                      <button onClick={() => startReply(comment.id)} className="hover:text-blue-400 flex items-center space-x-1">
                        <FaReply /> <span>Reply</span>
                      </button>
                    )}
                    {isOwner && (
                      <div className="relative">
                        <button
                          onClick={() => toggleActionsMenu(comment.id)}
                          className="hover:text-gray-300 p-1 rounded-full"
                          aria-label="Comment actions"
                        >
                          <FaEllipsisV />
                        </button>
                        {actionsMenuOpenId === comment.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10 py-1">
                            <button
                              onClick={() => {
                                startEdit(comment);
                                setActionsMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-600 flex items-center space-x-2"
                            >
                              <FaEdit /> <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteComment(comment.id);
                                setActionsMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-600 flex items-center space-x-2"
                              disabled={submitting}
                            >
                              {submitting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />} <span className="ml-0.5">Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3 ml-10 pl-3 border-l-2 border-gray-700">
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="space-y-2">
              <textarea
                ref={replyTextareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Replying to ${comment.user.name}...`}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 text-sm"
                rows={2}
                disabled={submitting || !user}
              />
              <div className="mt-1 mb-1">
                <label className="flex items-center space-x-1.5 text-gray-400 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={replyIsSpoiler}
                    onChange={(e) => setReplyIsSpoiler(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                    disabled={!user}
                  />
                  <span>Mark as spoiler</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center" disabled={submitting || !replyContent.trim() || !user}>
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                </button>
                <button type="button" onClick={cancelReply} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className={`mt-3 space-y-2 ${level === 0 ? 'pl-10' : ''}`}>
            {!expandedReplies[comment.id] && comment.replies.length > 0 ? (
              <>
                {renderComment(comment.replies[0], level + 1)}
                {comment.replies.length > 1 && (
                  <button
                    onClick={() => toggleExpandReplies(comment.id)}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1 ml-3 flex items-center"
                  >
                    <BsEyeFill className="mr-1" /> View {comment.replies.length - 1} more replies
                  </button>
                )}
              </>
            ) : (
              <>
                {comment.replies.map((reply) => renderComment(reply, level + 1))}
                {comment.replies.length > 0 && expandedReplies[comment.id] && (
                    <button
                        onClick={() => toggleExpandReplies(comment.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-1 ml-3 flex items-center"
                    >
                        <BsEyeSlashFill className="mr-1" /> Hide replies
                    </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleLoadCommentsClick = async () => {
    setCommentsVisible(true);
    await loadComments();
  };

  return (
    <div className={`comment-section ${className} bg-gray-900 p-4 sm:p-6 rounded-lg`}>
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
        Comments {commentsVisible && totalCommentsCount > 0 ? `(${totalCommentsCount})` : ''}
      </h3>

      {!commentsVisible ? (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadCommentsClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <><FaSpinner className="animate-spin inline mr-2" /> Loading...</> : 'Load Comments'}
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="mb-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 ease-in-out text-sm"
                rows={3}
                disabled={!user || submitting}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <label className="flex items-center space-x-2 text-gray-300 cursor-pointer mb-2 sm:mb-0 text-sm">
                <input
                  type="checkbox"
                  checked={newCommentIsSpoiler}
                  onChange={(e) => setNewCommentIsSpoiler(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  disabled={!user}
                />
                <span>Mark as spoiler</span>
              </label>
              <div className="flex items-center space-x-2">
                {!user && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm transition duration-150 ease-in-out"
                  >
                    Login to Comment
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!user || !newComment.trim() || submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center text-sm transition duration-150 ease-in-out min-w-[100px]"
                >
                  {submitting ? <FaSpinner className="animate-spin mr-1" /> : <FaPaperPlane className="mr-1" />} Post Comment
                </button>
              </div>
            </div>
          </form>

          {loading && comments.length === 0 ? (
            <div className="text-center text-gray-400 py-4"><FaSpinner className="animate-spin inline mr-2" /> Loading comments...</div>
          ) : !loading && comments.length === 0 && commentsVisible ? (
            <div className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-3">
              {comments.filter(comment => !comment.parent_id).map((comment) => renderComment(comment))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSectionSimple;

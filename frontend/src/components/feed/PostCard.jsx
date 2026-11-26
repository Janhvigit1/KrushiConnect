import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Trash2,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  likePost,
  unlikePost,
  getComments,
  addComment,
  deleteComment
} from '../../services/postService';

const PostCard = ({ post, onDeletePost }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const isAuthor = user && post.author?._id?.toString() === user._id.toString();

  const handleLikeToggle = async () => {
    const prevLiked = hasLiked;
    const prevCount = likesCount;

    setHasLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    if (!prevLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }

    try {
      if (prevLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
    } catch (err) {
      setHasLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleDoubleTap = () => {
    if (!hasLiked) {
      handleLikeToggle();
    } else {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      try {
        setLoadingComments(true);
        const data = await getComments(post._id);
        setComments(data.comments || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await addComment(post._id, newComment.trim());
      setComments((prev) => [...prev, res.comment]);
      setCommentsCount((prev) => prev + 1);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentsCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffHours = Math.round((now - d) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="card"
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px -2px rgba(15, 81, 50, 0.05)'
      }}
    >
      {/* Instagram Header */}
      <div className="post-header">
        <div className="post-author-info">
          <Link to={`/profile/${post.author?._id}`}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                padding: '2px',
                background: 'linear-gradient(45deg, #F59E0B, #10B981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FFF' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    border: '1.5px solid #FFF'
                  }}
                >
                  {post.author?.name ? post.author.name[0].toUpperCase() : '🌾'}
                </div>
              )}
            </div>
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link to={`/profile/${post.author?._id}`} className="author-name">
                {post.author?.name}
              </Link>
              <CheckCircle2 size={14} color="#059669" fill="#DCFCE7" />
            </div>

            <div className="author-location">
              <MapPin size={11} color="#059669" />
              <span>
                {post.author?.village}, {post.author?.district} • {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {isAuthor ? (
            <button
              onClick={() => onDeletePost(post._id)}
              style={{ background: 'none', color: '#94A3B8', padding: '6px' }}
              title={t('feed.deletePost')}
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <button style={{ background: 'none', color: '#94A3B8', padding: '6px' }}>
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Post Images with Double-Tap Like Action */}
      {post.images && post.images.length > 0 && (
        <div
          style={{ position: 'relative', overflow: 'hidden' }}
          onDoubleClick={handleDoubleTap}
        >
          <div className={`post-images-grid grid-${post.images.length}`}>
            {post.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Update photo ${idx + 1}`}
                className="post-img"
              />
            ))}
          </div>

          {/* Heart burst animation on double tap */}
          {showHeartBurst && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                animation: 'popHeart 0.8s ease forwards'
              }}
            >
              <Heart size={84} fill="#E11D48" color="#E11D48" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }} />
            </div>
          )}
        </div>
      )}

      {/* Instagram Action Icons Bar */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button
            onClick={handleLikeToggle}
            className={`action-btn ${hasLiked ? 'liked' : ''}`}
            title={t('feed.like')}
          >
            <Heart size={24} fill={hasLiked ? '#E11D48' : 'none'} color={hasLiked ? '#E11D48' : '#334155'} />
          </button>

          <button onClick={handleToggleComments} className="action-btn" title={t('feed.comment')}>
            <MessageCircle size={23} color="#334155" />
          </button>

          <button className="action-btn" title="Share with fellow farmer">
            <Send size={22} color="#334155" />
          </button>
        </div>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className="action-btn"
          title="Save crop tip"
        >
          <Bookmark size={23} fill={isSaved ? '#0F5132' : 'none'} color={isSaved ? '#0F5132' : '#334155'} />
        </button>
      </div>

      {/* Likes Count Headline */}
      <div style={{ padding: '0 1.15rem 0.35rem 1.15rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </span>
      </div>

      {/* Post Text & Author Caption */}
      {post.text && (
        <div style={{ padding: '0 1.15rem 0.5rem 1.15rem', fontSize: '0.9rem', lineHeight: 1.55 }}>
          <span style={{ fontWeight: 800, color: 'var(--text-main)', marginRight: '6px' }}>
            {post.author?.name}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{post.text}</span>
        </div>
      )}

      {/* Crop Tags */}
      {post.author?.crops && post.author.crops.length > 0 && (
        <div style={{ padding: '0 1.15rem 0.75rem 1.15rem', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {post.author.crops.slice(0, 3).map((crop, i) => (
            <span key={i} className="crop-tag">
              🌱 {crop}
            </span>
          ))}
        </div>
      )}

      {/* Comments Teaser Link */}
      <div style={{ padding: '0 1.15rem 0.75rem 1.15rem' }}>
        <button
          onClick={handleToggleComments}
          style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}
        >
          {commentsCount > 0
            ? `View all ${commentsCount} comments`
            : 'Add a comment...'}
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            padding: '1rem 1.15rem',
            backgroundColor: 'var(--bg-surface-subtle)'
          }}
        >
          {loadingComments ? (
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
              {t('common.loading')}
            </div>
          ) : comments.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0' }}>
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#15803D',
                        flexShrink: 0
                      }}
                    >
                      {comment.author?.name ? comment.author.name[0].toUpperCase() : '🌾'}
                    </div>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', marginRight: '6px', color: 'var(--text-main)' }}>
                        {comment.author?.name}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {comment.text}
                      </span>
                    </div>
                  </div>

                  {user && comment.author?._id === user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      style={{ background: 'none', color: 'var(--text-muted)', padding: '2px' }}
                      title={t('feed.deleteComment')}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instagram Inline Quick Comment Input Bar */}
      <form
        onSubmit={handleAddComment}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.15rem',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} title="Add emoji">🌾</span>
        <input
          type="text"
          placeholder={t('feed.writeComment')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={300}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            background: 'transparent'
          }}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submittingComment}
          style={{
            background: 'none',
            color: newComment.trim() ? '#059669' : '#CBD5E1',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: newComment.trim() ? 'pointer' : 'default',
            padding: '4px 8px'
          }}
        >
          {t('feed.postComment')}
        </button>
      </form>
    </div>
  );
};

export default PostCard;

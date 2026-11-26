import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image, Upload } from 'lucide-react';
import { createPost } from '../../services/postService';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      setError(t('feed.maxImagesNotice'));
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5 MB');
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && images.length === 0) {
      setError('Please add post text or at least one photo');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      images.forEach((img) => formData.append('images', img));

      const res = await createPost(formData);
      if (onPostCreated) onPostCreated(res.post);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid #E0E7E2',
            paddingBottom: '0.75rem'
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1B5E20' }}>
            {t('nav.create')}
          </h2>
          <button onClick={onClose} style={{ background: 'none' }}>
            <X size={20} color="#5F6D67" />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.6rem 0.9rem',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-input"
              rows={4}
              placeholder={t('feed.whatsOnYourMind')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              style={{ resize: 'vertical' }}
            />
            <div
              style={{
                textAlign: 'right',
                fontSize: '0.75rem',
                color: text.length > 900 ? '#E53935' : '#8E9B94',
                marginTop: '4px'
              }}
            >
              {text.length}/1000
            </div>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '1rem'
              }}
            >
              {previews.map((previewUrl, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#E0E7E2'
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Selected"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '4px',
                      borderRadius: '50%'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Photos Button */}
          {images.length < 4 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => document.getElementById('post-file-input').click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px dashed #2E7D32',
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <Image size={18} />
                <span>
                  {t('feed.addPhotos')} ({images.length}/4)
                </span>
              </button>
              <input
                id="post-file-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={(!text.trim() && images.length === 0) || submitting}
            >
              {submitting ? t('feed.publishing') : t('feed.publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

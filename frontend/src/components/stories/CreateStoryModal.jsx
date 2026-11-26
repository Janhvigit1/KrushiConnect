import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Clock } from 'lucide-react';
import { createStory } from '../../services/storyService';

const CreateStoryModal = ({ onClose, onStoryCreated }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 15 * 1024 * 1024) {
        setError('File size exceeds 15 MB limit');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a photo or video to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('media', file);
      if (caption) formData.append('caption', caption);

      const res = await createStory(formData);
      if (onStoryCreated) onStoryCreated(res.story);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload story');
    } finally {
      setUploading(false);
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
            {t('stories.newStory')}
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
          {preview ? (
            <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '320px', backgroundColor: '#000' }}>
              {file?.type.startsWith('video') ? (
                <video src={preview} controls style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }} />
              ) : (
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }} />
              )}
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  padding: '6px',
                  borderRadius: '50%'
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed #A5D6A7',
                borderRadius: '12px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                backgroundColor: '#F1F8E9',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
              onClick={() => document.getElementById('story-file-input').click()}
            >
              <Upload size={36} color="#2E7D32" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.95rem' }}>
                {t('stories.uploadMedia')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#5F6D67', marginTop: '0.25rem' }}>
                JPEG, PNG or MP4 (Max 15MB)
              </div>
              <input
                id="story-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder={t('stories.captionPlaceholder')}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#5F6D67',
              fontSize: '0.8rem',
              marginBottom: '1.25rem'
            }}
          >
            <Clock size={15} color="#2E7D32" />
            <span>{t('stories.expiresNotice')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={uploading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? t('stories.posting') : t('feed.publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;

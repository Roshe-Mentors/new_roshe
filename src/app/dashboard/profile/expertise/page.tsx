"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../lib/auth';
import {
  getExpertiseTags,
  getMentorExpertise,
  addMentorExpertise,
  removeMentorExpertise
} from '../../../../services/profileService';
import { CategoryButton } from '../../components/common/DashboardComponents';

export default function ExpertisePage() {
  const { user, loading } = useUser();
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && user) {
      getExpertiseTags().then(setTags);
      getMentorExpertise(user.id).then((ids) => setSelected(new Set(ids)));
    }
  }, [user, loading]);

  const toggleTag = async (tagId: string) => {
    if (!user) return;
    setBusyIds((b) => new Set(b).add(tagId));
    const isActive = selected.has(tagId);
    try {
      if (isActive) {
        await removeMentorExpertise(user.id, tagId);
        setSelected((s) => { const n = new Set(s); n.delete(tagId); return n; });
      } else {
        await addMentorExpertise(user.id, tagId);
        setSelected((s) => new Set(s).add(tagId));
      }
    } finally {
      setBusyIds((b) => { const n = new Set(b); n.delete(tagId); return n; });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <CategoryButton
          key={tag.id}
          label={tag.name}
          active={selected.has(tag.id)}
          onClick={() => toggleTag(tag.id)}
          padding="px-3 py-2"
          textSize="text-sm"
        />
      ))}
    </div>
  );
}
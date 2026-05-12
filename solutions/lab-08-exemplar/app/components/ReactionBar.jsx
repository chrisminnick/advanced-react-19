import { useToggleReaction } from '../hooks/useToggleReaction.js';

const REACTIONS = [
  { type: 'heart',    icon: '♥', label: 'Heart' },
  { type: 'laugh',    icon: '😂', label: 'Laugh' },
  { type: 'surprise', icon: '😮', label: 'Surprise' },
];

// Three icon-buttons + counts. Each click toggles the current user's
// reaction via the mutation hook. The mutation owns the optimistic update,
// so this component is purely presentational.
export default function ReactionBar({ post }) {
  const { mutate, isPending } = useToggleReaction(post.id);

  return (
    <div className="reaction-bar" role="group" aria-label="Reactions">
      {REACTIONS.map(({ type, icon, label }) => {
        const slot = post.reactions?.[type] ?? { count: 0, mine: false };
        return (
          <button
            key={type}
            type="button"
            disabled={isPending}
            aria-pressed={slot.mine}
            aria-label={`${label}${slot.mine ? ' (you reacted)' : ''}`}
            className={`reaction reaction-${type}${slot.mine ? ' reaction-mine' : ''}`}
            onClick={() => mutate({ type, desired: !slot.mine })}
          >
            <span className="reaction-icon" aria-hidden="true">{icon}</span>
            <span className="reaction-count">{slot.count}</span>
          </button>
        );
      })}
    </div>
  );
}

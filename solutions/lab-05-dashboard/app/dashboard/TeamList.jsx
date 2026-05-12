import { getTeamMembers } from '@/lib/data';

export default async function TeamList() {
  const members = await getTeamMembers();
  return (
    <section className="team">
      <h2>Team</h2>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {/* Mock data — real avatars would live in /public/avatars/. */}
            <span className="avatar" aria-hidden="true">
              {m.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
            <span className="member-name">{m.name}</span>
            <span className="role">{m.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

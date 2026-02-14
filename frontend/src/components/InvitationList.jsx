// src/components/InvitationList.jsx
import InvitationCard from './InvitationCard';

function InvitationList({ invitations, onDelete }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Invitaciones Creadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((invitation) => (
          <InvitationCard
            key={invitation._id}
            invitation={invitation}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default InvitationList;
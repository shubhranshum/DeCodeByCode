const AnnouncementCard = ({ announcement }) => (
    
  <div className={`p-4 rounded-lg border ${
    announcement.type === 'alert' 
      ? 'bg-red-900/10 border-red-900/30' 
      : announcement.type === 'info'
        ? 'bg-orange-900/10 border-orange-900/30'
        : 'bg-gray-800/50 border-gray-700'
  }`}>
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-white">{announcement?.title}</h3>
      <span className="text-xs text-gray-400">{announcement?.createdBy?.username  || "Anonymous"}</span>
    </div>
    <p className="mt-2 text-sm text-gray-300">{announcement?.message}</p>
  </div>
);

export default AnnouncementCard
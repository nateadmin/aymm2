import { Route, Routes } from 'react-router-dom';
import LettersInbox from '@/pages/community/LettersInbox';
import MessageRequests from '@/pages/community/MessageRequests';
import OpenConversation from '@/pages/community/OpenConversation';
import FamilyTableListing from '@/pages/community/FamilyTableListing';
import FamilyTableDetails from '@/pages/community/FamilyTableDetails';
import RequestJoinTable from '@/pages/community/RequestJoinTable';
import RegisterTable from '@/pages/community/RegisterTable';
import TableConfirmation from '@/pages/community/TableConfirmation';
import PreviousPhotos from '@/pages/community/PreviousPhotos';
import EventReminders from '@/pages/community/EventReminders';

export default function Community() {
  return (
    <Routes>
      <Route path="letters-inbox" element={<LettersInbox />} />
      <Route path="message-requests" element={<MessageRequests />} />
      <Route path="open-conversation" element={<OpenConversation />} />
      <Route path="family-table-listing" element={<FamilyTableListing />} />
      <Route path="family-table-details" element={<FamilyTableDetails />} />
      <Route path="request-join-table" element={<RequestJoinTable />} />
      <Route path="register-table" element={<RegisterTable />} />
      <Route path="table-confirmation" element={<TableConfirmation />} />
      <Route path="previous-photos" element={<PreviousPhotos />} />
      <Route path="event-reminders" element={<EventReminders />} />
    </Routes>
  );
}

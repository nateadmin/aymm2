import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/prototype/Home';
import Settings from '@/pages/prototype/Settings';
import MyProfile from '@/pages/prototype/MyProfile';
import ProfileCarousel from '@/pages/prototype/ProfileCarousel';
import AdoptionApproved from '@/pages/prototype/AdoptionApproved';
import AymmFamilyMatch from '@/pages/prototype/AymmFamilyMatch';
import MessageRequestDetail from '@/pages/prototype/MessageRequestDetail';
import CompatibilityChallenge from '@/pages/prototype/CompatibilityChallenge';
import ReligionSelector from '@/pages/prototype/ReligionSelector';
import SeekingQsParent from '@/pages/prototype/SeekingQsParent';
import SeekingQsChild from '@/pages/prototype/SeekingQsChild';
import SeekingQsSibling from '@/pages/prototype/SeekingQsSibling';
import UsernameValidation from '@/pages/prototype/UsernameValidation';
import RegisterTableFull from '@/pages/prototype/RegisterTableFull';

export default function Prototype() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="settings" element={<Settings />} />
      <Route path="my-profile" element={<MyProfile />} />
      <Route path="profile-carousel" element={<ProfileCarousel />} />
      <Route path="adoption-approved" element={<AdoptionApproved />} />
      <Route path="aymm-family-match" element={<AymmFamilyMatch />} />
      <Route path="message-request-detail" element={<MessageRequestDetail />} />
      <Route path="compatibility-challenge" element={<CompatibilityChallenge />} />
      <Route path="religion-selector" element={<ReligionSelector />} />
      <Route path="seeking-qs-parent" element={<SeekingQsParent />} />
      <Route path="seeking-qs-child" element={<SeekingQsChild />} />
      <Route path="seeking-qs-sibling" element={<SeekingQsSibling />} />
      <Route path="username-validation" element={<UsernameValidation />} />
      <Route path="register-table-full" element={<RegisterTableFull />} />
    </Routes>
  );
}

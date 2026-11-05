import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EmergencyFeedPage } from './pages/EmergencyFeedPage';
import { DonorsPage } from './pages/DonorsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';
import { RoleSelectModal } from './components/RoleSelectModal';
import { EmergencyRequestModal } from './components/EmergencyRequestModal';
import { DonorRegisterModal } from './components/DonorRegisterModal';
import { AddEquipmentModal } from './components/AddEquipmentModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { IntroVideoOverlay } from './components/IntroVideoOverlay';
import { api } from './services/api';

export function App() {
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState(null);
  const [whatsAppType, setWhatsAppType] = useState('emergency');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenWhatsAppModal = (data, type = 'emergency') => {
    setWhatsAppData(data);
    setWhatsAppType(type);
    setWhatsAppModalOpen(true);
  };

  const handleCreateEmergencyRequest = async (payload) => {
    const res = await api.createEmergencyRequest(payload);
    if (res.success) {
      showToast('🚨 Emergency SOS request broadcasted successfully!');
      if (res.whatsappDirectLink) {
        handleOpenWhatsAppModal(res.data, 'emergency');
      }
    }
    return res;
  };

  const handleRegisterDonor = async (payload) => {
    const res = await api.createDonor(payload);
    if (res.success) {
      showToast('🩸 Donor profile registered in local directory!');
    }
    return res;
  };

  const handleCreateEquipment = async (payload) => {
    const res = await api.createEquipment(payload);
    if (res.success) {
      showToast('🩺 Medical equipment listed in local exchange!');
    }
    return res;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            setActiveTab={setActiveTab}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
            onOpenDonorModal={() => setDonorModalOpen(true)}
            onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        );
      case 'emergency':
        return (
          <EmergencyFeedPage
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        );
      case 'donors':
        return (
          <DonorsPage
            onOpenDonorModal={() => setDonorModalOpen(true)}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        );
      case 'equipment':
        return (
          <EquipmentPage
            onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        );
      case 'dashboard':
        return <DashboardPage />;
      case 'auth_login':
        return (
          <AuthPage
            initialMode="login"
            onAuthSuccess={() => {
              showToast('✅ Signed in successfully!');
              setActiveTab('home');
            }}
          />
        );
      case 'auth_signup':
        return (
          <AuthPage
            initialMode="signup"
            onAuthSuccess={() => {
              showToast('🎉 Account created & signed in!');
              setActiveTab('home');
            }}
          />
        );
      default:
        return (
          <HomePage
            setActiveTab={setActiveTab}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
            onOpenDonorModal={() => setDonorModalOpen(true)}
            onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
            onOpenWhatsAppModal={handleOpenWhatsAppModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fullscreen Entry Intro Video with Audio */}
      {showIntroVideo && (
        <IntroVideoOverlay onComplete={() => setShowIntroVideo(false)} />
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
        onReplayIntro={() => setShowIntroVideo(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Role Selection Welcome Modal (Asks after video is viewed or skipped) */}
      {!showIntroVideo && (
        <RoleSelectModal
          onSelectRole={(role, defaultTab) => {
            showToast(`👋 Browsing as ${role === 'donor' ? 'Blood Donor' : role === 'provider' ? 'Equipment Provider' : 'Patient / Attendant'}`);
            if (defaultTab) setActiveTab(defaultTab);
          }}
        />
      )}

      {/* Modals */}
      <EmergencyRequestModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onSubmitSuccess={handleCreateEmergencyRequest}
      />

      <DonorRegisterModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
        onSubmitSuccess={handleRegisterDonor}
      />

      <AddEquipmentModal
        isOpen={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onSubmitSuccess={handleCreateEquipment}
      />

      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        targetData={whatsAppData}
        type={whatsAppType}
      />
    </div>
  );
}

export default App;

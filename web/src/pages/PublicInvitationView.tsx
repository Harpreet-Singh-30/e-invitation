import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { resolveTemplate, resolveDefaultTemplateForCategory } from '../templates/registry';
import { adaptInvitationToTemplateData } from '../templates/adapter';

export default function PublicInvitationView() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [draftInfo, setDraftInfo] = useState<{ title?: string; eventType?: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    loadPublicInvitation();
  }, [slug]);

  const loadPublicInvitation = async () => {
    try {
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage('');

      const res = await api.get(`/api/public/invitations/${slug}`);
      setInvitation(res.data.invitation);
    } catch (err: any) {
      console.error('Error fetching public invitation:', err);
      const status = err.response?.status || 500;
      setErrorStatus(status);

      if (status === 403) {
        setDraftInfo({
          title: err.response?.data?.title,
          eventType: err.response?.data?.eventType,
        });
        setErrorMessage(
          err.response?.data?.message ||
          'This celebration website is currently in draft mode and waiting to be published by the host.'
        );
      } else if (status === 404) {
        setErrorMessage('We could not find any celebration website associated with this link.');
      } else {
        setErrorMessage('Unable to load this invitation website. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-amber-200/80 font-serif tracking-widest uppercase text-xs">
          Opening Celebration...
        </p>
      </div>
    );
  }

  // 2. Draft / Unpublished Notice (Payment required by host)
  if (errorStatus === 403) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 font-sans text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-3xl mb-4">
            ⏳
          </div>

          <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Draft Invitation
          </span>

          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            {draftInfo?.title || 'Celebration Invitation'}
          </h2>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {errorMessage}
          </p>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6 text-left text-xs text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-300">Are you the host?</p>
            <p>Log in to your account, complete the publication checkout, and make your site instantly live for guests.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-400 hover:to-rose-500 transition shadow-lg"
            >
              Host Login &amp; Publish →
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              InviteHub Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. 404 / Missing Invitation
  if (errorStatus === 404 || !invitation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 font-sans text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">Invitation Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            The link you clicked might be expired, mistyped, or not yet created.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs transition"
          >
            Explore InviteHub
          </Link>
        </div>
      </div>
    );
  }

  // 4. Render Live Published Invitation
  const occasionType = invitation.occasionType || invitation.eventType || invitation.theme?.category || 'wedding';

  const templateData = adaptInvitationToTemplateData({
    title: invitation.title,
    tagline: invitation.tagline || undefined,
    welcomeMessage: invitation.welcomeMessage || undefined,
    storyContent: invitation.storyContent || undefined,
    familyInfo: invitation.familyInfo || undefined,
    events: invitation.events || [],
    occasionType,
    heroImageUrl: invitation.heroImageUrl || undefined,
    musicUrl: invitation.musicUrl || undefined,
  });

  const occasionFallback = resolveDefaultTemplateForCategory(invitation.occasionType || invitation.eventType);
  const templateComponentId =
    invitation.theme?.templateComponent ||
    invitation.theme?.slug ||
    invitation.theme?.id ||
    occasionFallback;

  const resolved = resolveTemplate(templateComponentId) || resolveTemplate(occasionFallback) || resolveTemplate('imperial-burgundy');
  const TemplateComponent = resolved!.component;

  return (
    <div className="min-h-screen w-full bg-neutral-900">
      <TemplateComponent data={templateData} />
    </div>
  );
}

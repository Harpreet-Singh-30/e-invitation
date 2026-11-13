import { useState } from 'react';
import api from '../lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  invitationTitle: string;
  invitationSlug: string;
  occasionType?: string;
  onPaymentSuccess: (data: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  invitationId,
  invitationTitle,
  invitationSlug,
  occasionType = 'wedding',
  onPaymentSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI state
  const [upiId, setUpiId] = useState('');

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/i/${invitationSlug}`;

  const handleFillDemoCard = () => {
    setCardNumber('4532 •••• •••• 8892');
    setCardExpiry('12/28');
    setCardCvv('789');
    setCardName('Harpreet Singh');
    setError('');
  };

  const handleFillDemoUpi = () => {
    setUpiId('celebrations@upi');
    setError('');
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      setProcessingStep('Securing connection with simulated payment gateway...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProcessingStep('Validating credentials and authorizing ₹1,499 charge...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProcessingStep('Activating public domain slug & publishing website...');

      const response = await api.post(`/api/host/invitations/${invitationId}/pay`, {
        amount: 1499,
        paymentMethod,
        planName: 'Premium Celebration Launch Plan',
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      setPaymentSuccess(response.data);
      onPaymentSuccess(response.data);
    } catch (err: any) {
      console.error('Payment failure:', err);
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-scaleIn">
        
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-b from-amber-500/20 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-lg shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {paymentSuccess ? 'Celebration Website Activated!' : 'Publish Celebration Website'}
              </h2>
              <p className="text-xs text-slate-400">
                {paymentSuccess ? 'Your custom invitation link is now live' : 'Launch custom link & full guest features'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STATE 1: PAYMENT SUCCESS & SHARE LINK */}
          {paymentSuccess ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                🎉
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Payment Verified (₹1,499)
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  {invitationTitle} is Officially Live!
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Txn ID: {paymentSuccess.payment?.transactionId || 'TXN_SUCCESS'}
                </p>
              </div>

              {/* Shareable Link Box */}
              <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl text-left">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Your Public Shareable Invitation Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs px-3 py-2.5 rounded-xl select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    <span>{copied ? '✓ Copied!' : '📋 Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🌐 Open Live Website</span>
                  <span>↗</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `✨ You're invited to celebrate with us! View our invitation website here: ${publicUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>💬 Share on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  Done, return to editor
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: CHECKOUT & PAYMENT SELECTION */
            <div className="space-y-6">
              {/* Order Breakdown Banner */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{invitationTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                      {occasionType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Slug: /i/{invitationSlug}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs text-slate-500 line-through">₹2,999</span>
                    <span className="text-lg font-extrabold text-white">₹1,499</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">50% OFF Launch Promo</span>
                </div>
              </div>

              {/* Included Perks Checklist */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Public Shareable Link
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Audio Player &amp; Theme Gate
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Guest RSVPs &amp; Event Maps
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> 1-Year Cloud Hosting
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Simulated Payment Method:
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">📱</span>
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">🏦</span>
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Input Section */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-300">Credit / Debit Card</span>
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>🔑 Fill Demo Card</span>
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Cardholder Name (e.g. Harpreet Singh)"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (4532 •••• •••• 8892)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-300">Virtual Payment Address (VPA)</span>
                    <button
                      type="button"
                      onClick={handleFillDemoUpi}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>⚡ Fill Demo VPA</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">
                    Instant verification with simulated Google Pay, PhonePe, or Paytm approval.
                  </p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-300">Popular Indian Banks</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                      <div
                        key={bank}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:border-amber-500/50 cursor-pointer flex items-center gap-2"
                      >
                        <span>🏛️</span>
                        <span className="truncate">{bank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Payment CTA */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                    <span>{processingStep || 'Processing Payment...'}</span>
                  </>
                ) : (
                  <>
                    <span>🔒 Pay ₹1,499 &amp; Publish Invitation</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <span>🛡️</span>
                <span>Simulated Secure 256-Bit SSL Checkout • No real money is charged</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

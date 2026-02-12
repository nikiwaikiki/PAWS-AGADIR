import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useMyHelperApplication, useApplyAsHelper } from '@/hooks/useHelperApplication';
import { Heart, CheckCircle, Clock, XCircle, Users, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BecomeHelperPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: existingApplication, isLoading } = useMyHelperApplication(user?.id);
  const applyMutation = useApplyAsHelper();
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await applyMutation.mutateAsync({
        userId: user.id,
        message: message.trim(),
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <div className="glass-card rounded-xl p-8 animate-fade-in">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {t('helper.loginRequired')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('helper.loginRequiredDesc')}
              </p>
              <Button onClick={() => navigate('/auth')}>{t('common.login')}</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </main>
      </div>
    );
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-lg">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="mb-6 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
            
            <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
              {existingApplication.status === 'pending' && (
                <>
                  <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t('helper.status.pending')}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t('helper.status.pendingDesc')}
                  </p>
                </>
              )}
              {existingApplication.status === 'approved' && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t('helper.status.approved')}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t('helper.status.approvedDesc')}
                  </p>
                  <Button onClick={() => navigate('/admin')} className="gap-2">
                    <Heart className="w-4 h-4" />
                    {t('helper.status.goToDashboard')}
                  </Button>
                </>
              )}
              {existingApplication.status === 'rejected' && (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t('helper.status.rejected')}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t('helper.status.rejectedDesc')}
                  </p>
                </>
              )}
              
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg text-left">
                <Label className="text-xs text-muted-foreground">{t('helper.status.yourApplication')}</Label>
                <p className="text-sm text-foreground mt-1">{existingApplication.message}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Button>

          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t('helper.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('helper.description')}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 mb-6 animate-fade-in">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {t('helper.benefits.title')}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{t('helper.benefits.seeSos')}</strong> {' -- '} {t('helper.benefits.sosDesc')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{t('helper.benefits.approve')}</strong> {' -- '} {t('helper.benefits.approveDesc')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{t('helper.benefits.edit')}</strong> {' -- '} {t('helper.benefits.editDesc')}
                </span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card rounded-xl p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                {t('helper.application.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">{t('helper.application.question')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('helper.application.placeholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('helper.application.hint')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                className="flex-1 gap-2"
                disabled={isSubmitting || !message.trim()}
              >
                <Heart className="w-4 h-4" />
                {isSubmitting ? t('helper.application.submitting') : t('helper.application.submit')}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BecomeHelperPage;

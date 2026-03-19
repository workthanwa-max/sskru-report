import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Wrench, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TicketDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({ isOpen, onClose, ticket }) => {
  const { t } = useTranslation();

  if (!ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={ticket.status === 'Closed' ? 'success' : 'secondary'}>
              {ticket.status}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">#{ticket.id}</span>
          </div>
          <DialogTitle className="text-2xl font-bold">{ticket.description || t('tickets.no_desc')}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {formatDate(ticket.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('tickets.location')}</h4>
              <div className="bg-muted/30 p-3 rounded-lg flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-foreground">
                    {ticket.building_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('infrastructure.floor')} {ticket.floor_number}, {t('infrastructure.room')} {ticket.room_number} ({ticket.room_name})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('tickets.category')}</h4>
              <div className="bg-muted/30 p-3 rounded-lg flex items-center gap-3">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                  {ticket.category_name}
                </Badge>
              </div>
            </div>
          </div>

          {/* People Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('auth.reporter')}</h4>
              <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                  {ticket.reporter_name?.charAt(0)}
                </div>
                <p className="font-medium text-sm">{ticket.reporter_name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('auth.technician')}</h4>
              <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                {ticket.technician_name ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      {ticket.technician_name.charAt(0)}
                    </div>
                    <p className="font-medium text-sm">{ticket.technician_name}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">{t('tickets.unassigned')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Image (Before) */}
          {ticket.image_before && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('tickets.evidence')}</h4>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/5">
                <img 
                  src={ticket.image_before} 
                  alt="Evidence" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Maintenance Results */}
          {(ticket.maintenance_notes || ticket.maintenance_photo) && (
            <div className="space-y-3 border-t pt-4 border-dashed">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t('tickets.maintenance_summary')}
              </h4>
              <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl space-y-4">
                {ticket.maintenance_notes && (
                  <div>
                    <p className="text-xs font-semibold text-green-700/70 uppercase mb-1">{t('tickets.technician_notes')}</p>
                    <p className="text-sm leading-relaxed text-foreground">{ticket.maintenance_notes}</p>
                  </div>
                )}
                
                {ticket.maintenance_photo && (
                  <div>
                    <p className="text-xs font-semibold text-green-700/70 uppercase mb-2">{t('tickets.completion_photo')}</p>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-black/5">
                      <img 
                        src={ticket.maintenance_photo} 
                        alt="Completion proof" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
                
                {ticket.completion_date && (
                  <div className="flex items-center gap-2 text-xs text-green-700/60 mt-2 italic">
                    <Clock className="w-3 h-3" />
                    {t('tickets.completed_at')} {formatDate(ticket.completion_date)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

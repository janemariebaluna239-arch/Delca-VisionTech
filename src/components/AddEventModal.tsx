import React, { useState, useEffect } from 'react';
import { Calendar, X, Save, AlertCircle } from 'lucide-react';
import { DELCAEvent } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<DELCAEvent>) => Promise<void>;
  initialData?: DELCAEvent | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('Logistics & Supply Chain');
  const [targetPersona, setTargetPersona] = useState('Operations Pragmatist');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [speakerInfo, setSpeakerInfo] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setVenue(initialData.venue || '');
      setDate(initialData.date || '');
      setTime(initialData.time || '');
      setRegistrationDeadline(initialData.registrationDeadline || '');
      setTargetIndustry(initialData.targetIndustry || 'Logistics & Supply Chain');
      setTargetPersona(initialData.targetPersona || 'Operations Pragmatist');
      setMaxParticipants(initialData.maxParticipants || 50);
      setSpeakerInfo(initialData.speakerInfo || '');
    } else {
      setName('');
      setDescription('');
      setVenue('');
      setDate('August 15, 2026');
      setTime('09:00 AM - 04:00 PM');
      setRegistrationDeadline('August 8, 2026');
      setTargetIndustry('Logistics & Supply Chain');
      setTargetPersona('Operations Pragmatist');
      setMaxParticipants(50);
      setSpeakerInfo('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !venue.trim() || !date.trim()) {
      setError('Event Name, Venue, and Date are required.');
      return;
    }

    try {
      setIsBusy(true);
      await onSave({
        name,
        description,
        venue,
        date,
        time,
        registrationDeadline,
        targetIndustry,
        targetPersona,
        maxParticipants: Number(maxParticipants) || 50,
        speakerInfo,
        status: 'Upcoming'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save event record.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-navy-900 border border-blue-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-blue-400 font-display font-bold text-base">
            <Calendar className="w-5 h-5" />
            <span>{initialData ? 'Edit Event Record' : 'Create New Event Record'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Event Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. NextGen ERP & Supply Chain Resilience Summit"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Venue & Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Solaire Grand Ballroom, Manila"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Date *</label>
              <input
                type="text"
                required
                placeholder="e.g. August 15, 2026"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Time Schedule</label>
              <input
                type="text"
                placeholder="e.g. 09:00 AM - 04:00 PM"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">RSVP Deadline</label>
              <input
                type="text"
                placeholder="e.g. August 8, 2026"
                value={registrationDeadline}
                onChange={e => setRegistrationDeadline(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Target Industry</label>
              <select
                value={targetIndustry}
                onChange={e => setTargetIndustry(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                <option value="Banking & Finance">Banking & Finance</option>
                <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="All Industries">All Industries</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Max Capacity (VIPs)</label>
              <input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={e => setMaxParticipants(Number(e.target.value))}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Keynote Speakers / Panelists</label>
              <input
                type="text"
                placeholder="e.g. Dr. Arthur Pendelton (Chief Architect) & Guest Panelists"
                value={speakerInfo}
                onChange={e => setSpeakerInfo(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Event Overview & Agenda</label>
              <textarea
                rows={3}
                placeholder="Brief summary of event objectives, keynotes, and breakout tracks..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

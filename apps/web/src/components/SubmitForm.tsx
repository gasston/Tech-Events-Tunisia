'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, AlertCircle, Sparkles, FileText, ImageUp } from 'lucide-react'
import { CATEGORIES, CITIES, AUDIENCES } from '@tet/shared'
import { submitEvent, uploadImage, extractEvent, type ExtractedEvent } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const input =
  'w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-accent'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-[13px] font-medium text-fg">{label}</label>
      {hint && <p className="mb-1.5 text-[12px] text-muted">{hint}</p>}
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-3 py-1.5 text-[13px] transition-colors',
        active ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-fg hover:border-accent/50'
      )}
    >
      {children}
    </button>
  )
}

export function SubmitForm() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '', organizer: '', description: '',
    startDate: '', startTime: '', endDate: '', endTime: '',
    format: 'onsite' as 'onsite' | 'online' | 'hybrid',
    city: '', address: '', lat: '', lng: '', onlineUrl: '',
    categories: [] as string[], audience: [] as string[],
    isFree: true, price: '',
    registrationUrl: '', websiteUrl: '',
  })

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // ─── Auto-fill from poster/text ───────────────────────────────────────────
  const [mode, setMode] = useState<'image' | 'text'>('image')
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')
  const [extractDone, setExtractDone] = useState(false)
  const posterInputRef = useRef<HTMLInputElement>(null)
  const pickPoster = () => posterInputRef.current?.click()

  function splitIso(iso: string | null): { date: string; time: string } {
    if (!iso) return { date: '', time: '' }
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
    return m ? { date: m[1], time: m[2] } : { date: '', time: '' }
  }

  function applyExtraction(e: ExtractedEvent) {
    const start = splitIso(e.startDate)
    const end = splitIso(e.endDate)
    setForm((f) => ({
      ...f,
      title: e.title || f.title,
      organizer: e.organizer || f.organizer,
      description: e.description || f.description,
      startDate: start.date || f.startDate,
      startTime: start.time || f.startTime,
      endDate: end.date || f.endDate,
      endTime: end.time || f.endTime,
      format: e.format || f.format,
      city: e.city || f.city,
      address: e.address || f.address,
      onlineUrl: e.onlineUrl || f.onlineUrl,
      categories: e.categories.length ? e.categories : f.categories,
      audience: e.targetAudience.length ? e.targetAudience : f.audience,
      isFree: e.isFree,
      price: e.price != null ? String(e.price) : f.price,
      registrationUrl: e.registrationUrl || f.registrationUrl,
      websiteUrl: e.websiteUrl || f.websiteUrl,
    }))
  }

  async function runExtraction() {
    setExtracting(true)
    setExtractError('')
    setExtractDone(false)
    try {
      const data = await extractEvent(
        mode === 'image'
          ? { file: posterFile ?? undefined, text: pastedText || undefined }
          : { text: pastedText }
      )
      applyExtraction(data)
      setExtractDone(true)
    } catch (err: any) {
      setExtractError(err.message || 'Extraction impossible')
    } finally {
      setExtracting(false)
    }
  }

  const canExtract = mode === 'image' ? !!posterFile : pastedText.trim().length > 10
  function toggleArray(key: 'categories' | 'audience', val: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }))
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setCoverUrl(url)
    } catch {
      setError('Erreur upload image')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const startISO = form.startDate && form.startTime ? new Date(`${form.startDate}T${form.startTime}`).toISOString() : null
    const endISO = form.endDate && form.endTime ? new Date(`${form.endDate}T${form.endTime}`).toISOString() : null

    if (!startISO) { setError('Date et heure de début requises.'); setStatus('error'); return }
    if (form.categories.length === 0) { setError('Sélectionnez au moins une catégorie.'); setStatus('error'); return }

    try {
      await submitEvent({
        title: form.title, organizer: form.organizer, description: form.description,
        coverImage: coverUrl, startDate: startISO, endDate: endISO, format: form.format,
        city: form.city || null, address: form.address || null,
        latitude: form.lat ? parseFloat(form.lat) : null,
        longitude: form.lng ? parseFloat(form.lng) : null,
        onlineUrl: form.onlineUrl || null,
        targetAudience: form.audience, categories: form.categories,
        isFree: form.isFree, price: !form.isFree && form.price ? parseFloat(form.price) : null,
        registrationUrl: form.registrationUrl || null, websiteUrl: form.websiteUrl || null,
      })
      setStatus('success')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la soumission.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
        <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500" />
        <h2 className="font-display text-xl font-bold tracking-tight">Événement soumis !</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Votre événement est en attente de modération. Il sera publié après validation.
        </p>
        <Button onClick={() => router.push('/')} className="mt-6" size="lg">Retour à l'accueil</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Auto-fill panel */}
      <div className="mb-8 overflow-hidden rounded-lg border border-accent/30 bg-accent/5">
        <div className="flex items-center gap-2 border-b border-accent/20 px-4 py-3">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm font-semibold text-fg">Remplir automatiquement</span>
          <span className="ml-auto text-[12px] text-muted">affiche ou texte → champs pré-remplis</span>
        </div>

        <div className="p-4">
          {/* Input fichier toujours monté (ref stable) */}
          <input
            ref={posterInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { setPosterFile(e.target.files?.[0] ?? null); setExtractDone(false) }}
          />

          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => { setMode('image'); pickPoster() }}
              className={cn('flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] transition-colors',
                mode === 'image' ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-fg hover:border-accent/50')}
            >
              <ImageUp size={14} /> Affiche
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={cn('flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] transition-colors',
                mode === 'text' ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-fg hover:border-accent/50')}
            >
              <FileText size={14} /> Texte
            </button>
          </div>

          {mode === 'image' ? (
            <button
              type="button"
              onClick={pickPoster}
              className="flex w-full items-center gap-2 rounded-md border border-dashed border-line bg-surface px-3 py-4 text-left text-[13px] text-muted transition-colors hover:border-accent/50 hover:bg-surface-2"
            >
              <Upload size={16} className="shrink-0 text-accent" />
              {posterFile ? posterFile.name : 'Cliquer pour choisir une affiche (JPG, PNG, WebP)'}
            </button>
          ) : (
            <textarea
              value={pastedText}
              onChange={(e) => { setPastedText(e.target.value); setExtractDone(false) }}
              placeholder="Colle ici la description / le post de l'événement…"
              className={cn(input, 'min-h-[100px] resize-y')}
            />
          )}

          {extractError && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-red-500">
              <AlertCircle size={13} /> {extractError}
            </p>
          )}
          {extractDone && !extractError && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-emerald-500">
              <CheckCircle size={13} /> Champs pré-remplis — vérifie et corrige si besoin.
            </p>
          )}

          <Button
            type="button"
            onClick={runExtraction}
            disabled={!canExtract || extracting}
            className="mt-3"
          >
            <Sparkles size={15} />
            {extracting ? 'Analyse en cours…' : 'Remplir le formulaire'}
          </Button>
        </div>
      </div>

      <Field label="Titre de l'événement *">
        <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex: AI Meetup Tunis" required />
      </Field>
      <Field label="Organisateur *">
        <input className={input} value={form.organizer} onChange={(e) => set('organizer', e.target.value)} placeholder="Ex: GDG Tunis" required />
      </Field>
      <Field label="Description *" hint="Décrivez l'événement, les thèmes, les intervenants…">
        <textarea className={cn(input, 'min-h-[120px] resize-y')} value={form.description} onChange={(e) => set('description', e.target.value)} required />
      </Field>

      <Field label="Image de couverture">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-line px-3 py-2.5 text-[13px] text-muted transition-colors hover:border-accent/50">
          <Upload size={14} />
          {uploading ? 'Upload en cours…' : coverUrl ? 'Image uploadée ✓' : 'Choisir une image (JPG, PNG, WebP)'}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        {coverPreview && <img src={coverPreview} alt="preview" className="mt-2 max-h-32 rounded-md border border-line" />}
      </Field>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div><label className="mb-1.5 block text-[13px] font-medium">Date début *</label><input type="date" className={input} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} required /></div>
        <div><label className="mb-1.5 block text-[13px] font-medium">Heure début *</label><input type="time" className={input} value={form.startTime} onChange={(e) => set('startTime', e.target.value)} required /></div>
        <div><label className="mb-1.5 block text-[13px] font-medium">Date fin</label><input type="date" className={input} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} /></div>
        <div><label className="mb-1.5 block text-[13px] font-medium">Heure fin</label><input type="time" className={input} value={form.endTime} onChange={(e) => set('endTime', e.target.value)} /></div>
      </div>

      <Field label="Format *">
        <div className="flex gap-2">
          {(['onsite', 'online', 'hybrid'] as const).map((f) => (
            <Chip key={f} active={form.format === f} onClick={() => set('format', f)}>
              {f === 'onsite' ? 'Présentiel' : f === 'online' ? 'En ligne' : 'Hybride'}
            </Chip>
          ))}
        </div>
      </Field>

      {(form.format === 'onsite' || form.format === 'hybrid') && (
        <>
          <Field label="Ville">
            <select className={cn(input, 'cursor-pointer appearance-none')} value={form.city} onChange={(e) => set('city', e.target.value)}>
              <option value="">Sélectionner une ville</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Adresse">
            <input className={input} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Ex: The Dot, Lac 1, Tunis" />
          </Field>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 block text-[13px] font-medium">Latitude</label><input type="number" step="any" className={input} value={form.lat} onChange={(e) => set('lat', e.target.value)} placeholder="36.832" /></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Longitude</label><input type="number" step="any" className={input} value={form.lng} onChange={(e) => set('lng', e.target.value)} placeholder="10.218" /></div>
          </div>
        </>
      )}

      {(form.format === 'online' || form.format === 'hybrid') && (
        <Field label="Lien de l'événement en ligne">
          <input type="url" className={input} value={form.onlineUrl} onChange={(e) => set('onlineUrl', e.target.value)} placeholder="https://meet.google.com/…" />
        </Field>
      )}

      <Field label="Catégories * (1 minimum)">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => <Chip key={c} active={form.categories.includes(c)} onClick={() => toggleArray('categories', c)}>{c}</Chip>)}
        </div>
      </Field>

      <Field label="Public cible">
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => <Chip key={a} active={form.audience.includes(a)} onClick={() => toggleArray('audience', a)}>{a}</Chip>)}
        </div>
      </Field>

      <Field label="Prix">
        <div className="mb-2 flex gap-2">
          <Chip active={form.isFree} onClick={() => set('isFree', true)}>Gratuit</Chip>
          <Chip active={!form.isFree} onClick={() => set('isFree', false)}>Payant</Chip>
        </div>
        {!form.isFree && <input type="number" min="0" step="0.5" className={input} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="Prix en TND" />}
      </Field>

      <Field label="Lien d'inscription">
        <input type="url" className={input} value={form.registrationUrl} onChange={(e) => set('registrationUrl', e.target.value)} placeholder="https://…" />
      </Field>
      <Field label="Site web officiel">
        <input type="url" className={input} value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="https://…" />
      </Field>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2.5 text-[13px] text-red-500">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <Button type="submit" disabled={status === 'loading' || uploading} size="lg" className="w-full">
        {status === 'loading' ? 'Envoi en cours…' : "Soumettre l'événement"}
      </Button>
      <p className="mt-2.5 text-center text-[12px] text-muted">Votre événement sera examiné avant publication.</p>
    </form>
  )
}

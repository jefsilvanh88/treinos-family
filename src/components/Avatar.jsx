import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { uploadAvatar } from '../lib/supabase'
import jeffImg from '../assets/jef.png'
import nicImg from '../assets/nic.png'
import joImg from '../assets/jo.png'

const STATIC_AVATARS = { jeff: jeffImg, nicole: nicImg, jo: joImg }

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Avatar({ profile, size = 'md', editable = false, onUpdated }) {
  const inputRef = useRef()
  const sizes = {
    sm: 'w-12 h-12 text-base',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file || !profile?.id) return
    try {
      const url = await uploadAvatar(profile.id, file)
      onUpdated?.(url)
    } catch (err) {
      console.error('Avatar upload failed', err)
    }
  }

  const imgSrc = profile?.avatar_url || STATIC_AVATARS[profile?.key]

  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold overflow-hidden ring-2`}
        style={{
          background: 'linear-gradient(135deg, #1e3354, #2a4f7c)',
          ringColor: 'rgba(41,121,255,0.4)',
          boxShadow: '0 0 0 2px rgba(41,121,255,0.35)',
        }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={profile.name} className="w-full h-full object-cover" />
        ) : (
          <span style={{ color: '#2979ff' }}>{initials(profile?.name || '?')}</span>
        )}
      </div>
      {editable && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: '#2979ff' }}
          >
            <Camera size={14} className="text-white" />
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </>
      )}
    </div>
  )
}

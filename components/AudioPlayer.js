// components/AudioPlayer.js
import { useState, useRef, useEffect } from 'react'

// ✏️ Your original hard-coded list, renamed
const defaultPlaylist = [
  { url: '/audio/butterfly-collector.mp3', title: 'The Butterfly Collector', artist: 'The Jam',      year: 1979, cover: '/covers/butterfly-collector.jpg' },
  { url: '/audio/jason-stop-wanking.mp3', title: 'Jason Stop Wanking',     artist: 'Sleaford Mods', year: 2014, cover: '/covers/jason-stop-wanking.jpg' },
  { url: '/audio/nothing-compares-2-u.mp3', title: 'Nothing Compares 2 U',   artist: 'Prince (Sinead O’Connor cover)', year: 1990, cover: '/covers/nothing-compares-2-u.jpg' },
  { url: '/audio/teenage-kicks.mp3',       title: 'Teenage Kicks',         artist: 'The Undertones', year: 1978, cover: '/covers/teenage-kicks.jpg' }
]

// Utility to format timecodes
function formatTime(sec = 0) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function AudioPlayer({
  playlist: propsPlaylist,
  currentIndex: propsIndex,
  onTrackChange
}) {
  // Fallback state if no props are passed
  const [internalIndex, setInternalIndex] = useState(0)
  const [currentTime, setCurrentTime]   = useState(0)
  const [duration,    setDuration]      = useState(0)
  const audioRef = useRef(null)

  // Decide which playlist & index to use
  const playlist = propsPlaylist || defaultPlaylist
  const index    = typeof propsIndex === 'number' ? propsIndex : internalIndex

  // Unified setter: either notify parent or update local state
  const setIndex = (newIdx) => {
    if (typeof onTrackChange === 'function') onTrackChange(newIdx)
    else setInternalIndex(newIdx)
  }

  // Prev / Next buttons
  const playPrev = () => setIndex(index === 0 ? playlist.length - 1 : index - 1)
  const playNext = () => setIndex((index + 1) % playlist.length)

  // Whenever `index` or `playlist` changes, load & autoplay
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    setCurrentTime(0)
    const onLoad = () => audio.play().catch(() => {})
    audio.addEventListener('loadedmetadata', onLoad)
    return () => audio.removeEventListener('loadedmetadata', onLoad)
  }, [index, playlist])

  // Update timecodes
  const onLoadedMetadata = () => setDuration(audioRef.current.duration || 0)
  const onTimeUpdate     = () => setCurrentTime(audioRef.current.currentTime || 0)

  // Destructure the current track
  const { title, artist, year, cover, url } = playlist[index]

  return (
    <section id="player" className="p-6 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 rounded-lg shadow-inner border border-gray-400">
      {/* Cover & Info (unchanged) */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 text-center md:text-left mb-4 md:mb-0">
          <img src={cover} alt={`${title} cover`} className="mx-auto md:mx-0 w-48 h-48 object-cover rounded border-4 border-gray-400 shadow-lg mb-4" />
          <h3 className="text-2xl font-medium font-mono mb-1">{title}</h3>
          <p className="text-gray-700 dark:text-gray-200 font-mono">{artist} • {year}</p>
        </div>
        {/* Track List (unchanged structure) */}
        <div className="md:w-2/3 md:pl-6 overflow-auto md:max-h-80">
          <ul className="space-y-1">
            {playlist.map((track, idx) => (
              <li
                key={idx}
                onClick={() => setIndex(idx)}
                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer font-mono text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                  idx === index ? 'bg-blue-600 text-white shadow-inner' : 'bg-gray-50'
                }`}
              >
                <span className="flex-1 truncate">{track.title}</span>
                {idx === index && <span className="ml-2">▶</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls & Timecode (unchanged) */}
      <div className="mt-6 flex flex-col items-center w-full">
 <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-4 w-full">          <button onClick={playPrev} className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shadow-inner hover:bg-gray-500">‹</button>
          <audio
            ref={audioRef}
            controls
            controlsList="nodownload"
            src={url}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={playNext}
            className="w-full h-12"
          >
            Your browser does not support the audio element.
          </audio>
          <button onClick={playNext} className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shadow-inner hover:bg-gray-500">›</button>
        </div>
        <div className="flex justify-between w-full text-xs font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>
    </section>
  )
}

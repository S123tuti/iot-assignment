import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Load audio files from local storage on component mount
    const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
    setAudioFiles(storedAudioFiles);

    // Load last playing track and position
    const lastPlayedTrackIndex = parseInt(localStorage.getItem('lastPlayedTrackIndex')) || 0;
    const lastPlayedTime = parseFloat(localStorage.getItem('lastPlayedTime')) || 0;

    setCurrentTrackIndex(lastPlayedTrackIndex);

    const audioElement = document.getElementById('audioPlayer');
    audioElement.currentTime = lastPlayedTime;

    if (storedAudioFiles.length > 0) {
      audioElement.src = storedAudioFiles[lastPlayedTrackIndex].url;
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    // Save current playing track and position to local storage
    localStorage.setItem('lastPlayedTrackIndex', currentTrackIndex);
    localStorage.setItem('lastPlayedTime', currentTime);
  }, [currentTrackIndex, currentTime]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newAudioFiles = [...audioFiles, { name: file.name, url: URL.createObjectURL(file) }];
      setAudioFiles(newAudioFiles);
      localStorage.setItem('audioFiles', JSON.stringify(newAudioFiles));
    }
  };

  const handlePlayPause = () => {
    const audioElement = document.getElementById('audioPlayer');

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audioElement = document.getElementById('audioPlayer');
    setCurrentTime(audioElement.currentTime);

    // Auto play next track when the current track is finished
    if (audioElement.currentTime >= audioElement.duration) {
      playNextTrack();
    }
  };

  const playTrack = (index) => {
    const audioElement = document.getElementById('audioPlayer');
    audioElement.src = audioFiles[index].url;
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    audioElement.play();
  };

  const playNextTrack = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
    playTrack(nextTrackIndex);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <audio id="audioPlayer" onTimeUpdate={handleTimeUpdate} controls />
      <div>
        <h3>Playlist</h3>
        <ul>
          {audioFiles.map((audio, index) => (
            <li key={index} onClick={() => playTrack(index)}>
              {audio.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Now Playing</h3>
        {audioFiles.length > 0 && (
          <p>
            {audioFiles[currentTrackIndex].name} - {currentTime.toFixed(2)}s
          </p>
        )}
      </div>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default AudioPlayer;

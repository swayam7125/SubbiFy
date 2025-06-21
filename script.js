document.addEventListener('DOMContentLoaded', function () {
    // Song data
    const songs = [
        {
            name: "Tune Kya Kiya",
            src: "songs/Tune_Kya_Kiya.mp3",
            duration: "01:30",
            cover: "assets/surbhi1.jpg"
        },
        {
            name: "vhalam aavo ne",
            src: "songs/vhalam_aavo_ne.mp3",
            duration: "01:10",
            cover: "assets/surbhi2.jpg"
        },
        {
            name: "Bade acche lagte he",
            src: "songs/Bade_acche_lagte_he.mp3",
            duration: "01:20",
            cover: "assets/surbhi3.jpg"
        },
        {
            name: "Dagabaaz",
            src: "songs/dagabaaz.mp3",
            duration: "01:03",
            cover: "assets/surbhi4.jpg"
        },
        {
            name: "Ham kya kare",
            src: "songs/Ham_kya_kare.mp3",
            duration: "01:21",
            cover: "assets/surbhi5.jpg"
        },
        {
            name: "Jab Tak",
            src: "songs/Jab_Tak.mp3",
            duration: "01:14",
            cover: "assets/surbhi6.jpg"
        },
        {
            name: "Lag Jaa Gale",
            src: "songs/Lag_Jaa_Gale.mp3",
            duration: "01:21",
            cover: "assets/surbhi10.jpg"
        },
        {
            name: "Vhal no dariyo",
            src: "songs/Vhal_no_dariyo.mp3",
            duration: "01:13",
            cover: "assets/surbhi11.jpg"
        },
        {
            name: "Tum Jo Aaye",
            src: "songs/Tum_Jo_Aaye.mp3",
            duration: "01:06",
            cover: "assets/surbhi9.jpg"
        },
        {
            name: "Tere Sang Yaara",
            src: "songs/Tere_Sang_Yaara.mp3",
            duration: "04:30",
            cover: "assets/surbhi7.jpg"
        },
        {
            name: "Jugraafiya",
            src: "songs/Jugraafiya.mp3",
            duration: "01:03",
            cover: "assets/surbhi8.jpg"
        },
        {
            name: "Maand",
            src: "songs/Maand.mp3",
            duration: "00:17",
            cover: "assets/surbhi12.jpg"
        }
    ];

    // Audio player elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('play-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const currentSongName = document.getElementById('current-song-name');
    const currentSongImg = document.getElementById('current-song-img');
    const songItems = document.querySelectorAll('.songitem');
    const songContainer = document.querySelector('.songitemcontainer') || document.querySelector('.song');

    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isSeeking = false;

    // Auto-scroll function with better error handling
    function scrollToCurrentSong(behavior = 'smooth') {
        console.log('Attempting to scroll to song index:', currentSongIndex);
        
        const currentSongElement = songItems[currentSongIndex];
        if (!currentSongElement) {
            console.warn('Current song element not found for index:', currentSongIndex);
            return;
        }
        
        if (!songContainer) {
            console.warn('Song container not found');
            return;
        }

        console.log('Scrolling to song:', songs[currentSongIndex].name);
        
        // Try multiple scroll methods for better compatibility
        try {
            // Method 1: scrollIntoView (modern browsers)
            currentSongElement.scrollIntoView({
                behavior: behavior,
                block: 'center',
                inline: 'nearest'
            });
        } catch (error) {
            console.warn('scrollIntoView failed, trying alternative method:', error);
            
            // Method 2: Manual scroll calculation (fallback)
            try {
                const containerRect = songContainer.getBoundingClientRect();
                const songRect = currentSongElement.getBoundingClientRect();
                const scrollTop = songContainer.scrollTop;
                const targetScrollTop = scrollTop + (songRect.top - containerRect.top) - (containerRect.height / 2) + (songRect.height / 2);
                
                songContainer.scrollTo({
                    top: targetScrollTop,
                    behavior: behavior
                });
            } catch (fallbackError) {
                console.error('All scroll methods failed:', fallbackError);
                // Method 3: Simple scroll (last resort)
                songContainer.scrollTop = currentSongElement.offsetTop - (songContainer.clientHeight / 2);
            }
        }
    }

    // Enhanced load song function with auto-scroll
    function loadSong(index, shouldScroll = true) {
        const song = songs[index];
        audioPlayer.src = song.src;
        currentSongImg.src = song.cover;
        currentSongImg.style.opacity = '1';

        // Update active song in list
        songItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        updateCurrentSongDisplay();
        
        // Auto-scroll to current song if requested
        if (shouldScroll) {
            // Add a small delay to ensure DOM updates are complete
            setTimeout(() => {
                console.log('Triggering auto-scroll for song:', song.name);
                scrollToCurrentSong();
            }, 150);
        }

        // Update total time display when metadata is loaded
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        }, { once: true });

        // Auto-play if player was playing
        if (isPlaying) {
            audioPlayer.play().catch(e => {
                console.log('Playback failed:', e);
            });
        }
    }

    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex, false); // Don't scroll on initial load
        updateCurrentSongDisplay();
        setupEventListeners();
    }

    // Update current song display
    function updateCurrentSongDisplay() {
        const song = songs[currentSongIndex];
        currentSongName.textContent = song.name;
        document.title = `${song.name} | SubbiFy`;
    }

    // Play/Pause functionality
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(e => {
                console.log('Playback failed:', e);
                alert('Unable to play audio. Please check if the audio file exists.');
            });
            isPlaying = true;
            updatePlayButtons(true);
            updatePlayButtonIcon(true);
        } else {
            audioPlayer.pause();
            isPlaying = false;
            updatePlayButtons(false);
            updatePlayButtonIcon(false);
        }
    }

    // Update play button states
    function updatePlayButtons(playing) {
        const playIcon = document.getElementById('play-icon');
        const playText = document.getElementById('play-text');

        if (playing) {
            playIcon.textContent = '⏸';
            playText.textContent = 'Pause';
        } else {
            playIcon.textContent = '▶';
            playText.textContent = 'Play';
        }
    }

    // Update play/pause button icon in bottom controls
    function updatePlayButtonIcon(playing) {
        if (playing) {
            playBtn.src = "assets/pause_circle.svg";
            playBtn.alt = "Pause song";
        } else {
            playBtn.src = "assets/play_circle.svg";
            playBtn.alt = "Play song";
        }
    }

    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update progress bar
    function updateProgress() {
        if (!isSeeking && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    // Seek functionality
    function setupSeekHandlers() {
        progressBar.addEventListener('input', () => {
            isSeeking = true;
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            currentTimeEl.textContent = formatTime(seekTime);
        });

        progressBar.addEventListener('change', () => {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
            isSeeking = false;
        });
    }

    // Next song with auto-scroll
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex, true); // Enable auto-scroll
        if (isPlaying) {
            audioPlayer.play().catch(e => console.log('Playback failed:', e));
        }
    }

    // Previous song with auto-scroll
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex, true); // Enable auto-scroll
        if (isPlaying) {
            audioPlayer.play().catch(e => console.log('Playback failed:', e));
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Button event listeners
        if (playBtn) playBtn.addEventListener('click', togglePlay);
        if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
        if (nextBtn) nextBtn.addEventListener('click', nextSong);
        if (prevBtn) prevBtn.addEventListener('click', prevSong);

        // Progress bar
        setupSeekHandlers();

        // Audio event listeners
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        // Song item click events with auto-scroll
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex, true); // Enable auto-scroll
                audioPlayer.play().catch(e => {
                    console.log('Playback failed:', e);
                    alert('Unable to play audio. Please check if the audio file exists.');
                });
                isPlaying = true;
                updatePlayButtons(true);
                updatePlayButtonIcon(true);
            });

            // Keyboard navigation with auto-scroll
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentSongIndex = index;
                    loadSong(currentSongIndex, true); // Enable auto-scroll
                    audioPlayer.play().catch(e => {
                        console.log('Playback failed:', e);
                        alert('Unable to play audio. Please check if the audio file exists.');
                    });
                    isPlaying = true;
                    updatePlayButtons(true);
                    updatePlayButtonIcon(true);
                }
            });
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        togglePlay();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextSong();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        prevSong();
                        break;
                    case 'KeyS':
                        // Press 'S' to scroll to current song manually
                        if (e.ctrlKey || e.metaKey) return; // Don't interfere with browser shortcuts
                        e.preventDefault();
                        scrollToCurrentSong();
                        break;
                }
            }
        });

        // Optional: Auto-scroll when window is resized (in case layout changes)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                scrollToCurrentSong('auto'); // Use 'auto' for instant scroll on resize
            }, 250);
        });
    }

    // Initialize the player
    initPlayer();
});
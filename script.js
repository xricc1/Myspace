/* ==========================================================================
   2005 RETRO MYSPACE INTERACTIVE SCRIPT
   - Cosmic Starfield / Pixel Particles Animation
   - Cursor Sparkle / Star Trail Effect
   - Simulated Flash Music Player Controls & Equalizer Animation
   - Interactive Comment System
   - Interactive Contact Buttons
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------------------------------------------
       0. Laser Sound Effects (Web Audio API Blaster Sound)
       ---------------------------------------------------------------------- */
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playLaserSound() {
        initAudioContext();
        if (!audioCtx) return;

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sawtooth";

            const now = audioCtx.currentTime;
            // Laser pitch frequency drop from 900Hz down to 100Hz
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.22);

            // Volume envelope
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {
            console.error("Laser sound play error:", e);
        }
    }

    // Attach laser sound effect to all clickable character elements
    const clickableCharacters = document.querySelectorAll(".character-clickable");
    clickableCharacters.forEach(el => {
        el.addEventListener("click", (e) => {
            playLaserSound();
        });
    });

    /* ----------------------------------------------------------------------
       1. Starfield / Pixel Black Hole Particles Background Canvas
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById("starfield-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Generate stars
        const stars = [];
        const numStars = 150;
        const colors = ["#00ffff", "#ff00ff", "#ffffff", "#ffaa00", "#0088ff"];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() < 0.2 ? 3 : (Math.random() < 0.5 ? 2 : 1),
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 0.2 + Math.random() * 0.8,
                alpha: Math.random(),
                alphaSpeed: 0.01 + Math.random() * 0.03
            });
        }

        function drawStarfield() {
            ctx.clearRect(0, 0, width, height);

            // Draw pixel stars
            stars.forEach(star => {
                star.alpha += star.alphaSpeed;
                if (star.alpha > 1 || star.alpha < 0.2) {
                    star.alphaSpeed = -star.alphaSpeed;
                }

                ctx.save();
                ctx.globalAlpha = Math.abs(star.alpha);
                ctx.fillStyle = star.color;
                // Render as retro square pixels
                ctx.fillRect(star.x, star.y, star.size, star.size);
                ctx.restore();

                // Gentle drift
                star.y += star.speed * 0.3;
                if (star.y > height) {
                    star.y = 0;
                    star.x = Math.random() * width;
                }
            });

            requestAnimationFrame(drawStarfield);
        }

        drawStarfield();
    }

    /* ----------------------------------------------------------------------
       2. Cursor Sparkle / Star Trail Effect
       ---------------------------------------------------------------------- */
    const cursorParticles = [];
    const particleColors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ffffff"];

    document.addEventListener("mousemove", (e) => {
        // Create 2 particles per mousemove for subtle 2005 cursor trail
        for (let i = 0; i < 2; i++) {
            const particle = document.createElement("div");
            particle.className = "cursor-particle";

            const size = Math.floor(Math.random() * 6) + 2;
            const color = particleColors[Math.floor(Math.random() * particleColors.length)];

            particle.style.position = "fixed";
            particle.style.pointerEvents = "none";
            particle.style.left = (e.clientX + (Math.random() * 12 - 6)) + "px";
            particle.style.top = (e.clientY + (Math.random() * 12 - 6)) + "px";
            particle.style.width = size + "px";
            particle.style.height = size + "px";
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            particle.style.zIndex = "99999";
            particle.style.transition = "transform 0.6s linear, opacity 0.6s linear";

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 + 10}px) scale(0)`;
                particle.style.opacity = "0";
            }, 10);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 650);
        }
    });

    /* ----------------------------------------------------------------------
       3. Web Audio Synthesizer Flash Music Player (Mandalorian Theme Motif)
       ---------------------------------------------------------------------- */
    const playBtn = document.getElementById("play-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const stopBtn = document.getElementById("stop-btn");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const trackTime = document.getElementById("track-time");
    const visualizer = document.querySelector(".visualizer");

    let isPlaying = false;
    let playbackSeconds = 0;
    const totalSeconds = 195; // 3:15
    let playerTimer = null;
    let themeSynthesizerInterval = null;

    // Mandalorian bass recorder / synth theme notes (frequencies in Hz)
    const mandoNotes = [
        146.83, 146.83, 164.81, 146.83, // D3, D3, E3, D3
        130.81, 146.83, 110.00,        // C3, D3, A2
        146.83, 146.83, 164.81, 146.83,
        174.61, 164.81, 146.83, 130.81
    ];
    let noteIndex = 0;

    function playMandoNote() {
        initAudioContext();
        if (!audioCtx || !isPlaying) return;

        try {
            const freq = mandoNotes[noteIndex % mandoNotes.length];
            noteIndex++;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            const now = audioCtx.currentTime;
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {
            console.error("Music synth note error:", e);
        }
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function updatePlayerUI() {
        trackTime.textContent = `${formatTime(playbackSeconds)} / ${formatTime(totalSeconds)}`;
        const percent = (playbackSeconds / totalSeconds) * 100;
        progressBar.style.width = `${percent}%`;
    }

    function playAudio() {
        initAudioContext();
        if (isPlaying) return;
        isPlaying = true;
        visualizer.classList.add("playing");
        playBtn.style.background = "#00ffff";
        playBtn.style.color = "#000";

        // Start real Web Audio melody synthesis
        themeSynthesizerInterval = setInterval(playMandoNote, 420);

        playerTimer = setInterval(() => {
            playbackSeconds++;
            if (playbackSeconds >= totalSeconds) {
                playbackSeconds = 0;
            }
            updatePlayerUI();
        }, 1000);
    }

    function pauseAudio() {
        if (!isPlaying) return;
        isPlaying = false;
        visualizer.classList.remove("playing");
        playBtn.style.background = "#223355";
        playBtn.style.color = "#fff";
        clearInterval(playerTimer);
        if (themeSynthesizerInterval) {
            clearInterval(themeSynthesizerInterval);
            themeSynthesizerInterval = null;
        }
    }

    function stopAudio() {
        pauseAudio();
        playbackSeconds = 0;
        noteIndex = 0;
        updatePlayerUI();
    }

    if (playBtn) playBtn.addEventListener("click", playAudio);
    if (pauseBtn) pauseBtn.addEventListener("click", pauseAudio);
    if (stopBtn) stopBtn.addEventListener("click", stopAudio);

    if (progressContainer) {
        progressContainer.addEventListener("click", (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickedPercent = clickX / width;
            playbackSeconds = Math.floor(clickedPercent * totalSeconds);
            updatePlayerUI();
        });
    }

    // Auto-start player on first user interaction or timeout
    const startAudioOnUserGesture = () => {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener("click", startAudioOnUserGesture);
    };
    document.addEventListener("click", startAudioOnUserGesture);

    setTimeout(() => {
        playAudio();
    }, 1200);

    /* ----------------------------------------------------------------------
       4. Interactive Comment Posting
       ---------------------------------------------------------------------- */
    const submitCommentBtn = document.getElementById("submit-comment-btn");
    const authorInput = document.getElementById("comment-author-input");
    const textInput = document.getElementById("comment-text-input");
    const commentsList = document.getElementById("comments-list");

    if (submitCommentBtn && commentsList) {
        submitCommentBtn.addEventListener("click", () => {
            const author = authorInput.value.trim() || "Anonym";
            const text = textInput.value.trim();

            if (!text) {
                alert("Prosím napiš nějaký text komentáře!");
                return;
            }

            const now = new Date();
            const dateStr = `${now.getDate()}. ${now.getMonth() + 1}. ${now.getFullYear()} v ${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

            const commentDiv = document.createElement("div");
            commentDiv.className = "comment-item";
            commentDiv.style.borderLeft = "3px solid #ff00ff";
            commentDiv.style.animation = "fadeIn 0.5s ease-in";

            commentDiv.innerHTML = `
                <div class="comment-author">
                    <strong>${escapeHTML(author)}</strong><br>
                    <span class="comment-date">${dateStr}</span>
                </div>
                <div class="comment-content">
                    <p>${escapeHTML(text)}</p>
                </div>
            `;

            commentsList.insertBefore(commentDiv, commentsList.firstChild);

            // Clear input
            textInput.value = "";
            alert("Tůj komentář byl úspěšně přidán na profil Mandaloriana!");
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    /* ----------------------------------------------------------------------
       5. Interactive Contact Box Buttons
       ---------------------------------------------------------------------- */
    const contactButtons = {
        "btn-send-msg": "Otevřeno okno pro zprávu: Napiš zprávu Mandalorianovi přes MySpace Mail.",
        "btn-add-friend": "Žádost o přátelství byla odeslána! Din Djarin posoudí tvoji žádost.",
        "btn-add-fav": "Din Djarin byl přidán do tvých oblíbených profilů!",
        "btn-block": "Uživatel byl přidán na tvůj list blokovaných účtů.",
        "btn-im": "MySpace IM Messenger: Připojování k chatu s Din Djarinem...",
        "btn-forward": "Odkaz na tento profil byl zkopírován do schránky pro tvé přátele!"
    };

    Object.keys(contactButtons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                alert(contactButtons[id]);
            });
        }
    });

});

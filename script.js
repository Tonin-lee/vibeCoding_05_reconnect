/**
 * Re:Connect Alumni Reunion Invitation Web Page
 * - Smooth Photo Carousel with Touch Swipe & Auto-play
 * - Real-time Live D-Day & Countdown Timer Animation
 * - 300x300 Naver-Style Changgyeonggung Interactive Map
 * - Calendar Integration, RSVP Guestbook, Ambient Audio & Petals
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Toast Notification Helper
     ========================================================================== */
  const toastEl = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  /* ==========================================================================
     2. [사진 섹션] Smooth Photo Carousel (부드러운 사진 넘기기)
     ========================================================================== */
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const dots = document.querySelectorAll('.dot-btn');
  const carouselContainer = document.getElementById('photoCarousel');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;
  const AUTO_SLIDE_INTERVAL = 4000;

  function updateCarousel(index, animate = true) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    if (track) {
      track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, AUTO_SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
      startAutoSlide();
    });
  });

  // Pause on mouse/touch hover
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Touch Swipe Gestures for Smartphone Screen
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    carouselContainer.addEventListener('touchstart', (e) => {
      stopAutoSlide();
      startX = e.touches[0].clientX;
      currentX = startX;
      isSwiping = true;
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const diffX = startX - currentX;
      const SWIPE_THRESHOLD = 45; // pixels

      if (diffX > SWIPE_THRESHOLD) {
        // Swipe left -> Next photo
        updateCarousel(currentIndex + 1);
      } else if (diffX < -SWIPE_THRESHOLD) {
        // Swipe right -> Previous photo
        updateCarousel(currentIndex - 1);
      }
      startAutoSlide();
    });
  }

  startAutoSlide();

  // Photo Lightbox Zoom
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    const title = slide.querySelector('.slide-title');
    if (img) {
      img.addEventListener('click', () => {
        if (!lightboxModal) return;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = title ? title.textContent : '';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      });
    }
  });

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* ==========================================================================
     3. [카운트다운 섹션] 실시간 카운트다운 애니메이션
     Target Date: 2032.10.1 (토) 오후 5시 (17:00:00 KST)
     ========================================================================== */
  // October is month index 9 in JavaScript Date (0-11)
  const TARGET_DATE = new Date(2032, 9, 1, 17, 0, 0).getTime();

  const dDayText = document.getElementById('dDayText');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

  function animateNumberChange(element, newValue) {
    if (!element) return;
    if (element.textContent !== newValue) {
      element.textContent = newValue;
      element.classList.add('tick');
      setTimeout(() => element.classList.remove('tick'), 200);
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance <= 0) {
      if (dDayText) dDayText.textContent = 'D-DAY 오늘입니다! 반갑습니다!';
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format numbers with leading zeros
    const strDays = String(days);
    const strHours = String(hours).padStart(2, '0');
    const strMins = String(minutes).padStart(2, '0');
    const strSecs = String(seconds).padStart(2, '0');

    // Update D-Day badge
    if (dDayText) {
      dDayText.textContent = `D - ${days.toLocaleString()}일 남음`;
    }

    // Dynamic tick animation
    animateNumberChange(cdDays, strDays);
    animateNumberChange(cdHours, strHours);
    animateNumberChange(cdMinutes, strMins);
    animateNumberChange(cdSeconds, strSecs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Calendar Event Button
  const addCalendarBtn = document.getElementById('addCalendarBtn');
  if (addCalendarBtn) {
    addCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent("Re:Connect 동창회");
      const details = encodeURIComponent("세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect 동창회에 초대합니다.");
      const location = encodeURIComponent("서울특별시 종로구 창경궁로 185 창경궁");
      // 2032-10-01 17:00 KST (UTC 08:00)
      const startDate = "20321001T080000Z";
      const endDate = "20321001T120000Z";
      
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
      showToast('구글 캘린더 등록 화면으로 이동합니다.');
    });
  }

  /* ==========================================================================
     4. [지도 섹션] 300x300 픽셀 크기 "창경궁" 네이버 위치 지도
     ========================================================================== */
  const CHANGGYEONGGUNG_LAT = 37.579617;
  const CHANGGYEONGGUNG_LNG = 126.991011;

  let map = null;

  function initMap() {
    const mapElement = document.getElementById('naver-map');
    if (!mapElement) return;

    // Check Leaflet is loaded
    if (typeof L === 'undefined') {
      console.warn('Leaflet library is still loading...');
      setTimeout(initMap, 200);
      return;
    }

    try {
      map = L.map('naver-map', {
        center: [CHANGGYEONGGUNG_LAT, CHANGGYEONGGUNG_LNG],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Positron / OSM tile layer (clean Korean labels and palace boundaries)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom Naver Green Marker Pin
      const naverPinIcon = L.divIcon({
        className: 'custom-naver-marker',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="
              background: #03C75A;
              color: #ffffff;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 3px 8px rgba(3, 199, 90, 0.4);
              white-space: nowrap;
              border: 1.5px solid #ffffff;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="background:#fff; color:#03C75A; font-weight:900; font-size:9px; padding:0 3px; border-radius:2px;">N</span>
              창경궁
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid #03C75A;
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([CHANGGYEONGGUNG_LAT, CHANGGYEONGGUNG_LNG], { icon: naverPinIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Pretendard', sans-serif; text-align:center; padding:4px;">
          <strong style="color:#03C75A; font-size:13px;">창경궁 (행사장)</strong><br>
          <span style="font-size:11px; color:#475569;">서울특별시 종로구 창경궁로 185</span><br>
          <a href="https://map.naver.com/p/search/%EC%B0%BD%EA%B2%BD%EA%B6%81" target="_blank" style="display:inline-block; margin-top:6px; font-size:11px; color:#03C75A; font-weight:600; text-decoration:none;">
            네이버 지도로 자세히 보기 &rarr;
          </a>
        </div>
      `);

      // Invalidate map size to make sure exactly 300x300 renders smoothly
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);

    } catch (err) {
      console.error('Map initialization error:', err);
    }
  }

  initMap();

  // Reset Center Button
  const resetMapCenterBtn = document.getElementById('resetMapCenterBtn');
  if (resetMapCenterBtn) {
    resetMapCenterBtn.addEventListener('click', () => {
      if (map) {
        map.flyTo([CHANGGYEONGGUNG_LAT, CHANGGYEONGGUNG_LNG], 16, { duration: 0.8 });
        showToast('창경궁 위치로 지도를 이동했습니다.');
      }
    });
  }

  // Copy Address Button
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      const address = "서울특별시 종로구 창경궁로 185";
      try {
        await navigator.clipboard.writeText(address);
        showToast('📋 주소가 클립보드에 복사되었습니다!');
      } catch (e) {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('📋 주소가 클립보드에 복사되었습니다!');
      }
    });
  }

  /* ==========================================================================
     5. RSVP & Guestbook LocalStorage System
     ========================================================================== */
  const rsvpForm = document.getElementById('rsvpForm');
  const guestbookList = document.getElementById('guestbookList');
  const STORAGE_KEY = 'reconnect_alumni_guestbook_v1';

  const defaultMessages = [
    { name: '김민수 (총무)', status: '참석', message: '벌써 2032년이 기대되네요! 다들 건강하게 꼭 봅시다!', date: '방금 전' },
    { name: '이지원 (반장)', status: '참석', message: '창경궁 가을 정취 느끼며 옛 추억 나누면 정말 좋겠어요. 무조건 갑니다!', date: '1시간 전' },
    { name: '박준혁', status: '일정 조율 중', message: '해외 출장 일정만 조율되면 바로 달려갈게요! 너무 보고 싶다 친구들아.', date: '3시간 전' }
  ];

  function getStoredMessages() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return defaultMessages;
  }

  function renderGuestbook() {
    if (!guestbookList) return;
    const list = getStoredMessages();
    guestbookList.innerHTML = list.map(item => `
      <div class="guest-card">
        <div class="guest-header">
          <span class="guest-name">${escapeHTML(item.name)}</span>
          <span class="guest-status ${item.status === '참석' ? '' : 'maybe'}">${escapeHTML(item.status)}</span>
        </div>
        <p class="guest-msg">${escapeHTML(item.message)}</p>
      </div>
    `).join('');
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  renderGuestbook();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
      const name = document.getElementById('guestName').value.trim();
      const message = document.getElementById('guestMessage').value.trim();

      if (!name || !message) {
        showToast('이름과 한마디 메시지를 입력해 주세요.');
        return;
      }

      const currentList = getStoredMessages();
      const newItem = {
        name: name,
        status: attendance,
        message: message,
        date: '방금 전'
      };

      currentList.unshift(newItem);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      } catch (err) {}

      renderGuestbook();
      rsvpForm.reset();
      showToast('🎉 참석 메시지가 등록되었습니다! 고마워요!');
    });
  }

  /* ==========================================================================
     6. Share Invitation Buttons
     ========================================================================== */
  const shareButtons = [document.getElementById('shareTopBtn'), document.getElementById('bottomShareBtn')];

  shareButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'Re:Connect 동창회 초대장',
        text: '세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect 동창회에 초대합니다! 2032.10.1 창경궁',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name !== 'AbortError') console.log(err);
        }
      }

      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 초대장 링크가 복사되었습니다!');
      } catch (e) {
        showToast('🔗 초대장 링크를 복사했습니다.');
      }
    });
  });

  /* ==========================================================================
     7. Ambient Web Audio BGM Synthesizer (소프트 감성 멜로디)
     - No external audio file dependency, works anywhere
     ========================================================================== */
  const bgmToggleBtn = document.getElementById('bgmToggleBtn');
  const bgmIcon = document.getElementById('bgmIcon');
  let audioCtx = null;
  let isPlayingAudio = false;
  let bgmInterval = null;

  const notes = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    493.88, // B4
    523.25, // C5
    440.00, // A4
    349.23  // F4
  ];

  function playWarmChime(freq, timeOffset = 0) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + timeOffset + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + timeOffset + 2.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + timeOffset);
      osc.stop(audioCtx.currentTime + timeOffset + 2.3);
    } catch (e) {}
  }

  function startBgmLoop() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let step = 0;
    const melodyPattern = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 261.63, 329.63, 392.00], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];

    function playChord() {
      if (!isPlayingAudio) return;
      const chord = melodyPattern[step % melodyPattern.length];
      chord.forEach((freq, idx) => {
        playWarmChime(freq, idx * 0.16);
      });
      step++;
    }

    playChord();
    bgmInterval = setInterval(playChord, 3200);
  }

  function stopBgmLoop() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  if (bgmToggleBtn) {
    bgmToggleBtn.addEventListener('click', () => {
      if (!isPlayingAudio) {
        isPlayingAudio = true;
        bgmToggleBtn.classList.add('playing');
        if (bgmIcon) bgmIcon.textContent = '🔊';
        startBgmLoop();
        showToast('🎵 잔잔한 배경음악이 재생됩니다.');
      } else {
        isPlayingAudio = false;
        bgmToggleBtn.classList.remove('playing');
        if (bgmIcon) bgmIcon.textContent = '🎵';
        stopBgmLoop();
        showToast('🔇 배경음악이 일시 중지되었습니다.');
      }
    });
  }

  /* ==========================================================================
     8. Floating Memory Petals Particle Canvas
     ========================================================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 3,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.4 + 0.2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.2
    }));

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = `rgba(255, 214, 230, ${p.opacity})`;
        ctx.beginPath();
        // Delicate petal oval
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

});

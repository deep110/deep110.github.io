window.onload = function () {
	document.getElementById("menu-icon").onclick = function () {
		document.body.classList.toggle("exp");
	};

	// setup things
	setTheme();
	carousel.init();
	videoPlayer.init();
};

function setTheme() {
	var themeToggleButton = document.getElementById("dark-theme-icon");
	if (localStorage.getItem("theme") === "dark") {
		themeToggleButton.setAttribute("title", "Switch to light theme");
	}
	themeToggleButton.onclick = function () {
		toggleTheme(this);
	}
};

function toggleTheme(themeButton) {
	var currentTheme = localStorage.getItem("theme");
	if (currentTheme == null || currentTheme == "light") {
		localStorage.setItem("theme", "dark");
		document.documentElement.setAttribute("theme", "dark");
		themeButton.setAttribute("title", "Switch to light theme");
	} else {
		localStorage.setItem("theme", "light");
		document.documentElement.removeAttribute("theme");
		themeButton.setAttribute("title", "Switch to dark theme");
	}
};

function loadFileAjaxSync(filePath, mimeType="application/json") {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	if (xmlhttp.overrideMimeType) {
		xmlhttp.overrideMimeType(mimeType);
	}
	xmlhttp.send();
	if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
		return xmlhttp.responseText;
	} else {
		return null;
	}
}

// add background to marker labels
function makeMarkerLabelBG(elem) {
	var svgns = "http://www.w3.org/2000/svg";
	var bounds = elem.getBBox();
	var bg = document.createElementNS(svgns, "rect");
	var style = getComputedStyle(elem);
	bg.setAttribute("x", bounds.x - parseInt(style["padding-left"]));
	bg.setAttribute("y", bounds.y - parseInt(style["padding-top"]));
	bg.setAttribute("width", bounds.width + parseInt(style["padding-left"]) + parseInt(style["padding-right"]));
	bg.setAttribute("height", bounds.height + parseInt(style["padding-top"]) + parseInt(style["padding-bottom"]));
	bg.setAttribute("fill", style["background-color"]);
	bg.setAttribute("rx", style["border-radius"]);
	bg.setAttribute("stroke-width", style["border-top-width"]);
	bg.setAttribute("stroke", style["border-top-color"]);
	if (elem.hasAttribute("transform")) {
		bg.setAttribute("transform", elem.getAttribute("transform"));
	}
	elem.parentNode.insertBefore(bg, elem);
};

// create a basic game loop controller to run simulations at target FPS
window.raf = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) { window.setTimeout(callback, 1000 / 60); };
})();

var GameLoopController = {
	loop: function (loopFunc, targetFps) {
		GameLoopController.toStop = false;
		window.raf(function (now) {
			var dt = now - GameLoopController.stamp || 0;
			GameLoopController.stamp = now;
			GameLoopController.timeElapsed += dt;

			var targetTime = (1 / targetFps) * 1000;
			if (GameLoopController.timeElapsed >= targetTime) {
				loopFunc(GameLoopController.timeElapsed);
				GameLoopController.timeElapsed -= targetTime;
			}
			if (!GameLoopController.toStop) {
				GameLoopController.loop(loopFunc, targetFps);
			}
		});
	},
	stop: function () {
		GameLoopController.toStop = true;
	},
	stamp: undefined,
	timeElapsed: 0,
	toStop: false,
};

class Vector2 {
	constructor(x, y) {
		this.x = (x === undefined) ? 0 : x;
		this.y = (y === undefined) ? 0 : y;
	}

	set(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	clone() {
		return new Vector2(this.x, this.y)
	}

	add(vector) {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	iadd(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	sub(vector) {
		return new Vector2(this.x - vector.x, this.y - vector.y);
	}

	isub(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	scale(scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	iscale(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
		return this;
	}

	dot(vector) {
		return (this.x * vector.x + this.y * vector.y);
	}

	cross(vector) {
		return (this.x * vector.y - vector.x * this.y);
	}

	moveTowards(vector, t) {
		// Linearly interpolates between vectors A and B by t.
		t = Math.min(t, 1);
		var diff = vector.sub(this);
		return this.add(diff.scale(t));
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	magnitudeSqr() {
		return (this.x * this.x + this.y * this.y);
	}

	setMagnitude(magnitude) {
		const length = this.magnitude();

		this.x = (this.x / length) * magnitude;
		this.y = (this.y / length) * magnitude;
	}

	distance(vector) {
		return Math.sqrt(this.distanceSqr(vector));
	}

	distanceSqr(vector) {
		var deltaX = this.x - vector.x;
		var deltaY = this.y - vector.y;
		return (deltaX * deltaX + deltaY * deltaY);
	}

	normalize() {
		var mag = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x /= mag;
		this.y /= mag;
		return this;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	rotate(alpha) {
		var cos = Math.cos(alpha);
		var sin = Math.sin(alpha);
		var vector = new Vector2();
		vector.x = this.x * cos - this.y * sin;
		vector.y = this.x * sin + this.y * cos;
		return vector;
	}

	limit(maxLength) {
		const length = this.magnitude();
		if (length > maxLength) {
			this.x = (this.x / length) * maxLength;
			this.y = (this.y / length) * maxLength;
		}
	}

	/**
	 * generates a random unit vector
	 */
	static random() {
		let randomAngle = MathUtil.randomFloat(0, MathUtil.PI2);
		return new Vector2(Math.cos(randomAngle), Math.sin(randomAngle));
	}
};

class MathUtil {
	static PI2 = 2 * Math.PI;

	/* random integer between min and max [excluded] */
	static randomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}

	/* random float between min and max [excluded] */
	static randomFloat(min, max) {
		return Math.random() * (max - min) + min
	}

	static toRadian(angleDeg) {
		return angleDeg * 0.0174533;
	}

	static toDegree(angleRad) {
		return angleRad * 57.2958;
	}
};

const carousel = function () {
	const getSlideWidth = (container) => 
		container.children[0].offsetWidth + parseInt(window.getComputedStyle(container).columnGap);

	const scrollToSlide = (container, slideNum) => {
		container.style.transform = `translateX(${-slideNum * getSlideWidth(container)}px)`;
	};

	const updateIndicators = (sliderElement, activeIndex) => {
		const indicators = sliderElement.querySelector(".carousel-indicators")?.children;
		if (!indicators || indicators.length <= 1) return;
		
		[...indicators].forEach((el, i) => el.classList.toggle("active", i === activeIndex));
	};

	const goToSlide = (container, sliderElement, slideNum) => {
		container.dataset.slideNum = slideNum;
		scrollToSlide(container, slideNum);
		updateIndicators(sliderElement, slideNum);
	};

	return {
		init(rootElement = document.body) {
			rootElement.querySelectorAll(".carousel").forEach(el => this.initSlider(el));
		},

		initSlider(sliderElement) {
			const container = sliderElement.querySelector(".carousel-list");
			const slideCount = container.children.length;
			const indicators = sliderElement.querySelector(".carousel-indicators");

			// Create indicators
			if (indicators && slideCount > 1) {
				indicators.innerHTML = Array(slideCount).fill().map((_, i) => 
					`<li${i === 0 ? ' class="active"' : ''}></li>`
				).join('');
				indicators.onclick = (e) => {
					if (e.target.tagName === 'LI') {
						const index = [...e.target.parentElement.children].indexOf(e.target);
						goToSlide(container, sliderElement, index);
					}
				};
			}

			container.dataset.slideNum = 0;

			// Navigation buttons
			sliderElement.querySelectorAll(".carousel-nav").forEach(nav => {
				const isNext = nav.classList.contains("carousel-nav-next");
				nav.onclick = () => {
					const current = +container.dataset.slideNum;
					const newSlide = isNext 
						? (current + 1) % slideCount 
						: current === 0 ? slideCount - 1 : current - 1;
					goToSlide(container, sliderElement, newSlide);
				};
			});

			// Touch/mouse drag
			const handleDrag = (e) => {
				const slideWidth = getSlideWidth(container);
				const slideIndex = +container.dataset.slideNum;
				const startPos = slideIndex * slideWidth;
				const startX = e.clientX || e.touches[0].clientX;
				const startY = e.clientY || e.touches[0].clientY;
				const startTime = performance.now();
				let deltaX = 0;

				const onMove = (e) => {
					deltaX = (e.clientX || e.touches[0].clientX) - startX;
					const deltaY = (e.clientY || e.touches[0].clientY) - startY;
					
					if (Math.abs(deltaY) > Math.abs(deltaX)) return; // Vertical scroll

					// Edge resistance
					const edgeLimit = 0.3 * slideWidth;
					if ((slideIndex === 0 && deltaX > edgeLimit) || 
						(slideIndex === slideCount - 1 && -deltaX > edgeLimit)) {
						deltaX = Math.sign(deltaX) * edgeLimit;
					}

					container.style.transform = `translateX(${-startPos + deltaX}px)`;
				};

				const onEnd = () => {
					container.removeEventListener('mousemove', onMove);
					container.removeEventListener('touchmove', onMove);

					const speed = Math.abs(deltaX) / (performance.now() - startTime);
					let newIndex = slideIndex;
					
					if (Math.abs(deltaX) > slideWidth / 2 || speed > 0.3) {
						newIndex = Math.max(0, Math.min(slideCount - 1, slideIndex - Math.sign(deltaX)));
					}

					goToSlide(container, sliderElement, newIndex);
				};

				container.addEventListener('mousemove', onMove, { passive: true });
				container.addEventListener('touchmove', onMove, { passive: true });
				document.addEventListener('mouseup', onEnd, { once: true });
				document.addEventListener('touchend', onEnd, { once: true });
			};

			container.addEventListener('mousedown', handleDrag, { passive: true });
			container.addEventListener('touchstart', handleDrag, { passive: true });
		}
	};
}();

const videoPlayer = function () {
	const formatTime = (timeInSeconds) => {
		const result = new Date(timeInSeconds * 1000).toISOString().substring(11, 19);
		return {
			minutes: result.substring(3, 5),
			seconds: result.substring(6, 8),
		};
	};

	const toggleIcons = (container) => {
		container.querySelectorAll('svg').forEach(icon => icon.classList.toggle('hidden'));
	};

	const updateTimeDisplay = (timeElement, seconds, includeDateTime = true) => {
		const time = formatTime(seconds);
		timeElement.textContent = `${time.minutes}:${time.seconds}`;
		if (includeDateTime) {
			timeElement.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
		}
	};

	const createVideoControls = () => `
		<div class="video-progress">
			<progress value="0" min="0"></progress>
			<input class="seek" value="0" min="0" type="range" step="1">
			<div class="seek-tooltip">00:00</div>
		</div>
		<div class="bottom-controls">
			<div class="left-controls">
				<button data-title="Play" class="control-button play-button">
					<svg viewBox="0 0 24 24">
						<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
					</svg>
					<svg class="hidden" viewBox="0 0 24 24">
						<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
					</svg>
				</button>
				<div class="volume-controls">
					<button data-title="Mute" class="control-button volume-button">
						<svg class="hidden" viewBox="0 0 24 24">
							<path d="M12 3.984v4.219L9.891 6.094zM4.266 3 21 19.734 19.734 21l-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9q0-2.391-1.383-4.219t-3.586-2.484V3.234q3.047.656 5.016 3.117T21 11.999q0 2.203-1.031 4.172l-1.5-1.547q.516-1.266.516-2.625zM16.5 12q0 .422-.047.609l-2.438-2.438V7.968q1.031.516 1.758 1.688T16.5 12z"/>
						</svg>
						<svg viewBox="0 0 24 24">
							<path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
						</svg>
					</button>
					<input class="volume" value="1" data-mute="0.5" type="range" max="1" min="0" step="0.01">
				</div>
				<div class="time">
					<time class="time-elapsed">00:00</time>
					<span> / </span>
					<time class="duration">00:00</time>
				</div>
			</div>
			<button data-title="Full screen" class="control-button fullscreen-button">
				<svg viewBox="0 0 24 24">
					<path d="M14.705 2.345h6.89v6.578h-2.731V4.952h-4.159V2.345Zm4.159 15.886v-3.972h2.731v6.577h-6.89v-2.605h4.159ZM2.224 8.922V2.344h6.891v2.607H4.954v3.971h-2.73Zm2.729 5.337v3.972h4.16v2.605h-6.89v-6.577h2.73Z"/>
				</svg>
				<svg class="hidden" viewBox="0 0 24 24">
					<path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"/>
				</svg>
			</button>
		</div>`;

	return {
		init: (rootElement = document.body) => 
			rootElement.querySelectorAll(".video-player").forEach(el => videoPlayer.initVideo(el)),

		initVideo(videoContainer) {
			const video = videoContainer.querySelector("video");
			
			// Create UI elements
			const elements = {
				startButton: Object.assign(document.createElement("button"), { className: "start-button" }),
				loader: Object.assign(document.createElement("div"), { className: "loader hidden" }),
				playbackAnimation: Object.assign(document.createElement("div"), { 
					className: "playback-icons",
					innerHTML: `
						<svg class="hidden" viewBox="0 0 24 24">
							<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
						</svg>
						<svg viewBox="0 0 24 24">
							<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
						</svg>`
				}),
				videoControls: Object.assign(document.createElement("div"), { 
					className: "video-controls hidden",
					innerHTML: createVideoControls()
				})
			};

			// Append elements
			Object.values(elements).forEach(el => videoContainer.appendChild(el));

			// Get control elements
			const controls = {
				playButton: elements.videoControls.querySelector(".play-button"),
				volumeButton: elements.videoControls.querySelector(".volume-button"),
				volumeInput: elements.videoControls.querySelector(".volume"),
				seek: elements.videoControls.querySelector(".seek"),
				seekTooltip: elements.videoControls.querySelector(".seek-tooltip"),
				progressBar: elements.videoControls.querySelector("progress"),
				duration: elements.videoControls.querySelector(".duration"),
				timeElapsed: elements.videoControls.querySelector(".time-elapsed"),
				fullscreenButton: elements.videoControls.querySelector(".fullscreen-button")
			};

			// Event handlers
			const handlers = {
				startVideo: () => {
					video.play();
					elements.startButton.classList.add("hidden");
					elements.loader.classList.remove("hidden");
					video.onclick = () => {
						elements.playbackAnimation.animate(
							[{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3)' }],
							{ duration: 500 }
						);
						toggleIcons(elements.playbackAnimation);
						handlers.togglePlay();
					};
				},

				updatePlayButton: () => {
					toggleIcons(controls.playButton);
					controls.playButton.setAttribute('data-title', video.paused ? 'Play' : 'Pause');
				},

				togglePlay: () => {
					video.paused || video.ended ? video.play() : video.pause();
				},

				initializeVideo: () => {
					const duration = Math.round(video.duration);
					controls.seek.max = controls.progressBar.max = duration;
					updateTimeDisplay(controls.duration, duration);
				},

				toggleControls: () => {
					if (video.readyState === 4 && video.paused && !video.ended) return;
					elements.videoControls.classList.toggle('hidden');
				},

				updateTime: () => {
					const currentTime = Math.round(video.currentTime);
					updateTimeDisplay(controls.timeElapsed, currentTime);
					controls.seek.value = controls.progressBar.value = currentTime;
				},

				updateVolumeIcon: () => {
					const isMuted = video.muted || video.volume === 0;
					controls.volumeButton.setAttribute('data-title', isMuted ? 'Unmute' : 'Mute');
					controls.volumeButton.children[0].classList.toggle('hidden', !isMuted);
					controls.volumeButton.children[1].classList.toggle('hidden', isMuted);
				},

				updateSeekTooltip: (e) => {
					if (video.readyState !== 4) return;
					const skipTo = Math.round((e.offsetX / e.target.clientWidth) * +e.target.max);
					controls.seek.setAttribute('data-seek', skipTo);
					updateTimeDisplay(controls.seekTooltip, skipTo, false);
					controls.seekTooltip.style.left = `${e.pageX - video.getBoundingClientRect().left}px`;
				},

				skipAhead: (e) => {
					const skipTo = e.target.dataset.seek || e.target.value;
					video.currentTime = controls.progressBar.value = controls.seek.value = skipTo;
				},

				handleVolume: () => {
					if (video.muted) video.muted = false;
					video.muted = +controls.volumeInput.value === 0;
					video.volume = controls.volumeInput.value;
				},

				toggleMute: () => {
					video.muted = !video.muted;
					if (video.muted) {
						controls.volumeInput.setAttribute('data-volume', controls.volumeInput.value);
						controls.volumeInput.value = 0;
					} else {
						if (video.volume === 0) {
							video.volume = 1;
							controls.volumeInput.dataset.volume = 1;
						}
						controls.volumeInput.value = controls.volumeInput.dataset.volume;
					}
				},

				toggleFullScreen: () => {
					const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
					if (isFullscreen) {
						(document.exitFullscreen || document.webkitExitFullscreen).call(document);
					} else {
						(videoContainer.requestFullscreen || videoContainer.webkitRequestFullscreen).call(videoContainer);
					}
				},

				handleFullscreenChange: () => {
					toggleIcons(controls.fullscreenButton);
					controls.fullscreenButton.setAttribute('data-title', 
						document.fullscreenElement ? 'Exit full screen' : 'Full screen');
				}
			};

			// Bind events
			elements.startButton.onclick = handlers.startVideo;
			controls.playButton.onclick = handlers.togglePlay;
			controls.seek.onmousemove = handlers.updateSeekTooltip;
			controls.seek.oninput = handlers.skipAhead;
			controls.volumeInput.oninput = handlers.handleVolume;
			controls.volumeButton.onclick = handlers.toggleMute;
			controls.fullscreenButton.onclick = handlers.toggleFullScreen;

			video.onplay = video.onpause = handlers.updatePlayButton;
			video.onloadedmetadata = handlers.initializeVideo;
			video.onloadeddata = () => elements.loader.classList.add("hidden");
			video.ontimeupdate = handlers.updateTime;
			video.onvolumechange = handlers.updateVolumeIcon;

			videoContainer.onmouseenter = videoContainer.onmouseleave = handlers.toggleControls;
			videoContainer.onfullscreenchange = handlers.handleFullscreenChange;
		}
	};
}();

const snackbar = function (msg, displayTime = 2000) {
	let toastDiv = document.getElementById("snackbar");
	if (toastDiv == null) {
		toastDiv = document.createElement("div");
		toastDiv.id = "snackbar";
		document.body.appendChild(toastDiv);
	}
	toastDiv.innerText = msg;
	toastDiv.className = "show";
	setTimeout(() => { toastDiv.classList.remove("show") }, displayTime);
}

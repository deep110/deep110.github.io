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
	return {
		init(rootElement = document.body) {
			for (let sliderElement of rootElement.querySelectorAll(".carousel")) {
				this.initSlider(sliderElement);
			}
		},

		initSlider(sliderElement) {
			const container = sliderElement.querySelector(".carousel-list");
			const slideCount = container.children.length;
			const carouselIndicator = sliderElement.querySelector(".carousel-indicators");

			if (carouselIndicator !== null && slideCount > 1) {
				for (var i = 0; i < slideCount; i++) {
					var indicatorChild = document.createElement("li");
					if (i == 0) {
						indicatorChild.classList.add("active");
					}
					carouselIndicator.appendChild(indicatorChild);
				}
				carouselIndicator.addEventListener("click", () => this.slideToByIndicator());
			}

			container.dataset.slideNum = 0;
			for (let navElement of sliderElement.querySelectorAll(".carousel-nav")) {
				let next = navElement.classList.contains("carousel-nav-next");
				navElement.addEventListener("click", () => {
					var newSlideNum = this.getNewSlideNum(container, next, slideCount);
					container.dataset.slideNum = newSlideNum;

					this.slide(container, newSlideNum);
					this.handleIndicators(sliderElement, newSlideNum);
				}, { passive: true });
			}

			// mouse drag
			container.addEventListener("mousedown", (e) => this.handleMouseDrag(e, sliderElement, container, slideCount), { passive: true });
			container.addEventListener("touchstart", (e) => this.handleMouseDrag(e, sliderElement, container, slideCount), { passive: true });
		},

		slide(container, newSlideNum) {
			const slides = container.children;
			const gapWidth = parseInt(window.getComputedStyle(container).columnGap);
			const scrollStep = slides[0].offsetWidth + gapWidth;

			this.scrollX(container, -1 * newSlideNum * scrollStep);
		},

		slideToByIndicator() {
			const indicator = window.event.target;
			const indicatorIndex = Array.from(indicator.parentElement.children).indexOf(indicator);

			const sliderElement = indicator.closest(".carousel");
			const container = sliderElement.querySelector(".carousel-list");
			const gapWidth = parseInt(window.getComputedStyle(container).columnGap);
			const scrollStep = container.children[0].offsetWidth + gapWidth;

			container.dataset.slideNum = indicatorIndex;
			this.scrollX(container, -1 * indicatorIndex * scrollStep);
			this.handleIndicators(sliderElement, indicatorIndex);
		},

		handleIndicators(sliderElement, newSlideNum) {
			let scrollIndicators = sliderElement.querySelector(".carousel-indicators").children;
			for (let element of scrollIndicators) element.classList.remove("active");
			if (scrollIndicators.length > 1) scrollIndicators[newSlideNum].classList.add("active");
		},

		scrollX(element, scrollFinalPosition) {
			element.style.transform = `translateX(${scrollFinalPosition}px)`;
		},

		getNewSlideNum(container, next, slideCount) {
			let currentSlideNum = parseInt(container.dataset.slideNum, 10);
			if (next) {
				currentSlideNum = (currentSlideNum + 1) % slideCount;
			} else {
				currentSlideNum = (currentSlideNum != 0) ? currentSlideNum - 1 : slideCount - 1;
			}
			return currentSlideNum;
		},

		handleMouseDrag(e, sliderElement, container, slideCount) {
			const slideWidth = container.children[0].offsetWidth + parseInt(window.getComputedStyle(container).columnGap);
			const slideIndex = parseInt(container.dataset.slideNum, 10);
			const startingPosition = slideIndex * slideWidth;
			const mouseDownStartingPosX = e.clientX || e.touches[0].clientX;
			const mouseDownStartingPosY = e.clientY || e.touches[0].clientY;
			const touchStartTime = window.performance.now();
			let mouseMovedPosition = 0;

			const moveProgress = (e) => {
				mouseMovedPosition = (e.clientX || e.touches[0].clientX) - mouseDownStartingPosX;
				// don't move if vertical scroll
				if (Math.abs((e.clientY || e.touches[0].clientY) - mouseDownStartingPosY) > Math.abs(mouseMovedPosition)) {
					return;
				}
				const edgeLimit = 0.3;
				if (slideIndex == 0 && mouseMovedPosition > edgeLimit * slideWidth) {
					mouseMovedPosition = edgeLimit * slideWidth;
				}
				if (slideIndex == (slideCount - 1) && (-1 * mouseMovedPosition) > edgeLimit * slideWidth) {
					mouseMovedPosition = -1 * edgeLimit * slideWidth;
				}
				const scrollFinalPosition = -1 * startingPosition + mouseMovedPosition;
				container.style.transform = `translateX(${scrollFinalPosition}px)`;
			};

			const moveEnd = () => {
				container.removeEventListener('mousemove', moveProgress);
				container.removeEventListener('touchmove', moveProgress);

				const moveSpeed = Math.abs(mouseMovedPosition)/ (window.performance.now() - touchStartTime);
				let newSlideIndex = slideIndex;
				if (Math.abs(mouseMovedPosition) > slideWidth / 2 || moveSpeed > 0.3) {
					newSlideIndex = slideIndex - Math.sign(mouseMovedPosition);
					if (newSlideIndex < 0) newSlideIndex = 0;
					if (newSlideIndex == slideCount) newSlideIndex = slideCount - 1;
				}

				// scroll to chosen slide
				this.scrollX(container, -1 * newSlideIndex * slideWidth);
				this.handleIndicators(sliderElement, newSlideIndex);
				container.dataset.slideNum = newSlideIndex;
			};

			container.addEventListener('mousemove', moveProgress, { passive: true });
			container.addEventListener('touchmove', moveProgress, { passive: true });
			document.addEventListener('mouseup', moveEnd, { once: true, passive: true });
			document.addEventListener('touchend', moveEnd, { once: true, passive: true });
		}
	};
}();

const videoPlayer = function () {
	return {
		init(rootElement = document.body) {
			for (let videoElement of rootElement.querySelectorAll(".video-player")) {
				this.initVideo(videoElement);
			}
		},
		initVideo(videoContainer) {
			const video = videoContainer.querySelector("video");
			const startButton = document.createElement("button");
			const loader = document.createElement("div");
			const playbackAnimation = document.createElement("div");
			const videoControls = document.createElement("div");

			startButton.classList.add("start-button");
			videoContainer.appendChild(startButton);

			loader.classList.add("loader");
			loader.classList.add("hidden");
			videoContainer.appendChild(loader);

			playbackAnimation.classList.add("playback-icons");
			playbackAnimation.innerHTML = `
				<svg class="hidden" viewBox="0 0 24 24">
					<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
				</svg>
				<svg viewBox="0 0 24 24">
					<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
				</svg>`;
			videoContainer.appendChild(playbackAnimation);

			videoControls.classList.add("video-controls");
			videoControls.classList.add("hidden");
			videoControls.innerHTML = `
				<div class="video-progress">
					<progress value="0" min="0"></progress>
					<input class="seek" id="seek" value="0" min="0" type="range" step="1">
					<div class="seek-tooltip" id="seek-tooltip">00:00</div>
				</div>
				<div class="bottom-controls">
					<div class="left-controls">
						<button data-title="Play" id="play-button" class="control-button">
							<svg viewBox="0 0 24 24">
								<path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
							</svg>
							<svg class="hidden" viewBox="0 0 24 24">
								<path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
							</svg>
						</button>

						<div class="volume-controls">
							<button data-title="Mute" class="control-button" id="volume-button">
								<svg class="hidden" viewBox="0 0 24 24">
									<path d="M12 3.984v4.219L9.891 6.094zM4.266 3 21 19.734 19.734 21l-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9q0-2.391-1.383-4.219t-3.586-2.484V3.234q3.047.656 5.016 3.117T21 11.999q0 2.203-1.031 4.172l-1.5-1.547q.516-1.266.516-2.625zM16.5 12q0 .422-.047.609l-2.438-2.438V7.968q1.031.516 1.758 1.688T16.5 12z"/>
								</svg>
								<svg viewBox="0 0 24 24">
									<path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
								</svg>
							</button>
							<input class="volume" id="volume-input" value="1" data-mute="0.5" type="range" max="1" min="0" step="0.01">
						</div>

						<div class="time">
							<time id="time-elapsed">00:00</time>
							<span> / </span>
							<time id="duration">00:00</time>
						</div>
					</div>

					<button data-title="Full screen" class="control-button fullscreen-button" id="fullscreen-button">
						<svg id="fullscreen" viewBox="0 0 24 24">
							<path d="M14.705 2.345h6.89v6.578h-2.731V4.952h-4.159V2.345Zm4.159 15.886v-3.972h2.731v6.577h-6.89v-2.605h4.159ZM2.224 8.922V2.344h6.891v2.607H4.954v3.971h-2.73Zm2.729 5.337v3.972h4.16v2.605h-6.89v-6.577h2.73Z"/>
						</svg>
						<svg id="fullscreen-exit" class="hidden" viewBox="0 0 24 24">
							<path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"/>
						</svg>
					</button>
        		</div>`;

			videoContainer.appendChild(videoControls);

			const playButton = videoControls.querySelector("#play-button");
			const volumeButton = videoControls.querySelector("#volume-button");
			const volumeInput = videoControls.querySelector("#volume-input");
			const seek = videoControls.querySelector("#seek");
			const seekTooltip = videoControls.querySelector("#seek-tooltip");
			const progressBar = videoControls.querySelector("progress");
			const duration = videoControls.querySelector("#duration");
			const timeElapsed = videoControls.querySelector("#time-elapsed");
			const fullscreenButton = videoControls.querySelector("#fullscreen-button");

			startButton.addEventListener("click", () => {
				video.play();
				startButton.classList.add("hidden");
				loader.classList.remove("hidden");
				video.addEventListener("click", () => {
					this.animatePlayback(playbackAnimation);
					this.togglePlay(video);
				});
			});

			video.addEventListener('play', () => this.updatePlayButton(video, playButton));
			video.addEventListener('pause', () => this.updatePlayButton(video, playButton));
			video.addEventListener('loadedmetadata', () => this.initializeVideo(video, seek, progressBar, duration));
			video.addEventListener('loadeddata', () => { loader.classList.add("hidden"); });
			video.addEventListener('timeupdate', () => this.videoTimerUpdate(video, timeElapsed, seek, progressBar));
			video.addEventListener('volumechange', () => this.updateVolumeIcon(video, volumeButton));
			videoContainer.addEventListener('mouseenter', () => this.toggleControls(videoControls, video));
			videoContainer.addEventListener('mouseleave', () => this.toggleControls(videoControls, video));

			playButton.addEventListener("click", () => this.togglePlay(video));
			seek.addEventListener('mousemove', (e) => this.updateSeekTooltip(e, video, seek, seekTooltip));
			seek.addEventListener('input', (e) => this.skipAhead(e, video, progressBar, seek));
			volumeInput.addEventListener('input', () => {
				if (video.muted) video.muted = false;
				if (volumeInput.value == 0) video.muted = true;
				video.volume = volumeInput.value;
			});
			volumeButton.addEventListener('click', () => this.toggleMute(video, volumeInput));
			fullscreenButton.addEventListener('click', () => this.toggleFullScreen(videoContainer));
			videoContainer.addEventListener('fullscreenchange', () => {
				fullscreenButton.querySelectorAll('svg').forEach((icon) => icon.classList.toggle('hidden'));
				if (document.fullscreenElement) {
					fullscreenButton.setAttribute('data-title', 'Exit full screen');
				} else {
					fullscreenButton.setAttribute('data-title', 'Full screen');
				}
			});
		},
		animatePlayback(element) {
			element.animate(
				[{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3)' }],
				{ duration: 500 }
			);
			element.querySelectorAll('svg').forEach((icon) => icon.classList.toggle('hidden'));
		},
		updatePlayButton(video, playButton) {
			playButton.querySelectorAll('svg').forEach((icon) => icon.classList.toggle('hidden'));
			if (video.paused) {
				playButton.setAttribute('data-title', 'Play');
			} else {
				playButton.setAttribute('data-title', 'Pause');
			}
		},
		togglePlay(video) {
			if (video.paused || video.ended) {
				video.play();
			} else {
				video.pause();
			}
		},
		initializeVideo(video, seek, progressBar, duration) {
			const videoDuration = Math.round(video.duration);
			seek.setAttribute('max', videoDuration);
			progressBar.setAttribute('max', videoDuration);
			const time = this.__formatTime(videoDuration);
			duration.innerText = `${time.minutes}:${time.seconds}`;
			duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
		},
		toggleControls(videoControls, video) {
			if (video.readyState == 4 && (video.paused && !video.ended)) {
				return;
			}
			videoControls.classList.toggle('hidden');
		},
		videoTimerUpdate(video, timeElapsed, seek, progressBar) {
			const currTime = Math.round(video.currentTime);
			const formattedTime = this.__formatTime(currTime);
			timeElapsed.innerText = `${formattedTime.minutes}:${formattedTime.seconds}`;
			timeElapsed.setAttribute('datetime', `${formattedTime.minutes}m ${formattedTime.seconds}s`);
			seek.value = Math.round(currTime);
			progressBar.value = Math.round(currTime);
		},
		updateVolumeIcon(video, volumeButton) {
			if (video.muted || video.volume === 0) {
				volumeButton.setAttribute('data-title', 'Unmute');
				volumeButton.children[0].classList.remove('hidden');
				volumeButton.children[1].classList.add('hidden');
			} else {
				volumeButton.setAttribute('data-title', 'Mute');
				volumeButton.children[0].classList.add('hidden');
				volumeButton.children[1].classList.remove('hidden');
			}
		},
		updateSeekTooltip(event, video, seek, seekTooltip) {
			if (video.readyState != 4) return;
			const skipTo = Math.round(
				(event.offsetX / event.target.clientWidth) *
				parseInt(event.target.getAttribute('max'), 10)
			);
			seek.setAttribute('data-seek', skipTo);
			const t = this.__formatTime(skipTo);
			seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
			const rect = video.getBoundingClientRect();
			seekTooltip.style.left = `${event.pageX - rect.left}px`;
		},
		skipAhead(event, video, progressBar, seek) {
			const skipTo = event.target.dataset.seek
				? event.target.dataset.seek
				: event.target.value;
			video.currentTime = skipTo;
			progressBar.value = skipTo;
			seek.value = skipTo;
		},
		toggleMute(video, volume) {
			video.muted = !video.muted;
			if (video.muted) {
				volume.setAttribute('data-volume', volume.value);
				volume.value = 0;
			} else {
				if (video.volume == 0) {
					video.volume = 1;
					volume.dataset.volume = 1;
				}
				volume.value = volume.dataset.volume;
			}
		},
		toggleFullScreen(videoContainer) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else if (document.webkitFullscreenElement) { // safari
				document.webkitExitFullscreen();
			} else if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.webkitRequestFullscreen) { // safari
				videoContainer.webkitRequestFullscreen();
			}
		},
		__formatTime(timeInSeconds) {
			const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
			return {
				minutes: result.substr(3, 2),
				seconds: result.substr(6, 2),
			};
		},
	}
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

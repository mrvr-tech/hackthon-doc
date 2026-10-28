const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const hero = document.querySelector(".hero");
const ideaForm = document.querySelector("#idea-form");
const ideaInput = document.querySelector("#idea-prompt");
const demoNote = document.querySelector("#demo-note");
const modeButtons = document.querySelectorAll(".mode-button");
const codeMode = document.querySelector("#code-mode");
const heroModeName = document.querySelector("#hero-mode-name");
const typewriterText = document.querySelector("#typewriter-text");
const workspaceMode = document.querySelector("#workspace-mode");
const terminalCommand = document.querySelector(".terminal-command");
const terminalInfo = document.querySelectorAll(".terminal-info");
const videoDialog = document.querySelector("#intro-preview");
const videoPreviewTrigger = document.querySelector(".video-preview-trigger");
const videoPreviewClose = document.querySelector(".video-dialog-close");
const introPreviewVideo = document.querySelector(".intro-preview-video");
const heroVideo = document.querySelector(".hero-video");
const videoDialogStatus = document.querySelector(".video-dialog-status");

const modes = {
  manual: {
    label: "Manual Coding",
    command: "buildtri dev --mode manual",
    description: "Manual workflow ready · Full control stays with you",
  },
  vibe: {
    label: "Vibe Coding",
    command: "buildtri dev --mode vibe",
    description: "Vibe workflow ready · Explore a first draft with AI",
  },
  hybrid: {
    label: "Hybrid Coding",
    command: "buildtri dev --mode hybrid",
    description: "Hybrid workflow ready · Human-guided AI build",
  },
};

let selectedMode = "hybrid";

if (typewriterText) {
  const phrases = ["something real.", "a working app.", "your first build."];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    let phraseIndex = 0;
    window.setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typewriterText.textContent = phrases[phraseIndex];
    }, 4000);
  } else {
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;

    function animateTypewriter() {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      typewriterText.textContent = phrase.slice(0, characterIndex);

      let delay = deleting ? 48 : 78;
      if (characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 380;
      } else if (characterIndex === phrases[phraseIndex].length) {
        deleting = true;
        delay = 1650;
      }

      window.setTimeout(animateTypewriter, delay);
    }

    window.setTimeout(animateTypewriter, 1650);
  }
}

function renderMode(mode) {
  selectedMode = mode;
  const selected = modes[mode];

  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  codeMode.textContent = mode;
  heroModeName.textContent = selected.label;
  workspaceMode.textContent = selected.label.replace(" Coding", "");
  terminalCommand.lastChild.textContent = ` ${selected.command}`;
  terminalInfo[0].textContent = selected.description;
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => renderMode(button.dataset.mode));
});

videoPreviewTrigger.addEventListener("click", () => {
  if (!videoDialog.showModal) {
    videoDialogStatus.textContent = "Your browser does not support the video preview dialog.";
    return;
  }

  videoDialogStatus.textContent = "";
  heroVideo.pause();
  videoDialog.showModal();
  introPreviewVideo.currentTime = 0;
  introPreviewVideo.play().catch(() => {
    videoDialogStatus.textContent = "Press play on the video controls to start the preview.";
  });
});

function closeVideoPreview() {
  introPreviewVideo.pause();
  videoDialog.close();
  videoPreviewTrigger.focus();

  heroVideo.play().catch(() => {
    demoNote.lastChild.textContent = " Background video did not resume automatically. Reload the page to replay it.";
  });
}

videoPreviewClose.addEventListener("click", closeVideoPreview);

videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) {
    closeVideoPreview();
  }
});

videoDialog.addEventListener("close", () => {
  introPreviewVideo.pause();
});

videoDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVideoPreview();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  hero.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    hero.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoDialog.open) {
    event.preventDefault();
    closeVideoPreview();
    return;
  }

  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    navigation.classList.remove("is-open");
    hero.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.focus();
  }
}, true);

ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = ideaInput.value.trim();

  if (!idea) {
    demoNote.lastChild.textContent = " Enter a command to preview how BuildTri might display it.";
    ideaInput.focus();
    return;
  }

  terminalCommand.lastChild.textContent = ` ${idea}`;
  terminalInfo[0].textContent = `${selectedMode[0].toUpperCase()}${selectedMode.slice(1)} mode · Command preview only`;
  terminalInfo[1].textContent = "No command was executed. This is a front-end demonstration.";
  demoNote.lastChild.textContent = " COMMAND DISPLAYED LOCALLY · NOTHING WAS EXECUTED";
});

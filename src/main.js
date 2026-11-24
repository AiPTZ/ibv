const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");
const toggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-form]");
const progress = document.querySelector("[data-progress]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (nav && progress) {
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    },
    { passive: true }
  );
}

if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.querySelector("span").textContent = "+";
  };

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.querySelector("span").textContent = open ? "×" : "+";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

document.querySelectorAll(".magnetic").forEach((el) => {
  if (!finePointer || reduce) return;
  el.addEventListener("pointermove", (event) => {
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.12;
    const y = (event.clientY - box.top - box.height / 2) * 0.12;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "translate(0, 0)";
  });
});

const revealNodes = document.querySelectorAll(
  ".method-card, .program, .ecosystem, .contact-form-wrap, .family-card, .tech-card, .result-card, .pain-item, .audience-item, .proposal-card, .sg-figure, .emphasis"
);
revealNodes.forEach((node, index) => {
  node.classList.add("reveal-on");
  node.style.transitionDelay = `${Math.min(index % 6, 5) * 40}ms`;
});

if (!reduce && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-in"));
}

const programSelect = document.querySelector("[data-programa]");
if (programSelect) {
  const wanted = new URLSearchParams(window.location.search).get("programa");
  if (wanted) {
    const option = Array.from(programSelect.options).find((item) => item.value === wanted);
    if (option) programSelect.value = wanted;
  }
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = form.querySelector("[data-error]");
    const ok = form.querySelector("[data-ok]");
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const required = ["nome", "empresa", "cargo", "email", "telefone", "desafio"];
    if (form.querySelector("[data-programa]")) required.push("programa");

    const filled = required.every((key) => String(data.get(key) || "").trim());
    const corporate = /.+@.+\..+/.test(email) && !/(gmail|hotmail|yahoo|outlook)\./i.test(email);

    error.hidden = true;
    ok.hidden = true;

    if (!filled || !corporate) {
      error.hidden = false;
      return;
    }

    ok.hidden = false;
    form.reset();
  });
}

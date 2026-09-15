// Renderiza blocos ```mermaid``` no cliente. O Shiki (highlighter padrão do
// Astro) não conhece "mermaid" como linguagem, então o bloco chega ao
// browser como <pre data-language="mermaid"><code>texto do diagrama</code></pre>.
const blocks = document.querySelectorAll('pre[data-language="mermaid"]');
if (blocks.length > 0) {
  const { default: mermaid } = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark" ||
    (!document.documentElement.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);

  mermaid.initialize({ startOnLoad: false, theme: isDark() ? "dark" : "default" });

  let i = 0;
  for (const block of blocks) {
    const code = block.textContent ?? "";
    const { svg } = await mermaid.render(`mermaid-${i++}`, code);
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid-diagram";
    wrapper.innerHTML = svg;
    block.replaceWith(wrapper);
  }
}

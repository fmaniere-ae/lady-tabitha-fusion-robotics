const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const CONTENT_PATH = "public/content/pages/home.md";
const LAYOUT_PATH = "public/layout.html";
const OUTPUT_PATH = "public/index.html";

/* ---------- helpers ---------- */

function renderSection(section) {
  switch (section.type) {
    case "text":
      return `
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-indigo-600 mb-4">
            ${section.title}
          </h2>
          <div class="prose prose-lg">
            ${marked.parse(section.content || "")}
          </div>
        </section>
      `;

    case "features":
      return `
        <section class="mb-16">
          <h2 class="text-3xl font-bold text-indigo-600 mb-8">
            ${section.title}
          </h2>
          <ul class="grid md:grid-cols-3 gap-6">
            ${section.items
              .map(
                item => `
                <li class="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
                  <p class="text-lg font-semibold text-slate-700">
                    ${item}
                  </p>
                </li>`
              )
              .join("")}
          </ul>
        </section>
      `;

    case "program":
    return `
        <section class="mb-16">
        <h2 class="text-3xl font-bold text-indigo-600 mb-8">
            ${section.title}
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
            ${section.levels
            .map(
                level => `
                <div class="bg-white rounded-xl shadow p-6">
                    <h3 class="text-2xl font-semibold text-indigo-500 mb-2">
                    ${level.name}
                    </h3>

                    <p class="mb-2">
                    <strong>Parcours :</strong> ${level.parcours}
                    </p>

                    <p>
                    <strong>Projets :</strong> ${level.projets}
                    </p>
                </div>
                `
            )
            .join("")}
        </div>
        </section>
    `;

    default:
      return "";
  }
}

/* ---------- build ---------- */

function buildHome() {
  const rawMd = fs.readFileSync(CONTENT_PATH, "utf8");
  const layout = fs.readFileSync(LAYOUT_PATH, "utf8");

  const { data } = matter(rawMd);

  const htmlSections = data.sections
    .map(section => renderSection(section))
    .join("");

  const finalHtml = layout.replace("{{content}}", htmlSections);

  fs.writeFileSync(OUTPUT_PATH, finalHtml);

  console.log("✅ Home page built successfully");
}

buildHome();

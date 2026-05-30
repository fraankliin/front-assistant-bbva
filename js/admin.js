const user =
    JSON.parse(
        localStorage.getItem("user")
    );

if (user) {

    document.getElementById(
        "userEmail"
    ).textContent =
        user.email;
}

document
.getElementById(
    "logoutBtn"
)
.addEventListener(
    "click",
    logout
);

async function loadDashboard() {

    try {

        const response =
            await apiFetch(
                "/analytics/dashboard"
            );

        const data =
            await response.json();

        renderOverview(
            data.overview
        );

    } catch (error) {

        console.error(error);
    }
}

function renderOverview(
    overview
) {

    document.getElementById(
        "overviewMetrics"
    ).innerHTML = `

        <p>
             Documentos:
            <strong>
                ${overview.system_indexed_documents}
            </strong>
        </p>

        <br>

        <p>
             Chunks:
            <strong>
                ${overview.system_indexed_chunks}
            </strong>
        </p>

        <br>

        <p>
             Conversaciones:
            <strong>
                ${overview.your_total_conversations}
            </strong>
        </p>
    `;
}

document
.getElementById(
    "runScraperBtn"
)
.addEventListener(
    "click",
    runScraper
);

async function runScraper() {

    const result =
        document.getElementById(
            "scraperResult"
        );

    result.innerHTML =
        " Ejecutando indexación...";

    try {

        const response =
            await apiFetch(
                "/scraper/trigger",
                {
                    method: "POST"
                }
            );

        const data =
            await response.json();

        result.innerHTML = `
             ${data}
        `;

        addLog(
            "Scraping ejecutado manualmente."
        );

    } catch (error) {

        result.innerHTML =
            " Error al ejecutar.";

        console.error(error);
    }
}

function addLog(message) {

    const logs =
        document.getElementById(
            "logs"
        );

    const now =
        new Date()
        .toLocaleTimeString();

    logs.innerHTML =
        `
        <div>
            [${now}] ${message}
        </div>
        ` +
        logs.innerHTML;
}

loadDashboard();
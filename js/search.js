const token =
    localStorage.getItem(
        "access_token"
    );

if (!token) {

    window.location.href =
        "../login.html";
}

const user =
    JSON.parse(
        localStorage.getItem(
            "user"
        )
    );

document
.getElementById(
    "userEmail"
)
.textContent =
    user.email;

document
.getElementById(
    "logoutBtn"
)
.addEventListener(
    "click",
    logout
);

document
.getElementById(
    "searchForm"
)
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        searchChunks();
    }
);

async function searchChunks() {

    const query =
        document
        .getElementById(
            "queryInput"
        )
        .value;

    const limit =
        document
        .getElementById(
            "limitInput"
        )
        .value;

    const threshold =
        document
        .getElementById(
            "thresholdInput"
        )
        .value;

    const response =
        await apiFetch(
            `/search/test?query=${encodeURIComponent(query)}&limit=${limit}&threshold=${threshold}`
        );

    const data =
        await response.json();

    renderResults(data);
}

function renderResults(data) {

    document
    .getElementById(
        "resultsInfo"
    )
    .innerHTML = `
        <p>
            ${data.total_recovered}
            chunks recuperados
        </p>
    `;

    const container =
        document
        .getElementById(
            "results"
        );

    container.innerHTML = "";

    data.chunks_recovered
    .forEach(chunk => {

        const similarity =
            (
                chunk.similarity * 100
            ).toFixed(1);

        container.innerHTML += `

        <div class="result-card">

            <div class="score">

                ${similarity}%

            </div>

            <div class="headers">

                <h3>
                    ${
                        chunk.metadata
                        ?.structural_headers
                        ?.["Header 1"]
                        || "Documento"
                    }
                </h3>

                <p>
                    ${
                        chunk.metadata
                        ?.structural_headers
                        ?.["Header 2"]
                        || ""
                    }
                </p>

                <small>
                    ${
                        chunk.metadata
                        ?.structural_headers
                        ?.["Header 3"]
                        || ""
                    }
                </small>

            </div>

            <div class="chunk-text">

                ${chunk.chunk_text}

            </div>

            <a
                href="${chunk.metadata.source_url}"
                target="_blank"
            >
                Ver fuente
            </a>

        </div>

        `;
    });
}
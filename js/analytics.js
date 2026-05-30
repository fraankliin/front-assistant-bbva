async function loadAnalytics() {

    const response =
        await apiFetch(
            "/analytics/dashboard"
        );

    const data =
        await response.json();

    renderOverview(data);
    renderBehavior(data);
    renderPerformance(data);
    renderDocuments(data);
    renderQueries(data);
    renderChunks(data);
}

function renderOverview(data) {

    const overview =
        data.overview;

    document.getElementById(
        "overviewCards"
    ).innerHTML = `

        <div class="kpi-card">
            <h4> Conversaciones</h4>
            <span>
                ${overview.your_total_conversations}
            </span>
        </div>

        <div class="kpi-card">
            <h4> Mensajes</h4>
            <span>
                ${overview.your_total_messages_sent_and_received}
            </span>
        </div>

        <div class="kpi-card">
            <h4> Documentos</h4>
            <span>
                ${overview.system_indexed_documents}
            </span>
        </div>

        <div class="kpi-card">
            <h4> Chunks</h4>
            <span>
                ${overview.system_indexed_chunks}
            </span>
        </div>
    `;
}

function renderBehavior(data) {

    const behavior =
        data.your_conversation_behavior;

    document.getElementById(
        "behavior"
    ).innerHTML = `

        <p>
            Promedio por conversación:
            <strong>
                ${behavior.your_average_messages_per_conversation}
            </strong>
        </p>

        <br>

        ${behavior.your_longest_conversations
            .map(conv => `
                <p>
                    ${conv.total_messages}
                    mensajes
                </p>
            `)
            .join("")}
    `;
}

function renderPerformance(data) {

    const perf =
        data.ai_performance_experienced;

    const rag =
        data.your_rag_interest_metrics;

    document.getElementById(
        "performance"
    ).innerHTML = `

        <p>
            
            ${perf.average_response_time_seconds}
            segundos
        </p>

        <p>
            
            ${(rag.average_context_similarity_score * 100).toFixed(2)}
            %
        </p>
    `;
}

function renderDocuments(data) {

    const docs =
        data.your_rag_interest_metrics
            .your_most_consulted_banking_documents;

    document.getElementById(
        "documents"
    ).innerHTML =
        docs.map(doc => `
            <div class="list-item">
                <strong>
                    ${doc.document_title}
                </strong>

                <span>
                    ${doc.usages}
                    usos
                </span>
            </div>
        `).join("");
}

function renderQueries(data) {

    const queries =
        data.your_top_queries
            .most_frequent_queries_top_5;

    document.getElementById(
        "queries"
    ).innerHTML =
        queries.map(query => `
            <div class="query-card">

                <p>
                    ${query.query}
                </p>

                <small>
                    ${query.frequency}
                    veces
                </small>

            </div>
        `).join("");
}

function renderChunks(data) {

    const chunks =
        data.your_rag_interest_metrics
            .your_most_retrieved_chunks;

    document.getElementById(
        "chunks"
    ).innerHTML =
        chunks.map(chunk => `

            <details>

                <summary>
                    Chunk recuperado
                </summary>

                <p>
                    ${chunk.chunk_snippet}
                </p>

            </details>

        `).join("");
}

loadAnalytics();
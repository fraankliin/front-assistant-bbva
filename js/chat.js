let conversationId = "";

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
        localStorage.getItem("user")
    );

document.getElementById(
    "userEmail"
).textContent = user.email;

async function loadConversations() {

    try {

        const response =
            await apiFetch(
                "/chat/conversations"
            );

        const conversations =
            await response.json();

        renderConversations(
            conversations
        );

    } catch (error) {

        console.error(error);
    }
}

function renderConversations(
    conversations
) {

    const container =
        document.getElementById(
            "conversationList"
        );

    container.innerHTML = "";

    conversations.forEach(
        conversation => {

            const item =
                document.createElement("div");

            item.className =
                "conversation-item";

            item.innerHTML = `
                <strong>
                    ${conversation.title}
                </strong>

                <br>

                <small>
                    ${conversation.messages_count}
                    mensajes
                </small>
            `;

            item.addEventListener(
                "click",
                () =>
                    loadConversation(
                        conversation.id
                    )
            );

            container.appendChild(
                item
            );
        }
    );
}

async function loadConversation(
    id
) {

    try {

        const response =
            await apiFetch(
                `/chat/conversations/${id}`
            );

        const conversation =
            await response.json();

        conversationId = id;

        renderMessages(
            conversation.messages
        );

    } catch (error) {

        console.error(error);
    }
}

function renderMessages(
    messages
) {

    const container =
        document.getElementById(
            "chatMessages"
        );

    container.innerHTML = "";

    messages.forEach(
        message => {

            addMessage(
                message.role,
                message.content,
                message.latency_ms
            );
        }
    );
}

function addMessage(
    role,
    content,
    latency = null
) {

    const container =
        document.getElementById(
            "chatMessages"
        );

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        `message ${role}`;

    let metadata = "";

    if (
        role === "assistant" &&
        latency
    ) {

        metadata = `
            <div class="message-meta">
                     ${(latency / 1000).toFixed(2)} s
            </div>
        `;
    }

    const formattedContent =
        role === "assistant"
            ? marked.parse(content)
            : content;

    wrapper.innerHTML = `
        <div class="bubble">

            <div class="message-content">
                ${formattedContent}
            </div>

            ${metadata}

        </div>
    `;

    container.appendChild(
        wrapper
    );

    container.scrollTop =
        container.scrollHeight;
}

function showLoader() {

    const container =
        document.getElementById(
            "chatMessages"
        );

    const loader =
        document.createElement(
            "div"
        );

    loader.id = "loader";

    loader.className =
        "message assistant";

    loader.innerHTML = `
        <div class="bubble">
            Pensando...
        </div>
    `;

    container.appendChild(
        loader
    );

    container.scrollTop =
        container.scrollHeight;
}

function hideLoader() {

    const loader =
        document.getElementById(
            "loader"
        );

    if (loader) {

        loader.remove();
    }
}

async function sendMessage(
    query
) {

    const response =
        await apiFetch(
            "/chat/ask",
            {
                method: "POST",

                body: JSON.stringify({
                    query,
                    conversation_id:
                        conversationId,
                    threshold: 0.4,
                    top_k: 4
                })
            }
        );

    return await response.json();
}

document
.getElementById(
    "chatForm"
)
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const input =
            document.getElementById(
                "messageInput"
            );

        const query =
            input.value.trim();

        if (!query) return;

        addMessage(
            "user",
            query
        );

        input.value = "";

        showLoader();

        try {

            const data =
                await sendMessage(
                    query
                );

            hideLoader();

            conversationId =
                data.conversation_id;

            addMessage(
                "assistant",
                data.answer
            );

            loadConversations();

        } catch (error) {

            hideLoader();

            console.error(
                error
            );
        }
    }
);

document
.getElementById(
    "newChatBtn"
)
.addEventListener(
    "click",
    () => {

        conversationId = "";

        document.getElementById(
            "chatMessages"
        ).innerHTML = `
            <div class="welcome">

                <h1>
                    ¿Cómo puedo ayudarte hoy?
                </h1>

                <p>
                    Consulta información sobre productos,
                    servicios y procesos de BBVA.
                </p>

            </div>
        `;
    }
);

document
.getElementById(
    "logoutBtn"
)
.addEventListener(
    "click",
    logout
);

loadConversations();
/**
 * This will be loaded before starting the simulator.
 * If you wish to add custom javascript, 
 * ** make sure to add this line to pxt.json**
 * 
 *      "disableTargetTemplateFiles": true
 * 
 * otherwise MakeCode will override your changes.
 * 
 * To register a constrol simmessages, use addSimMessageHandler
 */

(function () {
    var COLORS = {
        "grass": "#3aa657",
        "dark grass": "#1f6f5b",
        "dirt": "#8a5a32",
        "tile": "#4c6fb3",
        "default": "#111318"
    };

    var simReady = false;
    var input;
    var sendButton;
    var status;
    var twitchLink;

    window.addEventListener("message", receiveSimMessage, false);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupPage);
    } else {
        setupPage();
    }

    function setupPage() {
        document.body.classList.add("custom-messaging-page");
        addStyles();
        addControls();
        setBackground("default");
        updateReadyState();
    }

    function receiveSimMessage(ev) {
        var msg = ev.data || {};

        // The simulator sends this when the iframe is ready to receive messages.
        if (msg.type === "ready") {
            simReady = true;
            updateReadyState();
            return;
        }

        if (msg.type !== "messagepacket") return;

        // Messages from parentFrame.sendMessage(...) arrive as UTF-8 bytes.
        var text = bytesToString(msg.data).trim();

        if (msg.channel === "location") {
            setBackground(text);
        } else if (msg.channel === "opentwitch") {
            openTwitch(text);
        }
    }

    function addControls() {
        var form = document.createElement("form");
        form.id = "custom-message-panel";

        input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Say something";
        input.maxLength = 80;
        input.setAttribute("aria-label", "Sprite message");

        sendButton = document.createElement("button");
        sendButton.type = "submit";
        sendButton.textContent = "Send";

        twitchLink = document.createElement("a");
        twitchLink.textContent = "Open Twitch";
        twitchLink.target = "_blank";
        twitchLink.rel = "noopener noreferrer";
        twitchLink.hidden = true;

        status = document.createElement("span");
        status.setAttribute("aria-live", "polite");

        form.appendChild(input);
        form.appendChild(sendButton);
        form.appendChild(twitchLink);
        form.appendChild(status);
        form.addEventListener("submit", sendInputMessage);

        document.body.appendChild(form);
    }

    function sendInputMessage(ev) {
        ev.preventDefault();

        var text = input.value.trim();
        if (!text) return;

        if (!sendToGame("userinput", text)) {
            setStatus("Simulator is still starting");
            return;
        }

        input.value = "";
        input.focus();
        setStatus("Sent");
    }

    function sendToGame(channel, text) {
        var frame = document.getElementById("simframe");
        if (!simReady || !frame || !frame.contentWindow) return false;

        frame.contentWindow.postMessage({
            type: "messagepacket",
            broadcast: false,
            channel: channel,
            data: stringToBytes(text)
        }, "*");

        return true;
    }

    function setBackground(location) {
        var key = (location || "default").toLowerCase();
        var color = COLORS[key] || COLORS.default;

        document.body.style.backgroundColor = color;
        document.documentElement.style.setProperty("--page-color", color);
    }

    function openTwitch(rawChannel) {
        var channel = (rawChannel || "")
            .trim()
            .replace(/^@/, "")
            .replace(/^https?:\/\/(www\.)?twitch\.tv\//i, "")
            .split(/[/?#]/)[0];

        if (!/^[a-z0-9_]{3,25}$/i.test(channel)) {
            setStatus("Invalid Twitch channel");
            return;
        }

        var url = "https://www.twitch.tv/" + channel;
        var opened = window.open(url, "_blank");

        if (opened) {
            opened.opener = null;
            twitchLink.hidden = true;
            setStatus("");
        } else {
            // Browser blocked the popup, so leave a user-clickable fallback.
            twitchLink.href = url;
            twitchLink.hidden = false;
            setStatus("Click to open Twitch");
        }
    }

    function updateReadyState() {
        if (!sendButton) return;

        sendButton.disabled = !simReady;
        setStatus(simReady ? "" : "Starting");
    }

    function setStatus(text) {
        if (status) status.textContent = text;
    }

    function bytesToString(bytes) {
        if (!bytes) return "";

        if (typeof TextDecoder !== "undefined") {
            return new TextDecoder("utf-8").decode(bytes);
        }

        var result = "";
        for (var i = 0; i < bytes.length; i++) {
            result += String.fromCharCode(bytes[i]);
        }
        return result;
    }

    function stringToBytes(text) {
        if (typeof TextEncoder !== "undefined") {
            return new TextEncoder().encode(text);
        }

        var bytes = new Uint8Array(text.length);
        for (var i = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i) & 0xff;
        }
        return bytes;
    }

    function addStyles() {
        var style = document.createElement("style");

        style.textContent = `
:root {
    --control-height: 3.25rem;
    --page-color: #111318;
}

body.custom-messaging-page {
    transition: background-color 150ms ease;
}

body.custom-messaging-page iframe#simframe {
    height: calc(100% - 1.5em - var(--control-height));
    outline: 6px solid var(--page-color);
    outline-offset: -6px;
}

body.custom-messaging-page.nofooter iframe#simframe {
    height: calc(100% - var(--control-height));
}

body.custom-messaging-page footer {
    bottom: var(--control-height);
}

#custom-message-panel {
    align-items: center;
    background: rgba(0, 0, 0, 0.88);
    border-top: 2px solid var(--page-color);
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    gap: 0.5rem;
    height: var(--control-height);
    left: 0;
    padding: 0.5rem;
    position: fixed;
    right: 0;
    z-index: 200;
}

#custom-message-panel input {
    flex: 1;
    font: inherit;
    min-width: 0;
    padding: 0.35rem 0.5rem;
}

#custom-message-panel button,
#custom-message-panel a {
    background: var(--page-color);
    border: 1px solid white;
    color: white;
    cursor: pointer;
    font: inherit;
    padding: 0.35rem 0.65rem;
    text-decoration: none;
}

#custom-message-panel button:disabled {
    cursor: default;
    opacity: 0.55;
}

#custom-message-panel span {
    color: white;
    font-size: 0.8em;
    min-width: 4rem;
}

@media (max-width: 520px) {
    :root {
        --control-height: 6rem;
    }

    #custom-message-panel {
        flex-wrap: wrap;
    }

    #custom-message-panel input {
        flex-basis: 100%;
    }
}
`;

        document.head.appendChild(style);
    }
}());

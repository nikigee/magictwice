<template>
    <div id="playerAlert" class="d-print-none">
    </div>
</template>

<style lang="scss">
#playerAlert {
    .mascot-alert {
        min-height: 96px;
        animation: alertPanelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform-origin: top center;
    }

    .alert-mascot-wrap {
        position: relative;
        width: 125px;
        min-height: 96px;
        overflow: hidden;
        clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
        animation: mascotSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                115deg,
                transparent 20%,
                rgba(255, 255, 255, 0.28) 50%,
                transparent 80%
            );
            transform: translateX(-120%);
            animation: mascotShine 0.75s ease-out 0.15s forwards;
            pointer-events: none;
        }
    }

    .alert-mascot {
        width: 100%;
        height: 100%;
        min-height: 96px;
        background-image: var(--alert-mascot);
        background-size: cover;
        background-position: center 18%;
        transition: transform 0.25s ease;
    }

    .mascot-alert.is-speaking .alert-mascot {
        animation: mascotTalkBob 0.28s ease-in-out infinite alternate;
    }

    .alert-dialogue {
        font-size: 1.1rem;
        line-height: 1.4;
        user-select: none;
    }

    .vn-cursor {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.85em;
        opacity: 0.85;
    }

    .mascot-alert.is-speaking .vn-cursor {
        animation: cursorBlink 0.45s steps(2, start) infinite;
    }

    .mascot-alert:not(.is-speaking) .vn-cursor {
        animation: rpgPromptBounce 0.9s ease-in-out infinite;
    }
}

@keyframes alertPanelIn {
    0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes mascotSlideIn {
    0% {
        opacity: 0;
        transform: translateX(-28px) scale(1.08);
    }
    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes mascotShine {
    0% {
        transform: translateX(-120%);
    }
    100% {
        transform: translateX(120%);
    }
}

@keyframes mascotTalkBob {
    0% {
        transform: translateY(0) scale(1.02);
    }
    100% {
        transform: translateY(-3px) scale(1.04);
    }
}

@keyframes cursorBlink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

@keyframes rpgPromptBounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(3px);
    }
}
</style>

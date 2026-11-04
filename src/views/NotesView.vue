<template>
    <NavBar />
    <div class="container notes-view my-3" v-if="$md.ply">
        <!-- Modern Top Toolbar -->
        <div
            class="notes-toolbar d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div class="d-flex align-items-center gap-3">
                <div>
                    <div class="d-flex align-items-center gap-2">
                        <h1 class="h3 mb-0 fw-bold notes-title">Notebook</h1>
                        <span class="badge rounded-1 status-badge d-print-none"
                            :class="saveStatus === 'Saving...' ? 'text-warning' : 'text-body-secondary'">
                            <i class="bi"
                                :class="saveStatus === 'Saving...' ? 'bi-arrow-repeat spin' : 'bi-check2-circle text-primary'"></i>
                            {{ saveStatus }}
                        </span>
                    </div>
                    <p class="text-body-secondary small mb-0 d-none d-sm-block">
                        {{ $md.ply.name }}'s campaign notes, lore &amp; features
                    </p>
                </div>
            </div>

            <!-- Action Controls -->
            <div class="d-flex align-items-center gap-2 gap-sm-3 d-print-none ms-auto">
                <!-- Dice Roller Pop-up Trigger -->
                <button type="button" class="btn dice-trigger-btn d-flex align-items-center gap-2"
                    @click="openDicePopup" title="Open Dice Roller">
                    <i class="bi bi-dice-5-fill text-primary"></i>
                    <span>Dice Roller</span>
                    <span v-if="lastRollTotal !== null" class="badge rounded-1 bg-primary text-dark fw-bold ms-1"
                        title="Last roll total">
                        {{ lastRollTotal }}
                    </span>
                </button>

                <!-- Intuitive Read / Edit Segmented Toggle -->
                <div class="mode-toggle" role="group" aria-label="Note mode toggle">
                    <button type="button" class="mode-toggle-btn" :class="{ active: !edit }" @click="setEdit(false)"
                        title="Read mode">
                        <i class="bi bi-book"></i>
                        <span>Read</span>
                    </button>
                    <button type="button" class="mode-toggle-btn" :class="{ active: edit }" @click="setEdit(true)"
                        title="Edit mode">
                        <i class="bi bi-pencil-square"></i>
                        <span>Edit</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Full-Width Notebook Area -->
        <div class="notebook-body mb-5">
            <!-- Edit Mode -->
            <div v-if="edit" class="editor-wrapper shadow-sm rounded-1 overflow-hidden">
                <!-- Markdown Formatting Toolbar -->
                <div
                    class="editor-toolbar d-flex flex-wrap align-items-center justify-content-between gap-1 px-2 py-2 border-bottom border-secondary border-opacity-25">
                    <div class="d-flex flex-wrap align-items-center gap-1">
                        <button type="button" class="toolbar-btn" title="Heading 1" @click="insertBlockPrefix('# ')">
                            <span class="fw-bold small">H1</span>
                        </button>
                        <button type="button" class="toolbar-btn" title="Heading 2" @click="insertBlockPrefix('## ')">
                            <span class="fw-bold small">H2</span>
                        </button>
                        <button type="button" class="toolbar-btn" title="Heading 3" @click="insertBlockPrefix('### ')">
                            <span class="fw-bold small">H3</span>
                        </button>

                        <div class="toolbar-divider mx-1"></div>

                        <button type="button" class="toolbar-btn" title="Bold (Ctrl+B)"
                            @click="wrapSelection('**', '**', 'bold text')">
                            <i class="bi bi-type-bold"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Italic (Ctrl+I)"
                            @click="wrapSelection('*', '*', 'italic text')">
                            <i class="bi bi-type-italic"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Strikethrough"
                            @click="wrapSelection('~~', '~~', 'strikethrough')">
                            <i class="bi bi-type-strikethrough"></i>
                        </button>

                        <div class="toolbar-divider mx-1"></div>

                        <button type="button" class="toolbar-btn" title="Bullet List" @click="insertBlockPrefix('- ')">
                            <i class="bi bi-list-ul"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Numbered List"
                            @click="insertBlockPrefix('1. ')">
                            <i class="bi bi-list-ol"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Task List"
                            @click="insertBlockPrefix('- [ ] ')">
                            <i class="bi bi-check2-square"></i>
                        </button>

                        <div class="toolbar-divider mx-1"></div>

                        <button type="button" class="toolbar-btn" title="Blockquote" @click="insertBlockPrefix('> ')">
                            <i class="bi bi-chat-square-quote"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Inline Code"
                            @click="wrapSelection('`', '`', 'code')">
                            <i class="bi bi-code"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Horizontal Rule"
                            @click="insertSnippet('\n---\n')">
                            <i class="bi bi-hr"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Insert Table" @click="insertTable">
                            <i class="bi bi-table"></i>
                        </button>
                        <button type="button" class="toolbar-btn" title="Insert Link"
                            @click="wrapSelection('[', '](https://)', 'link text')">
                            <i class="bi bi-link-45deg"></i>
                        </button>
                    </div>

                    <div class="d-none d-lg-flex align-items-center">
                        <button type="button" class="toolbar-btn px-2" :class="{ active: splitPreview }"
                            @click="splitPreview = !splitPreview" title="Toggle Side-by-Side Live Preview">
                            <i class="bi bi-layout-split me-1"></i>
                            <span class="small">Split Preview</span>
                        </button>
                    </div>
                </div>

                <!-- Editor & Optional Split Preview -->
                <div class="row g-0">
                    <div :class="splitPreview ? 'col-lg-6 border-end border-secondary border-opacity-25' : 'col-12'">
                        <textarea ref="noteEditor" class="form-control editor-textarea border-0 rounded-0 p-4"
                            v-model="$md.ply.stats.misc_notes" placeholder="Write your campaign notes in Markdown..."
                            @keydown="handleEditorKeydown"></textarea>
                    </div>
                    <div v-if="splitPreview" class="col-lg-6 d-none d-lg-block preview-pane p-4">
                        <section v-if="hasNotes" class="markdown-body markdown" data-theme="dark"
                            v-html="renderedMarkdown"></section>
                        <p v-else class="text-body-secondary fst-italic">Nothing to preview yet...</p>
                    </div>
                </div>
            </div>

            <!-- Read Mode -->
            <div v-else class="mb-5" @dblclick="setEdit(true)">
                <section v-if="hasNotes" class="markdown-body markdown" data-theme="dark" v-html="renderedMarkdown">
                </section>

                <!-- Empty State -->
                <div v-else class="empty-notes text-center py-5 my-4" @click="setEdit(true)">
                    <div class="empty-icon-wrap mb-3 mx-auto">
                        <i class="bi bi-journal-richtext fs-1 text-primary"></i>
                    </div>
                    <h4 class="fw-semibold mb-2">Your notebook is empty</h4>
                    <p class="text-body-secondary mb-4 mx-auto" style="max-width: 420px;">
                        Jot down session notes, quest leads, NPC names, or character lore. Click anywhere here or switch
                        to <strong>Edit</strong> to start writing.
                    </p>
                    <button type="button" class="btn btn-outline-primary rounded-1 px-4" @click.stop="setEdit(true)">
                        <i class="bi bi-pencil-square me-2"></i>Start Writing
                    </button>
                </div>
            </div>
        </div>

        <!-- Dice Roller Pop-up Modal -->
        <Transition name="dice-popup">
            <div v-show="showDicePopup" class="dice-popup-backdrop d-print-none" @click.self="closeDicePopup">
                <div class="dice-popup-dialog shadow-lg rounded-1" role="dialog" aria-modal="true"
                    aria-label="Dice Roller">
                    <div class="dice-popup-header d-flex justify-content-between align-items-center px-4 pt-3 pb-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-dice-5-fill text-primary fs-5"></i>
                            <h5 class="mb-0 fw-normal">Dice Tray</h5>
                        </div>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeDicePopup"></button>
                    </div>
                    <div class="dice-popup-body px-3 pb-3" ref="dicePopupBody">
                        <DiceRoller class="popup-dice-roller" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <div class="container" v-else>
        <h1>Sorry, this character doesn't exist :C</h1>
    </div>
    <Footerr class="notes-view" />
    <MobileNavBar />
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import DiceRoller from '../components/DiceRoller.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import MobileNavBar from '../components/MobileNavBar.vue'
import Footerr from '@/components/Footerr.vue'

export default {
    data() {
        return {
            ply: null,
            edit: false,
            splitPreview: false,
            showDicePopup: false,
            saveStatus: 'Saved',
            saveTimeout: null
        }
    },
    components: {
        NavBar,
        DiceRoller,
        MobileNavBar,
        Footerr
    },
    computed: {
        hasNotes() {
            return Boolean(
                this.$md.ply &&
                this.$md.ply.stats &&
                this.$md.ply.stats.misc_notes &&
                this.$md.ply.stats.misc_notes.trim().length > 0
            );
        },
        renderedMarkdown() {
            if (!this.hasNotes) return '';
            const rawHtml = marked.parse(this.$md.ply.stats.misc_notes, {
                gfm: true
            });
            return DOMPurify.sanitize(rawHtml);
        },
        lastRollTotal() {
            if (this.$md.diceHistory && this.$md.diceHistory.length > 0) {
                return this.$md.diceHistory[this.$md.diceHistory.length - 1].total;
            }
            return null;
        }
    },
    watch: {
        '$md.ply.stats.misc_notes'() {
            this.saveStatus = 'Saving...';
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.$md.savePlayer();
                this.saveStatus = 'Saved';
            }, 500);
        }
    },
    created() {
        if (!localStorage.charList) return;
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
    },
    mounted() {
        if (this.$md.ply) {
            document.title = `Notes - ${this.$md.ply.name}`;
        }
        window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        if (this.$md.ply) {
            this.$md.savePlayer();
        }
    },
    methods: {
        setEdit(value) {
            this.$md.savePlayer();
            this.saveStatus = 'Saved';
            this.edit = value;
            if (value) {
                this.$nextTick(() => {
                    const textarea = this.$refs.noteEditor;
                    if (textarea) {
                        textarea.focus({ preventScroll: true });
                        textarea.setSelectionRange(0, 0);
                        textarea.scrollTop = 0;
                    }
                    window.scrollTo({ top: 0 });
                });
            }
        },
        toggleEdit() {
            this.setEdit(!this.edit);
            return this.edit;
        },
        openDicePopup() {
            this.showDicePopup = true;
            this.$nextTick(() => {
                const input = this.$refs.dicePopupBody?.querySelector('input');
                if (input) input.focus();
            });
        },
        closeDicePopup() {
            this.showDicePopup = false;
        },
        handleKeydown(e) {
            if (e.key === 'Escape' && this.showDicePopup) {
                this.closeDicePopup();
            }
        },
        wrapSelection(prefix, suffix, placeholder = '') {
            const textarea = this.$refs.noteEditor;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = this.$md.ply.stats.misc_notes || '';
            const selected = text.substring(start, end) || placeholder;

            const replacement = `${prefix}${selected}${suffix}`;
            this.$md.ply.stats.misc_notes = text.substring(0, start) + replacement + text.substring(end);

            this.$nextTick(() => {
                textarea.focus();
                textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
            });
        },
        insertBlockPrefix(prefix) {
            const textarea = this.$refs.noteEditor;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = this.$md.ply.stats.misc_notes || '';

            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            this.$md.ply.stats.misc_notes = text.substring(0, lineStart) + prefix + text.substring(lineStart);

            this.$nextTick(() => {
                textarea.focus();
                textarea.setSelectionRange(start + prefix.length, end + prefix.length);
            });
        },
        insertSnippet(snippet) {
            const textarea = this.$refs.noteEditor;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const text = this.$md.ply.stats.misc_notes || '';
            this.$md.ply.stats.misc_notes = text.substring(0, start) + snippet + text.substring(start);

            this.$nextTick(() => {
                textarea.focus();
                const pos = start + snippet.length;
                textarea.setSelectionRange(pos, pos);
            });
        },
        insertTable() {
            const tableSnippet = `\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n`;
            this.insertSnippet(tableSnippet);
        },
        handleEditorKeydown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                this.wrapSelection('**', '**', 'bold text');
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                this.wrapSelection('*', '*', 'italic text');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.insertSnippet('    ');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.notes-title {
    letter-spacing: 0.03em;
}

.status-badge {
    font-size: 0.75rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.35em 0.75em;
}

/* Segmented Read / Edit Toggle */
.mode-toggle {
    display: inline-flex;
    background: var(--bs-secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 3px;
}

.mode-toggle-btn {
    border: none;
    background: transparent;
    color: var(--bs-secondary-color);
    padding: 0.35rem 0.9rem;
    border-radius: 3px;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover:not(.active) {
        color: var(--bs-body-color);
    }

    &.active {
        background: var(--bs-primary);
        color: #090c11;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }
}

/* Dice Roller Trigger Button */
.dice-trigger-btn {
    background: var(--bs-secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--bs-body-color);
    border-radius: 4px;
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--bs-primary);
        box-shadow: 0 0 10px rgba(73, 207, 203, 0.18);
        transform: translateY(-1px);
    }
}

/* Notebook Surface & Editor */
.notebook-surface {
    background: var(--bs-secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.07);
    min-height: 65vh;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: rgba(255, 255, 255, 0.14);
    }
}

.editor-wrapper {
    background: var(--bs-secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.editor-toolbar {
    background: rgba(0, 0, 0, 0.2);
}

.toolbar-btn {
    border: 1px solid transparent;
    background: transparent;
    color: var(--bs-secondary-color);
    border-radius: 3px;
    min-width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.45rem;
    transition: all 0.15s ease;
    cursor: pointer;

    &:hover {
        color: var(--bs-body-color);
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
        color: var(--bs-primary);
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--bs-primary);
    }
}

.toolbar-divider {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.12);
}

.editor-textarea {
    background: transparent !important;
    color: var(--bs-body-color) !important;
    min-height: 70vh;
    resize: vertical;
    font-family: "Lato", monospace, sans-serif;
    font-size: 1rem;
    line-height: 1.65;

    &:focus {
        box-shadow: none !important;
        outline: none !important;
    }
}

.preview-pane {
    max-height: 75vh;
    overflow-y: auto;
    background: var(--bs-body-bg);
}

/* GitHub Dark Markdown Styles (matching vue3-markdown VMarkdownView mode="dark") */
.markdown-body[data-theme="dark"] {
    color-scheme: dark;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    margin: 0;
    color: #c9d1d9;
    background-color: var(--bs-body-bg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;

    :deep(> *:first-child) {
        margin-top: 0 !important;
    }

    :deep(> *:last-child) {
        margin-bottom: 0 !important;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
        color: #c9d1d9;
    }

    :deep(h1) {
        margin: 0.67em 0;
        padding-bottom: 0.3em;
        font-size: 2em;
        border-bottom: 1px solid #21262d;
    }

    :deep(h2) {
        padding-bottom: 0.3em;
        font-size: 1.5em;
        border-bottom: 1px solid #21262d;
    }

    :deep(h3) {
        font-size: 1.25em;
    }

    :deep(h4) {
        font-size: 1em;
    }

    :deep(h5) {
        font-size: 0.875em;
    }

    :deep(h6) {
        font-size: 0.85em;
        color: #8b949e;
    }

    :deep(p),
    :deep(blockquote),
    :deep(ul),
    :deep(ol),
    :deep(dl),
    :deep(table),
    :deep(pre),
    :deep(details) {
        margin-top: 0;
        margin-bottom: 16px;
    }

    :deep(hr) {
        box-sizing: content-box;
        overflow: hidden;
        background: transparent;
        border-bottom: 1px solid #21262d;
        height: 0.25em;
        padding: 0;
        margin: 24px 0;
        background-color: #30363d;
        border: 0;
        opacity: 1;
    }

    :deep(blockquote) {
        margin: 0 0 16px 0;
        padding: 0 1em;
        color: #8b949e;
        border-left: 0.25em solid #30363d;

        > :first-child {
            margin-top: 0;
        }

        > :last-child {
            margin-bottom: 0;
        }
    }

    :deep(ul),
    :deep(ol) {
        padding-left: 2em;

        ul,
        ol {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    :deep(li + li) {
        margin-top: 0.25em;
    }

    :deep(li > p) {
        margin-top: 16px;
    }

    :deep(code),
    :deep(tt) {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        white-space: break-spaces;
        background-color: rgba(110, 118, 129, 0.4);
        border-radius: 6px;
        color: #c9d1d9;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    }

    :deep(pre) {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #161b22;
        border-radius: 6px;
        word-wrap: normal;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;

        code {
            display: inline;
            max-width: auto;
            padding: 0;
            margin: 0;
            overflow: visible;
            line-height: inherit;
            word-wrap: normal;
            background-color: transparent;
            border: 0;
            font-size: 100%;
            word-break: normal;
            white-space: pre;
        }
    }

    :deep(table) {
        border-spacing: 0;
        border-collapse: collapse;
        display: block;
        width: max-content;
        max-width: 100%;
        overflow: auto;

        th {
            font-weight: 600;
        }

        th,
        td {
            padding: 6px 13px;
            border: 1px solid #30363d;
        }

        tr {
            background-color: #0d1117;
            border-top: 1px solid #21262d;
        }

        tr:nth-child(2n) {
            background-color: #161b22;
        }
    }

    :deep(img) {
        border-style: none;
        max-width: 100%;
        box-sizing: content-box;
        background-color: #0d1117;
    }

    :deep(a) {
        background-color: transparent;
        color: #58a6ff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    :deep(strong) {
        font-weight: 600;
    }
}

.markdown {
    background: var(--bs-body-bg);
}

/* Empty State */
.empty-notes {
    cursor: pointer;
    user-select: none;
}

.empty-icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Dice Roller Pop-up Modal */
.dice-popup-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1055;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.dice-popup-dialog {
    width: 100%;
    max-width: 460px;
    background: var(--bs-body-bg);
    border: 1px solid rgba(255, 255, 255, 0.14);
}

.popup-dice-roller :deep(label[for="md-diceroller"]) {
    display: none;
}

/* Pop-up Transition */
.dice-popup-enter-active,
.dice-popup-leave-active {
    transition: opacity 0.2s ease;

    .dice-popup-dialog {
        transition: transform 0.2s ease, opacity 0.2s ease;
    }
}

.dice-popup-enter-from,
.dice-popup-leave-to {
    opacity: 0;

    .dice-popup-dialog {
        transform: translateY(10px) scale(0.97);
        opacity: 0;
    }
}

@media print {
    .markdown-body[data-theme="dark"] {
        color: black !important;
        background: transparent !important;

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
            color: black !important;
            border-color: #ccc !important;
        }
    }
}
</style>
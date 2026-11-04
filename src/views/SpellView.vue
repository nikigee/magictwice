<template>
    <NavBar />
    <div class="container text-center">
        <div class="row">
            <div class="col-xl-8 m-auto mb-4">
                <div class="text-start">
                    <router-link :to="`/player/${$md.ply.id}/spells/`" class="text-decoration-none"><i
                            class="bi bi-arrow-left"></i> Back</router-link>
                </div>
                <h1 class="display-3 text-uppercase mt-4">{{ spell.name }}</h1>
                <p class="lead text-body-secondary">{{ spell.level }}-level {{ spell.school }}</p>
                <hr />
                <div class="d-flex flex-wrap justify-content-around">
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Casting Time</div>
                        <div>{{ spell.ctime }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Range / Area</div>
                        <div>{{ spell.range }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Components</div>
                        <div>{{ spell.components }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Duration</div>
                        <div>{{ spell.duration }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Ritual</div>
                        <div>{{ spell.ritual }}</div>
                    </div>
                </div>
                <div
                    v-html="prettyDescription(spell.description)"
                    class="spell-description mt-4 text-start"
                    @click="handleDescriptionClick"
                >
                </div>
            </div>
        </div>

        <!-- Dice Roller Pop-up Modal -->
        <Transition name="dice-popup">
            <div v-show="showDicePopup" class="dice-popup-backdrop d-print-none" @click.self="closeDicePopup">
                <div class="dice-popup-dialog shadow-lg rounded-1 text-start" role="dialog" aria-modal="true"
                    aria-label="Dice Roller">
                    <div class="dice-popup-header d-flex justify-content-between align-items-center px-4 pt-3 pb-2">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-dice-5-fill text-primary fs-5"></i>
                            <h5 class="mb-0 fw-normal">Dice Tray</h5>
                        </div>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeDicePopup"></button>
                    </div>
                    <div class="dice-popup-body px-3 pb-3" ref="dicePopupBody">
                        <DiceRoller ref="diceRoller" class="popup-dice-roller" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <Footerr />
    <MobileNavBar />
</template>

<script>
import NavBar from '../components/NavBar.vue';
import DOMPurify from 'dompurify';
import MobileNavBar from '../components/MobileNavBar.vue';
import Footerr from '@/components/Footerr.vue';
import DiceRoller from '../components/DiceRoller.vue';

export default {
    components: {
        NavBar,
        MobileNavBar,
        Footerr,
        DiceRoller
    },
    data() {
        return {
            spell: {},
            showDicePopup: false
        }
    },
    mounted() {
        if (this.$md.ply && this.spell.name) {
            document.title = `${this.spell.name} - ${this.$md.ply.name}`;
        }
        window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    created() {
        if (!localStorage.charList) return;
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player) {
            this.$md.Load.restoreFromObj(player);

            const spell = this.$route.params.spell;
            this.$md.ply.magic.spells.forEach(value => {
                if (value.id == spell) {
                    this.spell = value;
                }
            });
        }
    },
    methods: {
        formatDiceLinks(text) {
            return text.replace(/(\b\d*d\d+(?:\s*[+-]\s*\d+)?\b)/gi, (match) => {
                const normalized = match.replace(/\s+/g, '');
                return `<a href="#" class="spell-dice-link" data-dice-roll="${normalized}">${match}</a>`;
            });
        },
        prettyDescription(description) {
            if (!description) return '';

            const paragraphs = description.split(/\n\s*\n/); // Split into paragraphs

            const html = paragraphs
                .map(paragraph => {
                    // Detect and format unordered lists
                    if (paragraph.trim().startsWith('-')) {
                        const listItems = paragraph
                            .split('\n')
                            .map(line => line.trim().replace(/^-/, '').trim()) // Remove leading `-`
                            .map(item => `<li>${this.formatDiceLinks(item)}</li>`) // Wrap each line in <li>
                            .join('');
                        return `<ul>${listItems}</ul>`; // Wrap all items in <ul>
                    }

                    // Bold "At higher levels," and text such like.
                    paragraph = paragraph.replace(/(At higher levels\.)/gi, '<strong>$1</strong>');
                    paragraph = paragraph.replace(/(Using a Higher-Level Spell Slot\.)/gi, '<strong>$1</strong>');
                    paragraph = paragraph.replace(/(Cantrip Upgrade\.)/gi, '<strong>$1</strong>');

                    // Wrap dice rolls like "2d8", "1d12", etc., in <a> tags
                    paragraph = this.formatDiceLinks(paragraph);

                    return `<p>${paragraph.trim()}</p>`; // Wrap in <p> if not a list
                })
                .join('');

            return DOMPurify.sanitize(html); // Sanitize the final HTML
        },
        handleDescriptionClick(e) {
            const diceLink = e.target.closest('a[data-dice-roll]');
            if (!diceLink) return;
            e.preventDefault();

            const rollString = diceLink.getAttribute('data-dice-roll');
            if (rollString && this.$refs.diceRoller) {
                this.$refs.diceRoller.performRoll(rollString);
                this.openDicePopup();
            }
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
        }
    }
}
</script>

<style lang="scss">
.spell-description p {
    font-size: 1.1em;
}

.spell-description a {
    text-decoration: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}
</style>

<style lang="scss" scoped>
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
</style>
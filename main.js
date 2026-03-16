/**
 * Takatof Initiative - Global Logic
 * Senior Engineering Standard Refactoring
 */

document.addEventListener('DOMContentLoaded', () => {
    TakatofApp.init();
});

const TakatofApp = (() => {
    // --- State & Selectors ---
    const state = {
        isFeedbackModalOpen: false,
        isFeedbackModalOpen: false,
        activeFeedbackTab: 'donor'
    };

    const selectors = {
        counters: '.counter',
        feedbackModal: '#feedbackModal',
        feedbackModalContainer: '#modalContainer',
        feedbackModalContainer: '#modalContainer',
        feedbackForm: '#feedbackForm',
        feedbackTypeInput: '#feedbackType',
        opinionLabel: '#opinionLabel',
        tabDonor: '#tabDonor',
        tabConsumer: '#tabConsumer',
        donorFeedbackFields: '#donorFeedbackFields',
        beneficiaryFeedbackFields: '#beneficiaryFeedbackFields',
        generalOpinionField: '#generalOpinionField',
        feedbackModalBody: '#feedbackModalBody'
    };

    // --- Core Modules ---

    /**
     * Stats Controller: Handles counter animations
     */
    const StatsController = {
        init() {
            const statsSection = document.querySelector(selectors.counters)?.closest('section');
            if (!statsSection) return;

            const observerOptions = { threshold: 0.5 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate();
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            observer.observe(statsSection);
        },

        animate() {
            const counters = document.querySelectorAll(selectors.counters);
            const speed = 200;

            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText.replace(/,/g, '');
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString();
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
            });
        }
    };

    /**
     * Modal Controller: Handles UI state and transitions for modals
     */
    const ModalController = {
        toggleModal(modalSelector, containerSelector, isOpen) {
            const modal = document.querySelector(modalSelector);
            const container = document.querySelector(containerSelector);

            if (isOpen) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                container.style.animation = 'fadeInScale 200ms var(--ease-out) reverse forwards';
                modal.querySelector('.modal-overlay').style.animation = 'backdropFade 200ms var(--ease-out) reverse forwards';

                setTimeout(() => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                    // Reset animations for next open
                    container.style.animation = '';
                    modal.querySelector('.modal-overlay').style.animation = '';
                }, 200);
            }
        },

        switchFeedbackTab(type) {
            state.activeFeedbackTab = type;
            const tabDonor = document.querySelector(selectors.tabDonor);
            const tabConsumer = document.querySelector(selectors.tabConsumer);
            const label = document.querySelector(selectors.opinionLabel);
            const typeInput = document.querySelector(selectors.feedbackTypeInput);

            typeInput.value = type;

            const opinionTextarea = document.querySelector('#fOpinion');
            const modalBody = document.querySelector(selectors.feedbackModalBody);

            if (modalBody) modalBody.scrollTop = 0;

            if (type === 'donor') {
                this._setTabActive(tabDonor, tabConsumer);
                if (opinionTextarea) opinionTextarea.required = false;
                document.querySelector(selectors.generalOpinionField)?.classList.add('hidden');
                document.querySelector(selectors.beneficiaryFeedbackFields)?.classList.add('hidden');
                document.querySelector(selectors.donorFeedbackFields)?.classList.remove('hidden');
            } else {
                this._setTabActive(tabConsumer, tabDonor);
                if (opinionTextarea) opinionTextarea.required = false;
                document.querySelector(selectors.generalOpinionField)?.classList.add('hidden');
                document.querySelector(selectors.donorFeedbackFields)?.classList.add('hidden');
                document.querySelector(selectors.beneficiaryFeedbackFields)?.classList.remove('hidden');
            }
        },

        _setTabActive(activeEl, inactiveEl) {
            activeEl.classList.add('text-brand-600', 'border-brand-600');
            activeEl.classList.remove('text-slate-400', 'border-transparent');
            inactiveEl.classList.remove('text-brand-600', 'border-brand-600');
            inactiveEl.classList.add('text-slate-400', 'border-transparent');
        }
    };

    /**
     * Form Controller: Handles submission and basic validation
     */
    const FormController = {
        handleFeedback(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            console.log('Feedback Submitted:', Object.fromEntries(formData));
            alert('شكراً لك على مشاركتنا رأيك! تم استلام رسالتك بنجاح.');
            TakatofApp.closeFeedbackModal();
            e.target.reset();
        },

    };

    // --- Public API ---
    return {
        init() {
            StatsController.init();
        },

        // Feedback Modal
        openFeedbackModal() {
            ModalController.toggleModal(selectors.feedbackModal, selectors.feedbackModalContainer, true);
            ModalController.switchFeedbackTab('donor');
        },
        closeFeedbackModal() {
            ModalController.toggleModal(selectors.feedbackModal, selectors.feedbackModalContainer, false);
        },
        switchTab(type) {
            ModalController.switchFeedbackTab(type);
        },
        handleFeedbackSubmit(e) {
            FormController.handleFeedback(e);
        },

    };
})();

// Global hooks for HTML onclick/onsubmit (since they were requested/used)
window.openFeedbackModal = () => TakatofApp.openFeedbackModal();
window.closeFeedbackModal = () => TakatofApp.closeFeedbackModal();
window.switchTab = (type) => TakatofApp.switchTab(type);
window.handleFeedbackSubmit = (e) => TakatofApp.handleFeedbackSubmit(e);

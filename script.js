// Main JavaScript functionality for Tova AI React
document.addEventListener('DOMContentLoaded', function() {
    const leftSidebar = document.querySelector('.left-sidebar');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const homeView = document.getElementById('homeView');
    const chatMessages = document.getElementById('chatMessages');
    const welcomeContent = document.getElementById('welcomeContent');
    const chatInputContainer = document.getElementById('chatInputContainer');
    
    // Randomize welcome message
    const greetings = [
        { text: 'Hur är din dag', isQuestion: true },
        { text: 'Hur mår du', isQuestion: true },
        { text: 'Vad kan jag hjälpa dig med', isQuestion: true },
        { text: 'Hej', isQuestion: false },
        { text: 'God morgon', isQuestion: false },
        { text: 'God eftermiddag', isQuestion: false },
        { text: 'Trevlig dag', isQuestion: false }
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const punctuation = randomGreeting.isQuestion ? '?' : '!';
    const welcomeMessage = document.querySelector('.welcome-message');
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `${randomGreeting.text}, Anna${punctuation}`;
    }
    
    // Get the active nav item (star icon)
    const activeNavItem = document.querySelector('.nav-item-sidebar.active');
    
    // Reset to default state when clicking active nav item
    if (activeNavItem) {
        activeNavItem.addEventListener('click', function() {
            // Reset chat to default state
            chatMessages.classList.remove('active');
            chatMessages.innerHTML = '';
            welcomeContent.classList.remove('hidden');
            chatInputContainer.style.display = 'none';
            document.querySelector('.chat-area').classList.remove('chat-active');
            
            // Reset input fields
            if (textarea) {
                textarea.value = '';
                textarea.style.height = 'auto';
            }
            if (textareaActive) {
                textareaActive.value = '';
                textareaActive.style.height = 'auto';
            }
            if (sendButton) sendButton.disabled = true;
            if (sendButtonActive) sendButtonActive.disabled = true;
            
            // Reset first message flag
            if (typeof isFirstMessage !== 'undefined') {
                isFirstMessage = true;
            }
        });
    }

    // Restore sidebar state from localStorage (default: collapsed)
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'false') {
        leftSidebar.classList.remove('collapsed');
    } else if (savedSidebarState === null) {
        // Set default to collapsed on first visit
        localStorage.setItem('sidebarCollapsed', 'true');
    }
    
    // Update tooltip text based on initial state
    const tooltip = minimizeBtn ? minimizeBtn.querySelector('.nav-tooltip') : null;
    if (tooltip) {
        if (leftSidebar.classList.contains('collapsed')) {
            tooltip.textContent = 'Maximera meny';
        } else {
            tooltip.textContent = 'Minimera meny';
        }
    }

    // Toggle sidebar collapse
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            leftSidebar.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isCollapsed = leftSidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
            
            // Update tooltip text based on collapsed state
            const tooltip = minimizeBtn.querySelector('.nav-tooltip');
            if (leftSidebar.classList.contains('collapsed')) {
                tooltip.textContent = 'Maximera meny';
            } else {
                tooltip.textContent = 'Minimera meny';
            }
        });
    }
    
    // Initialize all functionality
    initializeTransferPopup();
    initializeBankPopup();
    initializeIskPopup();
    initializePodcastPopup();
    initializeAiCarousel();
    initializePackageSidebar();
    initializeSearch();
    initializeChat();
    initializeSections();
    initializeSecurityDropdown();
    initializeAmountInput();
});

// Transfer popup functionality
function initializeTransferPopup() {
    const transferOverlay = document.getElementById('transferOverlay');
    const closeTransferPopup = document.getElementById('closeTransferPopup');
    const transferButton = document.querySelector('.top-bar-button:last-child');
    const transferTabElements = document.querySelectorAll('.transfer-tab');
    
    const topupAmountInput = document.getElementById('topupAmount');
    const payoutAmountInput = document.getElementById('payoutAmount');
    const topupButton = document.getElementById('topupButton');
    const payoutButton = document.getElementById('payoutButton');
    const transferSuccessView = document.getElementById('transferSuccessView');
    const transferSuccessDone = document.getElementById('transferSuccessDone');
    const transferTabs = document.querySelector('.transfer-tabs');
    
    // Enable/disable buttons based on input
    if (topupAmountInput) {
        topupAmountInput.addEventListener('input', function() {
            topupButton.disabled = this.value.trim() === '' || parseFloat(this.value) <= 0;
        });
    }
    
    if (payoutAmountInput) {
        payoutAmountInput.addEventListener('input', function() {
            payoutButton.disabled = this.value.trim() === '' || parseFloat(this.value) <= 0;
        });
    }
    
    // Top-up button click
    if (topupButton) {
        topupButton.addEventListener('click', function() {
            const amount = parseFloat(topupAmountInput.value);
            topupButton.classList.add('loading');
            topupButton.disabled = true;
            
            setTimeout(() => {
                // Hide topup content and tabs
                document.getElementById('topupContent').classList.remove('active');
                transferTabs.classList.add('hidden');
                transferSuccessView.classList.add('active');
                
                // Update success message
                document.getElementById('transferSuccessTitle').textContent = 'Insättning genomförd!';
                document.getElementById('transferSuccessAmount').textContent = amount.toLocaleString('sv-SE') + ' SEK';
                document.getElementById('transferSuccessText').textContent = 'Pengarna har satts in på ditt Tova-konto och är tillgängliga direkt.';
                document.getElementById('transferSuccessInfo').textContent = '';
                document.getElementById('transferSuccessInfo').style.display = 'none';
                
                // Remove loading state
                topupButton.classList.remove('loading');
            }, 2000);
        });
    }
    
    // Payout button click
    if (payoutButton) {
        payoutButton.addEventListener('click', function() {
            const amount = parseFloat(payoutAmountInput.value);
            payoutButton.classList.add('loading');
            payoutButton.disabled = true;
            
            setTimeout(() => {
                // Hide payout content and tabs
                document.getElementById('payoutContent').classList.remove('active');
                transferTabs.classList.add('hidden');
                transferSuccessView.classList.add('active');
                
                // Update success message
                document.getElementById('transferSuccessTitle').textContent = 'Uttag genomfört!';
                document.getElementById('transferSuccessAmount').textContent = amount.toLocaleString('sv-SE') + ' SEK';
                document.getElementById('transferSuccessText').textContent = 'Pengarna har tagits ut från ditt Tova-konto och är på väg till ditt bankkonto.';
                document.getElementById('transferSuccessInfo').textContent = 'Det kan ta 2-3 bankdagar innan pengarna syns på ditt konto.';
                document.getElementById('transferSuccessInfo').style.display = 'block';
                
                // Remove loading state
                payoutButton.classList.remove('loading');
            }, 2000);
        });
    }
    
    // Success done button
    if (transferSuccessDone) {
        transferSuccessDone.addEventListener('click', function() {
            transferOverlay.classList.remove('active');
            setTimeout(() => {
                if (!transferOverlay.classList.contains('active')) {
                    transferOverlay.style.display = 'none';
                    // Reset to default tab
                    transferSuccessView.classList.remove('active');
                    transferTabs.classList.remove('hidden');
                    document.getElementById('topupContent').classList.add('active');
                    // Reset inputs
                    topupAmountInput.value = '';
                    payoutAmountInput.value = '';
                    topupButton.disabled = true;
                    payoutButton.disabled = true;
                }
            }, 300);
        });
    }
    
    // Open transfer popup
    if (transferButton) {
        transferButton.addEventListener('click', function() {
            transferOverlay.style.display = 'flex';
            // Reset to topup tab
            transferSuccessView.classList.remove('active');
            transferTabs.classList.remove('hidden');
            document.getElementById('topupContent').classList.add('active');
            document.getElementById('payoutContent').classList.remove('active');
            // Reset active tab button
            document.querySelectorAll('.transfer-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.transfer-tab[data-tab="topup"]').classList.add('active');
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    transferOverlay.classList.add('active');
                });
            });
        });
    }
    
    // Close transfer popup
    if (closeTransferPopup) {
        closeTransferPopup.addEventListener('click', function() {
            transferOverlay.classList.remove('active');
            setTimeout(() => {
                if (!transferOverlay.classList.contains('active')) {
                    transferOverlay.style.display = 'none';
                    // Reset
                    transferSuccessView.classList.remove('active');
                    transferTabs.classList.remove('hidden');
                    document.getElementById('topupContent').classList.add('active');
                    topupAmountInput.value = '';
                    payoutAmountInput.value = '';
                    topupButton.disabled = true;
                    payoutButton.disabled = true;
                }
            }, 300);
        });
    }
    
    // Close on overlay click
    if (transferOverlay) {
        transferOverlay.addEventListener('click', function(e) {
            if (e.target === transferOverlay) {
                transferOverlay.classList.remove('active');
                setTimeout(() => {
                    if (!transferOverlay.classList.contains('active')) {
                        transferOverlay.style.display = 'none';
                        // Reset
                        transferSuccessView.classList.remove('active');
                        transferTabs.classList.remove('hidden');
                        document.getElementById('topupContent').classList.add('active');
                        topupAmountInput.value = '';
                        payoutAmountInput.value = '';
                        topupButton.disabled = true;
                        payoutButton.disabled = true;
                    }
                }, 300);
            }
        });
    }
    
    // Tab switching
    transferTabElements.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            transferTabElements.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabName = this.getAttribute('data-tab');
            document.querySelectorAll('.transfer-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + 'Content').classList.add('active');
        });
    });
}

// Bank popup functionality
function initializeBankPopup() {
    const bankOverlay = document.getElementById('bankOverlay');
    const closeBankPopup = document.getElementById('closeBankPopup');
    const bankButton = document.querySelector('.top-bar-button:first-child');
    const bankSelectStep = document.getElementById('bankSelectStep');
    const accountSelectStep = document.getElementById('accountSelectStep');
    const backToBanks = document.getElementById('backToBanks');
    const backToBanksFromBankId = document.getElementById('backToBanksFromBankId');
    const bankItems = document.querySelectorAll('.bank-item');
    const accountItems = document.querySelectorAll('.account-item');
    const connectBankButton = document.getElementById('connectBankButton');
    const bankSuccessStep = document.getElementById('bankSuccessStep');
    const bankSuccessDone = document.getElementById('bankSuccessDone');
    
    let selectedAccountName = '';
    let selectedBankName = '';
    
    // Bank logo update function (global)
    window.updateBankLogos = function(text, cssClass, bankName) {
        selectedBankName = bankName;
        
        const logo1 = document.getElementById('accountLogo1');
        const logo2 = document.getElementById('accountLogo2');
        const logo3 = document.getElementById('accountLogo3');
        
        if (logo1) {
            logo1.textContent = text;
            logo1.className = 'account-bank-logo ' + cssClass;
        }
        if (logo2) {
            logo2.textContent = text;
            logo2.className = 'account-bank-logo ' + cssClass;
        }
        if (logo3) {
            logo3.textContent = text;
            logo3.className = 'account-bank-logo ' + cssClass;
        }
    };
    
    // Open bank popup
    if (bankButton) {
        bankButton.addEventListener('click', function() {
            bankOverlay.style.display = 'flex';
            // Reset to first step
            bankSelectStep.classList.add('active');
            accountSelectStep.classList.remove('active');
            const bankBankIdStep = document.getElementById('bankBankIdStep');
            bankBankIdStep.classList.remove('active');
            bankSuccessStep.classList.remove('active');
            // Reset transforms
            bankSelectStep.style.transform = '';
            bankSelectStep.style.opacity = '';
            accountSelectStep.style.transform = '';
            accountSelectStep.style.opacity = '';
            bankBankIdStep.style.transform = '';
            bankBankIdStep.style.opacity = '';
            // Reset title
            document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bankOverlay.classList.add('active');
                });
            });
        });
    }
    
    // Close bank popup
    if (closeBankPopup) {
        closeBankPopup.addEventListener('click', function() {
            bankOverlay.classList.remove('active');
            setTimeout(() => {
                if (!bankOverlay.classList.contains('active')) {
                    bankOverlay.style.display = 'none';
                    // Reset steps
                    bankSelectStep.classList.add('active');
                    accountSelectStep.classList.remove('active');
                    const bankBankIdStep = document.getElementById('bankBankIdStep');
                    bankBankIdStep.classList.remove('active');
                    // Reset transforms
                    bankSelectStep.style.transform = '';
                    bankSelectStep.style.opacity = '';
                    accountSelectStep.style.transform = '';
                    accountSelectStep.style.opacity = '';
                    bankBankIdStep.style.transform = '';
                    bankBankIdStep.style.opacity = '';
                    // Reset title
                    document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
                    // Reset button
                    connectBankButton.textContent = 'Anslut konto';
                    connectBankButton.disabled = true;
                    accountItems.forEach(acc => acc.classList.remove('selected'));
                }
            }, 300);
        });
    }
    
    // Bank selection
    bankItems.forEach(item => {
        item.addEventListener('click', function() {
            selectedBankName = this.querySelector('.bank-name').textContent;
            
            // Animate current step out to left
            bankSelectStep.style.transform = 'translateX(-100%)';
            bankSelectStep.style.opacity = '0';
            
            // Prepare next step (start from right) - now BankID step
            const bankBankIdStep = document.getElementById('bankBankIdStep');
            bankBankIdStep.style.transform = 'translateX(100%)';
            bankBankIdStep.style.opacity = '0';
            
            // After a brief moment, slide in the BankID step
            setTimeout(() => {
                bankSelectStep.classList.remove('active');
                bankBankIdStep.classList.add('active');
                
                // Update title for BankID step
                document.getElementById('bankPopupTitle').textContent = 'Identifiera dig med Mobilt BankID';
                
                requestAnimationFrame(() => {
                    bankBankIdStep.style.transform = 'translateX(0)';
                    bankBankIdStep.style.opacity = '1';
                });
                
                // After 2 seconds, show spinner
                setTimeout(() => {
                    const bankIdQrContainer = document.getElementById('bankIdQrContainer');
                    bankIdQrContainer.innerHTML = '<div class="bank-bankid-spinner"></div>';
                    
                    // After another 2 seconds, go to account selection
                    setTimeout(() => {
                        bankBankIdStep.classList.remove('active');
                        accountSelectStep.classList.add('active');
                        
                        // Update title for account selection step
                        document.getElementById('bankPopupTitle').textContent = 'Anslut konto i ' + selectedBankName;
                        
                        // Reset QR code for next time
                        bankIdQrContainer.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <rect width="200" height="200" fill="white"/>
                            <g fill="black">
                                <rect x="20" y="20" width="20" height="20"/>
                                <rect x="60" y="20" width="20" height="20"/>
                                <rect x="100" y="20" width="20" height="20"/>
                                <rect x="140" y="20" width="20" height="20"/>
                                <rect x="180" y="20" width="20" height="20"/>
                                <rect x="20" y="60" width="20" height="20"/>
                                <rect x="100" y="60" width="20" height="20"/>
                                <rect x="180" y="60" width="20" height="20"/>
                                <rect x="20" y="100" width="20" height="20"/>
                                <rect x="60" y="100" width="20" height="20"/>
                                <rect x="100" y="100" width="20" height="20"/>
                                <rect x="140" y="100" width="20" height="20"/>
                                <rect x="180" y="100" width="20" height="20"/>
                                <rect x="20" y="140" width="20" height="20"/>
                                <rect x="100" y="140" width="20" height="20"/>
                                <rect x="180" y="140" width="20" height="20"/>
                                <rect x="20" y="180" width="20" height="20"/>
                                <rect x="60" y="180" width="20" height="20"/>
                                <rect x="100" y="180" width="20" height="20"/>
                                <rect x="140" y="180" width="20" height="20"/>
                                <rect x="180" y="180" width="20" height="20"/>
                            </g>
                        </svg>`;
                    }, 2000);
                }, 2000);
            }, 10);
        });
    });
    
    // Back to banks
    if (backToBanks) {
        backToBanks.addEventListener('click', function() {
            // Check which step is currently active
            const bankBankIdStep = document.getElementById('bankBankIdStep');
            const currentStep = bankBankIdStep.classList.contains('active') ? bankBankIdStep : accountSelectStep;
            
            // Animate current step out to right
            currentStep.style.transform = 'translateX(100%)';
            currentStep.style.opacity = '0';
            
            // Prepare previous step (start from left)
            bankSelectStep.style.transform = 'translateX(-100%)';
            bankSelectStep.style.opacity = '0';
            
            // After a brief moment, slide in the bank step
            setTimeout(() => {
                currentStep.classList.remove('active');
                bankSelectStep.classList.add('active');
                
                // Reset title
                document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
                
                requestAnimationFrame(() => {
                    bankSelectStep.style.transform = 'translateX(0)';
                    bankSelectStep.style.opacity = '1';
                });
            }, 10);
            
            // Deselect accounts if coming from account selection
            if (currentStep === accountSelectStep) {
                accountItems.forEach(acc => acc.classList.remove('selected'));
                connectBankButton.disabled = true;
            }
        });
    }
    
    // Back to banks from BankID step
    if (backToBanksFromBankId) {
        backToBanksFromBankId.addEventListener('click', function() {
            const bankBankIdStep = document.getElementById('bankBankIdStep');
            
            // Animate current step out to right
            bankBankIdStep.style.transform = 'translateX(100%)';
            bankBankIdStep.style.opacity = '0';
            
            // Prepare previous step (start from left)
            bankSelectStep.style.transform = 'translateX(-100%)';
            bankSelectStep.style.opacity = '0';
            
            // After a brief moment, slide in the bank step
            setTimeout(() => {
                bankBankIdStep.classList.remove('active');
                bankSelectStep.classList.add('active');
                
                // Reset title
                document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
                
                requestAnimationFrame(() => {
                    bankSelectStep.style.transform = 'translateX(0)';
                    bankSelectStep.style.opacity = '1';
                });
            }, 10);
        });
    }
    
    // Account selection
    accountItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selected from all
            accountItems.forEach(acc => acc.classList.remove('selected'));
            // Add selected to clicked
            this.classList.add('selected');
            // Enable connect button
            connectBankButton.disabled = false;
            
            // Update button text with selected account name
            selectedAccountName = this.querySelector('.account-name').textContent;
            connectBankButton.textContent = 'Anslut ' + selectedAccountName;
        });
    });
    
    // Connect bank button
    if (connectBankButton) {
        connectBankButton.addEventListener('click', function() {
            // Show loading state
            connectBankButton.classList.add('loading');
            connectBankButton.disabled = true;
            
            // Simulate connection process - go to success step
            setTimeout(() => {
                // Hide account selection step
                accountSelectStep.style.transform = 'translateX(-100%)';
                accountSelectStep.style.opacity = '0';
                
                setTimeout(() => {
                    accountSelectStep.classList.remove('active');
                    bankSuccessStep.classList.add('active');
                    
                    // Hide title for success step
                    document.getElementById('bankPopupTitle').style.display = 'none';
                    
                    // Remove loading state
                    connectBankButton.classList.remove('loading');
                    
                    // BankID tab switching
                    const bankIdMobileTab = document.getElementById('bankIdMobileTab');
                    const bankIdCardTab = document.getElementById('bankIdCardTab');
                    const bankIdMobileContent = document.getElementById('bankIdMobileContent');
                    const bankIdCardContent = document.getElementById('bankIdCardContent');
                    
                    if (bankIdMobileTab) {
                        bankIdMobileTab.addEventListener('click', function() {
                            bankIdMobileTab.classList.add('active');
                            bankIdCardTab.classList.remove('active');
                            bankIdMobileContent.style.display = 'block';
                            bankIdCardContent.classList.remove('active');
                        });
                    }
                    
                    if (bankIdCardTab) {
                        bankIdCardTab.addEventListener('click', function() {
                            bankIdCardTab.classList.add('active');
                            bankIdMobileTab.classList.remove('active');
                            bankIdMobileContent.style.display = 'none';
                            bankIdCardContent.classList.add('active');
                        });
                    }
                    
                        // After 2 seconds, show spinner
                        setTimeout(() => {
                            const bankIdQrContainer = document.getElementById('bankIdQrContainer');
                            bankIdQrContainer.innerHTML = '<div class="bank-bankid-spinner"></div>';
                            
                            // After another 2 seconds, go to account selection
                            setTimeout(() => {
                                bankBankIdStep.classList.remove('active');
                                accountSelectStep.classList.add('active');
                                
                                // Update title for account selection step
                                document.getElementById('bankPopupTitle').textContent = 'Anslut konto i ' + selectedBankName;
                            
                            // Reset QR code for next time
                            bankIdQrContainer.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <rect width="200" height="200" fill="white"/>
                                <g fill="black">
                                    <rect x="20" y="20" width="20" height="20"/>
                                    <rect x="60" y="20" width="20" height="20"/>
                                    <rect x="80" y="20" width="20" height="20"/>
                                    <rect x="100" y="20" width="20" height="20"/>
                                    <rect x="140" y="20" width="20" height="20"/>
                                    <rect x="160" y="20" width="20" height="20"/>
                                    <rect x="20" y="40" width="20" height="20"/>
                                    <rect x="100" y="40" width="20" height="20"/>
                                    <rect x="160" y="40" width="20" height="20"/>
                                    <rect x="20" y="60" width="20" height="20"/>
                                    <rect x="60" y="60" width="20" height="20"/>
                                    <rect x="100" y="60" width="20" height="20"/>
                                    <rect x="120" y="60" width="20" height="20"/>
                                    <rect x="160" y="60" width="20" height="20"/>
                                    <rect x="20" y="80" width="20" height="20"/>
                                    <rect x="60" y="80" width="20" height="20"/>
                                    <rect x="100" y="80" width="20" height="20"/>
                                    <rect x="140" y="80" width="20" height="20"/>
                                    <rect x="160" y="80" width="20" height="20"/>
                                    <rect x="20" y="100" width="20" height="20"/>
                                    <rect x="100" y="100" width="20" height="20"/>
                                    <rect x="120" y="100" width="20" height="20"/>
                                    <rect x="140" y="100" width="20" height="20"/>
                                    <rect x="160" y="100" width="20" height="20"/>
                                    <rect x="60" y="120" width="20" height="20"/>
                                    <rect x="80" y="120" width="20" height="20"/>
                                    <rect x="140" y="120" width="20" height="20"/>
                                    <rect x="20" y="140" width="20" height="20"/>
                                    <rect x="40" y="140" width="20" height="20"/>
                                    <rect x="60" y="140" width="20" height="20"/>
                                    <rect x="80" y="140" width="20" height="20"/>
                                    <rect x="100" y="140" width="20" height="20"/>
                                    <rect x="120" y="140" width="20" height="20"/>
                                    <rect x="140" y="140" width="20" height="20"/>
                                    <rect x="160" y="140" width="20" height="20"/>
                                    <rect x="40" y="160" width="20" height="20"/>
                                    <rect x="80" y="160" width="20" height="20"/>
                                    <rect x="120" y="160" width="20" height="20"/>
                                    <rect x="140" y="160" width="20" height="20"/>
                                </g>
                            </svg>`;
                        }, 2000);
                    }, 2000);
                }, 300);
            }, 500);
        });
    }
    
    // Success done button
    if (bankSuccessDone) {
        bankSuccessDone.addEventListener('click', function() {
            bankOverlay.classList.remove('active');
            setTimeout(() => {
                if (!bankOverlay.classList.contains('active')) {
                    bankOverlay.style.display = 'none';
                    // Reset all steps
                    bankSelectStep.classList.add('active');
                    accountSelectStep.classList.remove('active');
                    const bankBankIdStep = document.getElementById('bankBankIdStep');
                    bankBankIdStep.classList.remove('active');
                    bankSuccessStep.classList.remove('active');
                    // Reset transforms
                    bankSelectStep.style.transform = '';
                    bankSelectStep.style.opacity = '';
                    accountSelectStep.style.transform = '';
                    accountSelectStep.style.opacity = '';
                    bankBankIdStep.style.transform = '';
                    bankBankIdStep.style.opacity = '';
                    accountItems.forEach(acc => acc.classList.remove('selected'));
                    connectBankButton.disabled = true;
                    connectBankButton.textContent = 'Anslut konto';
                    // Reset title
                    document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
                }
            }, 300);
        });
    }
    
    // Close on overlay click
    if (bankOverlay) {
        bankOverlay.addEventListener('click', function(e) {
            if (e.target === bankOverlay) {
                bankOverlay.classList.remove('active');
                setTimeout(() => {
                    if (!bankOverlay.classList.contains('active')) {
                        bankOverlay.style.display = 'none';
                        // Reset steps
                        bankSelectStep.classList.add('active');
                        accountSelectStep.classList.remove('active');
                        const bankBankIdStep = document.getElementById('bankBankIdStep');
                        bankBankIdStep.classList.remove('active');
                        // Reset transforms
                        bankSelectStep.style.transform = '';
                        bankSelectStep.style.opacity = '';
                        accountSelectStep.style.transform = '';
                        accountSelectStep.style.opacity = '';
                        bankBankIdStep.style.transform = '';
                        bankBankIdStep.style.opacity = '';
                        accountItems.forEach(acc => acc.classList.remove('selected'));
                        connectBankButton.disabled = true;
                        connectBankButton.textContent = 'Anslut konto';
                        // Reset title
                        document.getElementById('bankPopupTitle').textContent = 'Anslut konto';
                    }
                }, 300);
            }
        });
    }
}

// ISK popup functionality
function initializeIskPopup() {
    const iskOverlay = document.getElementById('iskOverlay');
    const closeIskPopup = document.getElementById('closeIskPopup');
    const iskButton = document.querySelectorAll('.nav-item-sidebar')[7]; // 8th item (Öppna ISK)
    const iskStep1 = document.getElementById('iskStep1');
    const iskStep2 = document.getElementById('iskStep2');
    const iskStep3 = document.getElementById('iskStep3');
    const iskSuccessStep = document.getElementById('iskSuccessStep');
    const categoryItems = document.querySelectorAll('.category-item');
    const iskNextStep1 = document.getElementById('iskNextStep1');
    const iskAccountName = document.getElementById('iskAccountName');
    const iskNextStep2 = document.getElementById('iskNextStep2');
    const iskCheckbox1 = document.getElementById('iskCheckbox1');
    const iskCheckbox2 = document.getElementById('iskCheckbox2');
    const iskComplete = document.getElementById('iskComplete');
    const iskSuccessDone = document.getElementById('iskSuccessDone');
    
    let selectedCategory = '';
    let iskCurrentStep = 1;
    
    function updateIskProgress() {
        const progress1 = document.getElementById('iskProgress1');
        const progress2 = document.getElementById('iskProgress2');
        const progress3 = document.getElementById('iskProgress3');
        const progress4 = document.getElementById('iskProgress4');
        const indicator = document.getElementById('iskStepIndicator');
        
        if (progress1) progress1.classList.toggle('active', iskCurrentStep >= 1);
        if (progress2) progress2.classList.toggle('active', iskCurrentStep >= 2);
        if (progress3) progress3.classList.toggle('active', iskCurrentStep >= 3);
        if (progress4) progress4.classList.toggle('active', iskCurrentStep >= 4);
        if (indicator) indicator.textContent = `Steg ${iskCurrentStep} av 4`;
    }
    
    // Open ISK popup
    if (iskButton && iskOverlay) {
        iskButton.addEventListener('click', function() {
            iskOverlay.style.display = 'flex';
            iskCurrentStep = 1;
            updateIskProgress();
            if (iskStep1) iskStep1.classList.add('active');
            if (iskStep2) iskStep2.classList.remove('active');
            if (iskStep3) iskStep3.classList.remove('active');
            if (iskSuccessStep) iskSuccessStep.classList.remove('active');
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    iskOverlay.classList.add('active');
                });
            });
        });
    }
    
    // Close ISK popup
    const closeIskPopupFunc = function() {
        iskOverlay.classList.remove('active');
        setTimeout(() => {
            if (!iskOverlay.classList.contains('active')) {
                iskOverlay.style.display = 'none';
                // Reset
                iskCurrentStep = 1;
                categoryItems.forEach(item => item.classList.remove('selected'));
                selectedCategory = '';
                if (iskAccountName) iskAccountName.value = '';
                if (iskCheckbox1) iskCheckbox1.checked = false;
                if (iskCheckbox2) iskCheckbox2.checked = false;
                if (iskNextStep1) iskNextStep1.disabled = true;
                if (iskNextStep2) iskNextStep2.disabled = true;
                if (iskComplete) iskComplete.disabled = true;
            }
        }, 300);
    };
    
    if (closeIskPopup && iskOverlay) {
        closeIskPopup.addEventListener('click', closeIskPopupFunc);
    }
    
    // Cancel buttons
    const iskCancelStep2 = document.getElementById('iskCancelStep2');
    const iskCancelStep3 = document.getElementById('iskCancelStep3');
    
    if (iskCancelStep2 && iskOverlay) {
        iskCancelStep2.addEventListener('click', closeIskPopupFunc);
    }
    
    if (iskCancelStep3 && iskOverlay) {
        iskCancelStep3.addEventListener('click', closeIskPopupFunc);
    }
    
    // Category selection
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedCategory = this.getAttribute('data-category');
            
            // Get category info
            const categoryIcon = this.querySelector('.category-icon').innerHTML;
            const categoryName = this.querySelector('.category-name').textContent;
            const categoryDescription = this.querySelector('.category-description').textContent;
            
            // Update selected category display in step 2
            const selectedCategoryEl = document.getElementById('iskSelectedCategory');
            const selectedCategoryIconEl = document.getElementById('iskSelectedCategoryIcon');
            const selectedCategoryNameEl = document.getElementById('iskSelectedCategoryName');
            const selectedCategoryDescEl = document.getElementById('iskSelectedCategoryDescription');
            
            if (selectedCategoryEl) {
                selectedCategoryEl.style.display = 'flex';
                if (selectedCategoryIconEl) selectedCategoryIconEl.innerHTML = categoryIcon;
                if (selectedCategoryNameEl) selectedCategoryNameEl.textContent = categoryName;
                if (selectedCategoryDescEl) selectedCategoryDescEl.textContent = categoryDescription;
            }
            
            // Update placeholder text based on selected category
            const placeholders = {
                'sparande': 'T.ex. Min semesterresa',
                'buffert': 'T.ex. Nödfond',
                'pension': 'T.ex. Min pension',
                'barnspar': 'T.ex. Emmas framtid',
                'boende': 'T.ex. Kontantinsats'
            };
            
            if (iskAccountName && placeholders[selectedCategory]) {
                iskAccountName.placeholder = placeholders[selectedCategory];
            }
            
            // Move to next step
            if (iskStep1) iskStep1.classList.remove('active');
            if (iskStep2) iskStep2.classList.add('active');
            iskCurrentStep = 2;
            updateIskProgress();
        });
    });
    
    // Account name input
    if (iskAccountName && iskNextStep2) {
        iskAccountName.addEventListener('input', function() {
            iskNextStep2.disabled = this.value.trim() === '';
        });
        
        // Add Enter key listener
        iskAccountName.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                e.preventDefault();
                iskNextStep2.click();
            }
        });
    }
    
    // Step 2 to Step 3
    if (iskNextStep2) {
        iskNextStep2.addEventListener('click', function() {
            if (iskStep2) iskStep2.classList.remove('active');
            if (iskStep3) iskStep3.classList.add('active');
            iskCurrentStep = 3;
            updateIskProgress();
        });
    }
    
    // Checkboxes
    function updateIskCompleteButton() {
        if (iskComplete && iskCheckbox1 && iskCheckbox2) {
            iskComplete.disabled = !(iskCheckbox1.checked && iskCheckbox2.checked);
        }
    }
    
    if (iskCheckbox1) iskCheckbox1.addEventListener('change', updateIskCompleteButton);
    if (iskCheckbox2) iskCheckbox2.addEventListener('change', updateIskCompleteButton);
    
    // Complete ISK
    if (iskComplete) {
        iskComplete.addEventListener('click', function() {
            // Show loading state
            iskComplete.classList.add('loading');
            iskComplete.disabled = true;
            
            // After 2 seconds, move to success step
            setTimeout(() => {
                if (iskStep3) iskStep3.classList.remove('active');
                if (iskSuccessStep) iskSuccessStep.classList.add('active');
                iskCurrentStep = 4;
                updateIskProgress();
                
                // Remove loading state
                iskComplete.classList.remove('loading');
                
                const categoryNames = {
                    'sparande': 'Sparande',
                    'buffert': 'Buffert',
                    'pension': 'Pension',
                    'barnspar': 'Barnspar',
                    'boende': 'Boende'
                };
                
                const successText = document.getElementById('iskSuccessText');
                if (successText && iskAccountName) {
                    successText.textContent = 
                        `Grattis! Ditt investeringssparkonto "${iskAccountName.value}" (${categoryNames[selectedCategory]}) är nu aktivt och redo att användas. Du kan börja investera direkt.`;
                }
            }, 2000);
        });
    }
    
    // Success done
    if (iskSuccessDone && iskOverlay) {
        iskSuccessDone.addEventListener('click', function() {
            iskOverlay.classList.remove('active');
            setTimeout(() => {
                if (!iskOverlay.classList.contains('active')) {
                    iskOverlay.style.display = 'none';
                    // Reset all
                    iskCurrentStep = 1;
                    if (iskStep1) iskStep1.classList.add('active');
                    if (iskStep2) iskStep2.classList.remove('active');
                    if (iskStep3) iskStep3.classList.remove('active');
                    if (iskSuccessStep) iskSuccessStep.classList.remove('active');
                    categoryItems.forEach(item => item.classList.remove('selected'));
                    selectedCategory = '';
                    if (iskAccountName) iskAccountName.value = '';
                    if (iskCheckbox1) iskCheckbox1.checked = false;
                    if (iskCheckbox2) iskCheckbox2.checked = false;
                    if (iskNextStep1) iskNextStep1.disabled = true;
                    if (iskNextStep2) iskNextStep2.disabled = true;
                    if (iskComplete) iskComplete.disabled = true;
                    updateIskProgress();
                }
            }, 300);
        });
    }
    
    // Close on overlay click
    if (iskOverlay) {
        iskOverlay.addEventListener('click', function(e) {
            if (e.target === iskOverlay && closeIskPopup) {
                closeIskPopup.click();
            }
        });
    }
}

// Podcast popup functionality
function initializePodcastPopup() {
    const podcastOverlay = document.getElementById('podcastOverlay');
    const closePodcastPopup = document.getElementById('closePodcastPopup');
    const podcastNavItem = document.querySelector('.nav-item:has(.nav-icon.purple)');
    
    // Open podcast popup
    if (podcastNavItem && podcastOverlay) {
        podcastNavItem.addEventListener('click', function() {
            podcastOverlay.style.display = 'flex';
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    podcastOverlay.classList.add('active');
                });
            });
        });
    }
    
    // Close podcast popup
    const closePodcastPopupFunc = function() {
        podcastOverlay.classList.remove('active');
        setTimeout(() => {
            if (!podcastOverlay.classList.contains('active')) {
                podcastOverlay.style.display = 'none';
            }
        }, 300);
    };
    
    if (closePodcastPopup && podcastOverlay) {
        closePodcastPopup.addEventListener('click', closePodcastPopupFunc);
    }
    
    // Close on overlay click
    if (podcastOverlay) {
        podcastOverlay.addEventListener('click', function(e) {
            if (e.target === podcastOverlay && closePodcastPopup) {
                closePodcastPopup.click();
            }
        });
    }
}

function simulateMonthlySavingsAnalysis() {
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatMessages) {
        return;
    }
    // Create the main analysis message
    const analysisMessage = document.createElement('div');
    analysisMessage.className = 'chat-message ai analysis-message';
    analysisMessage.innerHTML = `
        <div class="message-content">
            <div class="analysis-description"></div>
            <div class="analysis-container">
                <div class="analysis-steps">
                    <div class="analysis-step" data-step="1">
                        <div class="analysis-step-icon pending">
                            <div class="step-circle"></div>
                        </div>
                        <div class="analysis-step-content">
                            <div class="analysis-step-title">Investeringsplan är skapad</div>
                            <div class="step-progress-circle">
                                <div class="progress-circle-fill"></div>
                            </div>
                            <div class="analysis-step-spacer"></div>
                        </div>
                    </div>
                    
                    <div class="analysis-step" data-step="2">
                        <div class="analysis-step-icon pending">
                            <div class="step-circle"></div>
                        </div>
                        <div class="analysis-step-content">
                            <div class="analysis-step-title">Samlar in dina tidigare aktiviteter</div>
                            <div class="step-progress-circle">
                                <div class="progress-circle-fill"></div>
                            </div>
                            <div class="analysis-step-spacer"></div>
                        </div>
                    </div>
                    
                    <div class="analysis-step" data-step="3">
                        <div class="analysis-step-icon pending">
                            <div class="step-circle"></div>
                        </div>
                        <div class="analysis-step-content">
                            <div class="analysis-step-title">Analyserar aktiviteter</div>
                            <div class="step-progress-circle">
                                <div class="progress-circle-fill"></div>
                            </div>
                            <div class="analysis-step-spacer"></div>
                        </div>
                    </div>
                    
                    <div class="analysis-step" data-step="4">
                        <div class="analysis-step-icon pending">
                            <div class="step-circle"></div>
                        </div>
                        <div class="analysis-step-content">
                            <div class="analysis-step-title">Skapar föreslagna investeringspaket</div>
                            <div class="step-progress-circle">
                                <div class="progress-circle-fill"></div>
                            </div>
                            <div class="analysis-step-spacer"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-spinner">
                <svg class="typing-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 18.36l12.72-12.72"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(analysisMessage);
    
    const steps = analysisMessage.querySelectorAll('.analysis-step');
    const container = analysisMessage.querySelector('.analysis-container');
    const description = analysisMessage.querySelector('.analysis-description');
    
    // Type the description first
    function typeDescription() {
        const text = "Jag analyserar nu din ekonomiska situation och tidigare aktiviteter för att skapa de bästa investeringspaketen för dig. Detta tar bara några sekunder.";
        const words = text.split(' ');
        let i = 0;
        description.innerHTML = '';
        
        function type() {
            if (i < words.length) {
                description.innerHTML += (i > 0 ? ' ' : '') + words[i];
                i++;
                const progress = i / words.length;
                setTimeout(type, 80 - (60 * progress));
            } else {
                // After description is typed, show the container and start step animation
                setTimeout(() => {
                    container.classList.add('active');
                    setTimeout(() => {
                        showSteps(0);
                    }, 200);
                }, 200);
            }
        }
        type();
    }
    
    // Add delay before starting to type the description
    setTimeout(() => {
        typeDescription();
    }, 500);
    
    // First, animate steps appearing one by one
    function showSteps(index) {
        if (index < steps.length) {
            steps[index].classList.add('visible');
            setTimeout(() => {
                showSteps(index + 1);
            }, 200);
        } else {
            // After all steps are visible, start checking them
            setTimeout(() => {
                animateNextStep();
            }, 400);
        }
    }
    
    // Animate the steps (start from step 1)
    let currentStep = 0; // Start from step 1 (index 0)
    
    // Varied timing delays for more natural feel
    const stepDelays = [1200, 4000, 3000, 4000];
    
    function animateNextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            const icon = step.querySelector('.analysis-step-icon');
            const progressCircle = step.querySelector('.step-progress-circle');
            const titleElement = step.querySelector('.analysis-step-title');
            
            // Show progress circle for current step
            progressCircle.classList.add('active');
            
            // Get the delay for this step
            const delay = stepDelays[currentStep] || 1500;
            
            // Special handling for step 2 - change text halfway through
            if (currentStep === 1) {
                setTimeout(() => {
                    titleElement.textContent = '17 aktiviteter hittade';
                    
                    // Add badges sequentially
                    const badges = ['Fonder', 'Aktier', 'Insättningar', '+14'];
                    badges.forEach((text, index) => {
                        setTimeout(() => {
                            const badge = document.createElement('span');
                            badge.className = 'analysis-badge';
                            badge.textContent = text;
                            titleElement.appendChild(badge);
                        }, 1000 + (index * 150));
                    });
                }, delay / 2);
            }
            
            // Special handling for step 3 - add badge halfway through
            if (currentStep === 2) {
                setTimeout(() => {
                    const badge = document.createElement('span');
                    badge.className = 'analysis-badge';
                    badge.textContent = '17';
                    titleElement.appendChild(badge);
                }, delay / 2);
            }
            
            // Animate progress circle over the same duration as the step delay
            let progress = 0;
            const progressIncrement = 100 / (delay / 15); // Calculate increment based on delay
            const progressInterval = setInterval(() => {
                progress += progressIncrement;
                const degrees = (progress / 100) * 360;
                progressCircle.style.background = `conic-gradient(#000 ${degrees}deg, #EDEDED ${degrees}deg)`;
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    // Hide progress circle and show checkmark at the same time
                    progressCircle.classList.remove('active');
                    icon.classList.remove('pending');
                    icon.classList.add('completed');
                    icon.innerHTML = '<img src="icons/iconStepCheck.svg" alt="Completed" />';
                }
            }, 15);
            
            // Move to next step after the same delay
            setTimeout(() => {
                currentStep++;
                animateNextStep();
            }, delay);
        } else {
            // All steps completed, hide spinner and show final message
            setTimeout(() => {
                // Remove only the spinner
                const spinner = analysisMessage.querySelector('.analysis-spinner');
                if (spinner) {
                    spinner.remove();
                }
                
                // Show the final response with packages
                const finalMessage = document.createElement('div');
                finalMessage.className = 'chat-message ai';
                const finalContent = document.createElement('div');
                finalContent.className = 'message-content';
                finalMessage.appendChild(finalContent);
                chatMessages.appendChild(finalMessage);
                
                // Type the final message
                function typeFinalMessage() {
                    const text = "Här har du tre paket du kan börja månadsspara i – Tova liten, mellan och stor. Paketen är utformade efter din ekonomi och tidigare aktiviteter.";
                    const words = text.split(' ');
                    let i = 0;
                    finalContent.innerHTML = '';
                    
                    function type() {
                        if (i < words.length) {
                            finalContent.innerHTML += (i > 0 ? ' ' : '') + words[i];
                            i++;
                            const progress = i / words.length;
                            setTimeout(type, 80 - (60 * progress));
                        } else {
                            // After typing is complete, show packages
                            setTimeout(() => {
                                showPackages();
                            }, 500);
                        }
                    }
                    type();
                }
                
                // Function to show packages
                function showPackages() {
                    const packagesContainer = document.createElement('div');
                    packagesContainer.className = 'savings-packages';
                    packagesContainer.innerHTML = `
                        <div class="package-card" data-package="Tova liten">
                            <div class="package-header">
                                <div class="package-title">Tova liten</div>
                                <div class="package-subtitle">Ett sparande som fokuserar på trygghet och stabilitet framför högre risk och potentiell avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 10%, #181512 10% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Obligationer</div>
                                        <div class="allocation-value">80%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">500 SEK</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">5-års avkastning</div>
                                    <div class="detail-value">+3.2%</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Förväntad avkastning</div>
                                    <div class="detail-value">3.5% per år</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova liten">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova liten">Välj Tova Liten</button>
                            </div>
                        </div>
                        <div class="package-card" data-package="Tova mellan">
                            <div class="package-header">
                                <div class="package-title">Tova mellan</div>
                                <div class="package-subtitle">En balanserad portfölj som kombinerar stabilitet med möjligheten till högre avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 50%, #181512 50% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">50%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Obligationer</div>
                                        <div class="allocation-value">40%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">1 000 SEK</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">5-års avkastning</div>
                                    <div class="detail-value">+5.8%</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Förväntad avkastning</div>
                                    <div class="detail-value">6.2% per år</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova mellan">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova mellan">Välj Tova Mellan</button>
                            </div>
                        </div>
                        <div class="package-card" data-package="Tova stor">
                            <div class="package-header">
                                <div class="package-title">Tova stor</div>
                                <div class="package-subtitle">En aggressiv portfölj som fokuserar på långsiktig tillväxt och högre avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 20%, #181512 20% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">80%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Obligationer</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">2 000 SEK</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">5-års avkastning</div>
                                    <div class="detail-value">+8.4%</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Förväntad avkastning</div>
                                    <div class="detail-value">8.8% per år</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova stor">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova stor">Välj Tova Stor</button>
                            </div>
                        </div>
                    `;
                    chatMessages.appendChild(packagesContainer);
                    
                    // Add suggestion cards after packages
                    setTimeout(() => {
                        const suggestionsWrapper = document.createElement('div');
                        suggestionsWrapper.className = 'suggestions-wrapper';
                        
                        const heading = document.createElement('h3');
                        heading.className = 'suggestions-heading';
                        heading.textContent = 'Kan jag hjälpa till med något annat?';
                        
                        const suggestionsContainer = document.createElement('div');
                        suggestionsContainer.className = 'suggestions-container';
                        suggestionsContainer.innerHTML = `
                            <div class="suggestion-card" data-message="Jag vill starta ett månadssparande">
                                <span>Jag vill starta ett månadssparande</span>
                            </div>
                            <div class="suggestion-card" data-message="Tovas 10 populäraste fonder">
                                <span>Tovas 10 populäraste fonder</span>
                            </div>
                            <div class="suggestion-card" data-message="Fonder med bäst avkastning på 3 år">
                                <span>Fonder med bäst avkastning på 3 år</span>
                            </div>
                            <div class="suggestion-card" data-message="Hur mycket ska man spara per månad?">
                                <span>Hur mycket ska man spara per månad?</span>
                            </div>
                        `;
                        
                        suggestionsWrapper.appendChild(heading);
                        suggestionsWrapper.appendChild(suggestionsContainer);
                        chatMessages.appendChild(suggestionsWrapper);
                        
                        // Add click handlers to suggestion cards
                        suggestionsContainer.querySelectorAll('.suggestion-card').forEach(card => {
                            card.addEventListener('click', function() {
                                const text = this.getAttribute('data-message');
                                // Dispatch custom event to trigger chat
                                document.dispatchEvent(new CustomEvent('triggerChat', { detail: { message: text } }));
                            });
                        });
                    }, 300);
                }
                
                typeFinalMessage();
            }, 1000);
        }
    }
    
    // Container will be shown and steps will start appearing after delays
}

// AI Carousel functionality
function initializeAiCarousel() {
    const aiCarouselOverlay = document.getElementById('aiCarouselOverlay');
    const closeAiCarouselBtn = document.getElementById('closeAiCarousel');
    const aiCarouselSlides = document.getElementById('aiCarouselSlides');
    const aiCarouselBullets = document.querySelectorAll('.ai-carousel-bullet');
    const aiFundButton = document.querySelector('.ai-fund-button');
    
    let currentSlide = 0;
    
    function updateCarousel() {
        aiCarouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update bullets
        aiCarouselBullets.forEach((bullet, index) => {
            if (index === currentSlide) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });
        
        // Update button states
        const prevBtn = document.getElementById('aiCarouselPrev');
        const prevBtn2 = document.getElementById('aiCarouselPrev2');
        const prevBtn3 = document.getElementById('aiCarouselPrev3');
        
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (prevBtn2) prevBtn2.disabled = currentSlide === 0;
        if (prevBtn3) prevBtn3.disabled = currentSlide === 0;
    }
    
    function openAiCarousel() {
        aiCarouselOverlay.style.display = 'flex';
        currentSlide = 0;
        updateCarousel();
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiCarouselOverlay.classList.add('active');
            });
        });
    }
    
    function closeAiCarousel() {
        aiCarouselOverlay.classList.remove('active');
        setTimeout(() => {
            if (!aiCarouselOverlay.classList.contains('active')) {
                aiCarouselOverlay.style.display = 'none';
                currentSlide = 0;
                updateCarousel();
            }
        }, 300);
    }
    
    function nextSlide() {
        if (currentSlide < 2) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    // Open carousel when clicking AI fund button
    if (aiFundButton) {
        aiFundButton.addEventListener('click', openAiCarousel);
    }
    
    // Close carousel
    if (closeAiCarouselBtn) {
        closeAiCarouselBtn.addEventListener('click', closeAiCarousel);
    }
    
    // Close on overlay click
    if (aiCarouselOverlay) {
        aiCarouselOverlay.addEventListener('click', function(e) {
            if (e.target === aiCarouselOverlay) {
                closeAiCarousel();
            }
        });
    }
    
    // Navigation buttons
    const nextBtn = document.getElementById('aiCarouselNext');
    const nextBtn2 = document.getElementById('aiCarouselNext2');
    const prevBtn2 = document.getElementById('aiCarouselPrev2');
    const prevBtn3 = document.getElementById('aiCarouselPrev3');
    const doneBtn = document.getElementById('aiCarouselDone');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (nextBtn2) nextBtn2.addEventListener('click', nextSlide);
    if (prevBtn2) prevBtn2.addEventListener('click', prevSlide);
    if (prevBtn3) prevBtn3.addEventListener('click', prevSlide);
    if (doneBtn) doneBtn.addEventListener('click', closeAiCarousel);
    
    // Bullet navigation
    aiCarouselBullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
        });
    });
}

// Package sidebar functionality
function initializePackageSidebar() {
    const packageSidebar = document.getElementById('packageSidebar');
    const packageSidebarOverlay = document.getElementById('packageSidebarOverlay');
    const closePackageSidebarBtn = document.getElementById('closePackageSidebar');
    
    const packageData = {
        'Tova liten': {
            title: 'Tova liten',
            subtitle: 'Ett sparande som fokuserar på trygghet och stabilitet framför högre risk och potentiell avkastning.',
            pie: 'conic-gradient(#F5F4F2 0% 10%, #181512 10% 100%)',
            stocks: '10%',
            bonds: '90%',
            other: '0%',
            monthly: '500 kr',
            fiveYear: '32 000 kr',
            return: '+2 000 kr'
        },
        'Tova mellan': {
            title: 'Tova mellan',
            subtitle: 'En balanserad mix av trygghet och tillväxt för stabil långsiktig avkastning.',
            pie: 'conic-gradient(#F5F4F2 0% 40%, #181512 40% 100%)',
            stocks: '40%',
            bonds: '60%',
            other: '0%',
            monthly: '1 500 kr',
            fiveYear: '98 000 kr',
            return: '+8 000 kr'
        },
        'Tova stor': {
            title: 'Tova stor',
            subtitle: 'Maximera tillväxtpotentialen med en aktietung portfölj för långsiktiga sparare.',
            pie: 'conic-gradient(#F5F4F2 0% 70%, #181512 70% 100%)',
            stocks: '70%',
            bonds: '30%',
            other: '0%',
            monthly: '2 000 kr',
            fiveYear: '129 000 kr',
            return: '+20 000 kr'
        }
    };
    
    function openPackageSidebar(packageName) {
        const data = packageData[packageName];
        if (!data) return;
        
        // Update sidebar content
        document.getElementById('packageSidebarTitle').textContent = data.title;
        document.getElementById('packageSidebarSubtitle').textContent = data.subtitle;
        document.getElementById('packageSidebarPie').style.background = data.pie;
        document.getElementById('packageSidebarStocks').textContent = data.stocks;
        document.getElementById('packageSidebarBonds').textContent = data.bonds;
        document.getElementById('packageSidebarOther').textContent = data.other;
        document.getElementById('packageSidebarMonthly').textContent = data.monthly;
        document.getElementById('packageSidebarFiveYear').textContent = data.fiveYear;
        document.getElementById('packageSidebarReturn').textContent = data.return;
        
        // Show overlay and sidebar with animation
        packageSidebarOverlay.style.display = 'block';
        requestAnimationFrame(() => {
            packageSidebarOverlay.classList.add('active');
            packageSidebar.classList.add('active');
        });
    }
    
    function closePackageSidebar() {
        packageSidebarOverlay.classList.remove('active');
        packageSidebar.classList.remove('active');
        // Hide overlay after transition
        setTimeout(() => {
            if (!packageSidebarOverlay.classList.contains('active')) {
                packageSidebarOverlay.style.display = 'none';
            }
        }, 400);
    }
    
    // Close button
    if (closePackageSidebarBtn) {
        closePackageSidebarBtn.addEventListener('click', closePackageSidebar);
    }
    
    // Close on overlay click
    if (packageSidebarOverlay) {
        packageSidebarOverlay.addEventListener('click', closePackageSidebar);
    }
    
    // Event delegation for package content buttons and package cards (since they're dynamically created)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('package-content-btn') || e.target.classList.contains('package-secondary-btn')) {
            const packageName = e.target.getAttribute('data-package');
            openPackageSidebar(packageName);
        } else if (e.target.closest('.package-card')) {
            const packageCard = e.target.closest('.package-card');
            const packageName = packageCard.getAttribute('data-package');
            openPackageSidebar(packageName);
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchOverlay = document.getElementById('searchOverlay');
    const cmdKBadge = document.getElementById('cmdKBadge');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    const allFunds = [
        { name: 'Tova Aktiefond', fee: '0,92%', return: '+5,24%', positive: true, country: 'se', info: 'Bred svensk aktiefond' },
        { name: 'Global Auto 6', fee: '2,45%', return: '+9,80%', positive: true, country: 'se', info: 'Global indexfond' },
        { name: 'MS INFV Handel', fee: '3,60%', return: '-0,97%', positive: false, country: 'se', info: 'Handelsbanken fond' },
        { name: 'BG Aktiefond', fee: '1,18%', return: '+4,22%', positive: true, country: 'se', info: 'Nordisk aktiefond' },
        { name: 'Nuro Bank', fee: '1,38%', return: '+1,50%', positive: true, country: 'se', info: 'Europeisk tillväxt' },
        { name: 'Swedbank Robur Ny Teknik', fee: '1,65%', return: '+12,50%', positive: true, country: 'se', info: 'Global teknikfond' },
        { name: 'Nordea Emerging Stars', fee: '2,10%', return: '+7,30%', positive: true, country: 'se', info: 'Tillväxtmarknader' },
        { name: 'SEB Europafond', fee: '1,45%', return: '+6,85%', positive: true, country: 'se', info: 'Europeiska aktier' },
        { name: 'Handelsbanken Global Index', fee: '0,15%', return: '+8,90%', positive: true, country: 'se', info: 'Global indexfond' },
        { name: 'AMF Aktiefond Sverige', fee: '0,38%', return: '+11,20%', positive: true, country: 'se', info: 'Svenska aktier' },
        { name: 'Länsförsäkringar Global Index', fee: '0,20%', return: '+9,15%', positive: true, country: 'se', info: 'Global indexfond' },
        { name: 'Skandia Sverige Hållbar', fee: '0,85%', return: '+7,45%', positive: true, country: 'se', info: 'Hållbara svenska aktier' },
        { name: 'Öhman Sverige Hållbar', fee: '1,20%', return: '+6,60%', positive: true, country: 'se', info: 'ESG-fond Sverige' },
        { name: 'Spiltan Aktiefond Investmentbolag', fee: '0,95%', return: '+13,40%', positive: true, country: 'se', info: 'Svenska investmentbolag' },
        { name: 'Carnegie Sverigefond', fee: '1,55%', return: '+8,25%', positive: true, country: 'se', info: 'Aktivt förvaltad' },
        { name: 'Didner & Gerge Aktiefond', fee: '1,75%', return: '+10,10%', positive: true, country: 'se', info: 'Koncentrerad portfölj' },
        { name: 'Apple AAPL', fee: '-', return: '+28,50%', positive: true, country: 'us', info: 'Teknologi & consumer' },
        { name: 'Microsoft MSFT', fee: '-', return: '+31,20%', positive: true, country: 'us', info: 'Molntjänster & AI' },
        { name: 'Tesla TSLA', fee: '-', return: '+45,80%', positive: true, country: 'us', info: 'Elbilar & energi' },
        { name: 'Amazon AMZN', fee: '-', return: '+38,90%', positive: true, country: 'us', info: 'E-handel & cloud' },
        { name: 'Nvidia NVDA', fee: '-', return: '+125,60%', positive: true, country: 'us', info: 'GPU & AI-chips' },
        { name: 'Meta META', fee: '-', return: '+42,30%', positive: true, country: 'us', info: 'Sociala medier & VR' },
        { name: 'Alphabet GOOGL', fee: '-', return: '+35,70%', positive: true, country: 'us', info: 'Sökmotorer & AI' },
        { name: 'Netflix NFLX', fee: '-', return: '+22,40%', positive: true, country: 'us', info: 'Streaming & content' },
        { name: 'Volvo B', fee: '-', return: '+14,20%', positive: true, country: 'se', info: 'Fordonsindustri' },
        { name: 'Ericsson B', fee: '-', return: '+8,15%', positive: true, country: 'se', info: 'Telekom & 5G' },
        { name: 'H&M B', fee: '-', return: '-2,40%', positive: false, country: 'se', info: 'Mode & retail' },
        { name: 'Hennes & Mauritz', fee: '-', return: '-2,40%', positive: false, country: 'se', info: 'Mode & retail' },
        { name: 'Atlas Copco A', fee: '-', return: '+18,60%', positive: true, country: 'se', info: 'Industrimaskiner' },
        { name: 'Investor B', fee: '-', return: '+16,80%', positive: true, country: 'se', info: 'Investmentbolag' }
    ];

    function getFlagIcon(c) {
        return c === 'us' ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#B22234"/><rect x="0" y="1.85" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="4.92" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="8" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="11.08" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="14.15" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="17.23" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="20.31" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="0" width="9.6" height="11.08" fill="#3C3B6E"/></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#006AA7"/><rect x="10" y="0" width="4" height="24" fill="#FECC00"/><rect x="0" y="10" width="24" height="4" fill="#FECC00"/></svg>';
    }

    function renderDropdown(funds) {
        let html = '<div class="dropdown-header"><div>Namn</div><div>Information</div><div>Total avgift</div><div style="text-align: right;">1 m.</div></div>';
        funds.forEach(f => {
            html += `<div class="dropdown-item"><div class="dropdown-name"><div class="flag-icon">${getFlagIcon(f.country)}</div><span>${f.name}</span></div><div class="dropdown-info">${f.info}</div><div class="dropdown-fee">${f.fee}</div><div class="dropdown-return ${f.positive?'positive':'negative'}">${f.return}</div></div>`;
        });
        searchDropdown.innerHTML = html;
    }

    // Function to update button visibility
    function updateSearchButtons() {
        if (searchInput.value.length > 0) {
            cmdKBadge.style.display = 'none';
            clearSearchBtn.style.display = 'flex';
        } else {
            cmdKBadge.style.display = 'block';
            clearSearchBtn.style.display = 'none';
        }
    }
    
    // Update buttons on input
    if (searchInput) {
        searchInput.addEventListener('input', updateSearchButtons);
        searchInput.addEventListener('focus', () => { 
            renderDropdown(allFunds.slice(0,5)); 
            searchDropdown.classList.add('active'); 
            searchOverlay.classList.add('active');
            // Change ⌘ + K badge background
            if (cmdKBadge) {
                cmdKBadge.style.background = '#F5F4F2';
            }
        });
        searchInput.addEventListener('blur', () => {
            // Reset ⌘ + K badge background
            if (cmdKBadge) {
                cmdKBadge.style.background = '#fff';
            }
        });
        searchInput.addEventListener('input', function() {
            const q = this.value.toLowerCase().trim();
            renderDropdown(q.length > 0 ? allFunds.filter(f => f.name.toLowerCase().includes(q)).slice(0,8) : allFunds.slice(0,5));
            searchDropdown.classList.add('active'); 
            searchOverlay.classList.add('active');
        });
    }
    
    // Clear search input when X button is clicked
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            searchInput.focus();
            renderDropdown(allFunds.slice(0,5));
            searchDropdown.classList.add('active');
            searchOverlay.classList.add('active');
            updateSearchButtons();
        });
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener('click', () => { 
            searchDropdown.classList.remove('active'); 
            searchOverlay.classList.remove('active'); 
            searchInput.blur(); 
        });
    }
    
    window.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { 
            e.preventDefault(); 
            searchInput.focus(); 
            searchDropdown.classList.add('active'); 
            searchOverlay.classList.add('active'); 
        }
        if (e.key === 'Escape') { 
            searchDropdown.classList.remove('active'); 
            searchOverlay.classList.remove('active'); 
            searchInput.blur(); 
        }
    });
}

// Chat functionality
function initializeChat() {
    const textarea = document.getElementById('chatInput');
    const textareaActive = document.getElementById('chatInputActive');
    const sendButton = document.getElementById('sendButton');
    const sendButtonActive = document.getElementById('sendButtonActive');
    const chatMessages = document.getElementById('chatMessages');
    const welcomeContent = document.getElementById('welcomeContent');
    const chatInputContainer = document.getElementById('chatInputContainer');
    
    let isFirstMessage = true;
    let hasShownSuggestions = false;
    
    if (sendButton) sendButton.disabled = true;
    if (sendButtonActive) sendButtonActive.disabled = true;

    if (textarea) {
        textarea.addEventListener('input', function() { 
            sendButton.disabled = this.value.trim() === ''; 
        });
    }
    
    if (textareaActive) {
        textareaActive.addEventListener('input', function() { 
            sendButtonActive.disabled = this.value.trim() === ''; 
        });
    }

    function addMessage(text, isUser) {
        const div = document.createElement('div');
        div.className = `chat-message ${isUser?'user':'ai'}`;
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        div.appendChild(content);
        chatMessages.appendChild(div);
        const chatArea = document.querySelector('.chat-area');
        requestAnimationFrame(() => {
            if (!isFirstMessage) {
                // Scroll to show new messages above the input
                setTimeout(() => {
                    const inputContainer = document.getElementById('chatInputActive');
                    if (inputContainer) {
                        const inputRect = inputContainer.getBoundingClientRect();
                        const chatRect = chatArea.getBoundingClientRect();
                        const scrollPosition = inputRect.top - chatRect.top + chatArea.scrollTop - 100;
                        chatArea.scrollTop = Math.max(0, scrollPosition);
                    } else {
                        // Fallback: scroll to show the input at bottom with some space
                        chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight + 100;
                    }
                }, 100);
            }
        });
        return div;
    }

    function addTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'chat-message ai typing-message';
        const content = document.createElement('div');
        content.className = 'message-content';
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<svg class="typing-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 18.36l12.72-12.72"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        content.appendChild(typing);
        div.appendChild(content);
        chatMessages.appendChild(div);
        const chatArea = document.querySelector('.chat-area');
        requestAnimationFrame(() => {
            if (!isFirstMessage) {
                // Scroll to show new messages above the input
                setTimeout(() => {
                    const inputContainer = document.getElementById('chatInputActive');
                    if (inputContainer) {
                        const inputRect = inputContainer.getBoundingClientRect();
                        const chatRect = chatArea.getBoundingClientRect();
                        const scrollPosition = inputRect.top - chatRect.top + chatArea.scrollTop - 100;
                        chatArea.scrollTop = Math.max(0, scrollPosition);
                    } else {
                        // Fallback: scroll to show the input at bottom with some space
                        chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight + 100;
                    }
                }, 100);
            }
        });
        return div;
    }

    function typeMessage(el, text) {
        return new Promise(resolve => {
            const words = text.split(' ');
            let i = 0;
            el.innerHTML = '';
            const chatArea = document.querySelector('.chat-area');
            function type() {
                if (i < words.length) {
                    el.innerHTML += (i > 0 ? ' ' : '') + words[i];
                    i++;
                    if (!isFirstMessage) {
                        requestAnimationFrame(() => {
                            // Scroll to show new messages above the input
                setTimeout(() => {
                    const inputContainer = document.getElementById('chatInputActive');
                    if (inputContainer) {
                        const inputRect = inputContainer.getBoundingClientRect();
                        const chatRect = chatArea.getBoundingClientRect();
                        const scrollPosition = inputRect.top - chatRect.top + chatArea.scrollTop - 100;
                        chatArea.scrollTop = Math.max(0, scrollPosition);
                    } else {
                        // Fallback: scroll to show the input at bottom with some space
                        chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight + 100;
                    }
                }, 100);
                        });
                    }
                    const progress = i / words.length;
                    setTimeout(type, 80 - (60 * progress));
                } else resolve();
            }
            type();
        });
    }

    function getFlagIcon(c) {
        return c === 'us' ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#B22234"/><rect x="0" y="1.85" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="4.92" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="8" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="11.08" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="14.15" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="17.23" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="20.31" width="24" height="1.54" fill="#FFFFFF"/><rect x="0" y="0" width="9.6" height="11.08" fill="#3C3B6E"/></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#006AA7"/><rect x="10" y="0" width="4" height="24" fill="#FECC00"/><rect x="0" y="10" width="24" height="4" fill="#FECC00"/></svg>';
    }

    function addSuggestionCards() {
        const suggestionsWrapper = document.createElement('div');
        suggestionsWrapper.className = 'suggestions-wrapper';
        
        const heading = document.createElement('h3');
        heading.className = 'suggestions-heading';
        heading.textContent = 'Kan jag hjälpa till med något annat?';
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';
        suggestionsContainer.innerHTML = `
            <div class="suggestion-card" data-message="Jag vill starta ett månadssparande">
                <span>Jag vill starta ett månadssparande</span>
            </div>
            <div class="suggestion-card" data-message="Visa mig Tovas 10 populäraste fonder 2025">
                <span>Visa mig Tovas 10 populäraste fonder 2025</span>
            </div>
            <div class="suggestion-card" data-message="Hur mycket ska man spara per månad?">
                <span>Hur mycket ska man spara per månad?</span>
            </div>
            <div class="suggestion-card" data-message="Visa mig fonder med bäst avkastning på 3 år">
                <span>Visa mig fonder med bäst avkastning på 3 år</span>
            </div>
        `;
        
        suggestionsWrapper.appendChild(heading);
        suggestionsWrapper.appendChild(suggestionsContainer);
        
        // Add click handlers to the new suggestion cards
        suggestionsContainer.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', function() {
                const text = this.getAttribute('data-message');
                addMessage(text, true);
                addConversationToList(text);
                simulateAIResponse(text);
                
                // Ensure proper scroll behavior after clicking suggestion
                setTimeout(() => {
                    const chatArea = document.querySelector('.chat-area');
                    const inputContainer = document.getElementById('chatInputActive');
                    if (inputContainer && chatArea) {
                        const inputRect = inputContainer.getBoundingClientRect();
                        const chatRect = chatArea.getBoundingClientRect();
                        const scrollPosition = inputRect.top - chatRect.top + chatArea.scrollTop - 100;
                        chatArea.scrollTop = Math.max(0, scrollPosition);
                    }
                }, 100);
            });
        });
        
        chatMessages.appendChild(suggestionsWrapper);
    }

    function simulateAIResponse(msg) {
        const lm = msg.toLowerCase();
        
        if (lm.includes('månadssparande')) {
            // Special animation for monthly savings
            simulateMonthlySavingsAnalysis();
            return;
        }
        
        const typing = addTypingIndicator();
        setTimeout(() => {
            typing.remove();
            let response = '', showPackages = false, showFundsList = false;
            
            if (lm.includes('varför') && (lm.includes('tova') || lm.includes('paket'))) {
                response = 'Tovas paket tar bort komplexiteten i sparande. Istället för att välja bland tusentals fonder får du färdiga, balanserade portföljer som vår AI optimerat baserat på din risknivå. Du slipper göra egna analyser, ombalansering sker automatiskt, och avgifterna är transparenta. Plus – paketen anpassas efter din ekonomiska situation, så du får ett sparande som faktiskt passar just dig. Det är som att ha en personlig rådgivare, fast enklare och billigare.';
            } else if (lm.includes('populäraste') || lm.includes('tovas 10')) {
                response = 'Här är Tovas 10 mest populära fonder och aktier för 2025:';
                showFundsList = true;
            } else if (lm.includes('skillnaden mellan aktier och fonder')) {
                response = 'Aktier är andelar i enskilda företag - när du köper en Apple-aktie äger du en liten del av Apple. Fonder är istället "korgar" med många olika aktier eller obligationer. När du köper en fond sprider du automatiskt din risk över många företag. Fonder är ofta ett bra val för dig som vill ha enklare och mer diversifierad investering, medan aktier ger dig mer kontroll men kräver mer arbete och kunskap.';
            } else if (lm.includes('fonder')) {
                response = 'Jag har hittat flera intressanta fonder åt dig. Bland de mest populära just nu är Tova Aktiefond med 0,92% avgift och +5,24% avkastning, samt Swedbank Robur Ny Teknik med 1,65% avgift och +12,50% avkastning. Vill du veta mer om någon specifik fond?';
            } else if (lm.includes('spara')) {
                response = 'En bra tumregel är att spara minst 10-15% av din månadsinkomst. Om du tjänar 30 000 kr per månad bör du sträva efter att spara 3 000-4 500 kr. Det viktiga är att börja någonstans och öka successivt!';
            } else {
                response = 'Tack för din fråga! Jag hjälper dig gärna med investeringar och sparande. Vill du veta mer om fonder, aktier eller månadssparande?';
            }
            
            const div = document.createElement('div');
            div.className = 'chat-message ai';
            const content = document.createElement('div');
            content.className = 'message-content';
            div.appendChild(content);
            chatMessages.appendChild(div);
            
            typeMessage(content, response).then(() => {
                if (showPackages) {
                    const packagesContainer = document.createElement('div');
                    packagesContainer.className = 'savings-packages';
                    packagesContainer.innerHTML = `
                        <div class="package-card" data-package="Tova liten">
                            <div class="package-header">
                                <div class="package-title">Tova liten</div>
                                <div class="package-subtitle">Ett sparande som fokuserar på trygghet och stabilitet framför högre risk och potentiell avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 10%, #181512 10% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">10%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Ränta</div>
                                        <div class="allocation-value">90%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">0%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">500 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Om 5 år</div>
                                    <div class="detail-value">32 000 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Avkastning</div>
                                    <div class="detail-value">+2 000 kr</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova liten">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova liten">Välj Tova Liten</button>
                            </div>
                        </div>
                        <div class="package-card" data-package="Tova mellan">
                            <div class="package-header">
                                <div class="package-title">Tova mellan</div>
                                <div class="package-subtitle">En balanserad portfölj som kombinerar stabilitet med möjligheten till högre avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 50%, #181512 50% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">50%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Ränta</div>
                                        <div class="allocation-value">50%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">0%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">1 000 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Om 5 år</div>
                                    <div class="detail-value">68 000 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Avkastning</div>
                                    <div class="detail-value">+8 000 kr</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova mellan">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova mellan">Välj Tova Mellan</button>
                            </div>
                        </div>
                        <div class="package-card" data-package="Tova stor">
                            <div class="package-header">
                                <div class="package-title">Tova stor</div>
                                <div class="package-subtitle">En aggressiv portfölj som fokuserar på långsiktig tillväxt och högre avkastning.</div>
                            </div>
                            <div class="package-allocation">
                                <div class="package-pie" style="background: conic-gradient(#F5F4F2 0% 20%, #181512 20% 100%);"></div>
                                <div class="allocation-breakdown">
                                    <div class="allocation-item">
                                        <div class="allocation-label">Aktier</div>
                                        <div class="allocation-value">80%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Ränta</div>
                                        <div class="allocation-value">20%</div>
                                    </div>
                                    <div class="allocation-item">
                                        <div class="allocation-label">Övrigt</div>
                                        <div class="allocation-value">0%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="package-details">
                                <div class="detail-row">
                                    <div class="detail-label">Månadssparande</div>
                                    <div class="detail-value">2 000 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Om 5 år</div>
                                    <div class="detail-value">145 000 kr</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Avkastning</div>
                                    <div class="detail-value">+25 000 kr</div>
                                </div>
                            </div>
                            <div class="package-buttons">
                                <button class="package-secondary-btn" data-package="Tova stor">Visa paketinnehåll</button>
                                <button class="package-content-btn" data-package="Tova stor">Välj Tova Stor</button>
                            </div>
                        </div>
                    `;
                    chatMessages.appendChild(packagesContainer);
                }
                
                if (showFundsList) {
                    const fundsContainer = document.createElement('div');
                    fundsContainer.className = 'funds-list';
                    fundsContainer.innerHTML = `
                        <div class="fund-item">
                            <div class="fund-rank">1</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">Tova Aktiefond</div>
                            </div>
                            <div class="fund-fee">0,92%</div>
                            <div class="fund-return positive">+5,24%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">2</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">Swedbank Robur Ny Teknik</div>
                            </div>
                            <div class="fund-fee">1,65%</div>
                            <div class="fund-return positive">+12,50%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">3</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('se')}</div>
                                <div class="fund-title">Nordea Sverige Index</div>
                            </div>
                            <div class="fund-fee">0,20%</div>
                            <div class="fund-return positive">+8,75%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">4</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">Handelsbanken Global Index</div>
                            </div>
                            <div class="fund-fee">0,15%</div>
                            <div class="fund-return positive">+6,32%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">5</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">SEB Global Index</div>
                            </div>
                            <div class="fund-fee">0,18%</div>
                            <div class="fund-return positive">+7,18%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">6</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('se')}</div>
                                <div class="fund-title">AMF Aktiefond Världen</div>
                            </div>
                            <div class="fund-fee">0,25%</div>
                            <div class="fund-return positive">+9,45%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">7</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">Länsförsäkringar Global Index</div>
                            </div>
                            <div class="fund-fee">0,22%</div>
                            <div class="fund-return positive">+7,92%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">8</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('eu')}</div>
                                <div class="fund-title">Tova Europa Hållbar</div>
                            </div>
                            <div class="fund-fee">0,85%</div>
                            <div class="fund-return positive">+6,18%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">9</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('se')}</div>
                                <div class="fund-title">Avanza Zero</div>
                            </div>
                            <div class="fund-fee">0,00%</div>
                            <div class="fund-return positive">+8,33%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div class="fund-item">
                            <div class="fund-rank">10</div>
                            <div class="fund-name">
                                <div class="fund-flag">${getFlagIcon('us')}</div>
                                <div class="fund-title">Tova Tech Innovation</div>
                            </div>
                            <div class="fund-fee">1,15%</div>
                            <div class="fund-return positive">+14,82%</div>
                            <svg class="fund-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    `;
                    chatMessages.appendChild(fundsContainer);
                }
                
                // Add suggestion cards after AI response (only after first AI response, never again)
                if (isFirstMessage && !hasShownSuggestions) { // Only show suggestions after first AI response, then never again
                    addSuggestionCards();
                    hasShownSuggestions = true;
                }
                
                // Ensure all content (packages, funds, suggestions) appears above chatInputActive
                setTimeout(() => {
                    const chatArea = document.querySelector('.chat-area');
                    if (chatArea) {
                        // After first message, scroll all the way to bottom
                        if (isFirstMessage) {
                            chatArea.scrollTop = chatArea.scrollHeight;
                        } else {
                            // For subsequent messages, scroll to show content above input
                            const inputContainer = document.getElementById('chatInputActive');
                            if (inputContainer) {
                                const inputRect = inputContainer.getBoundingClientRect();
                                const chatRect = chatArea.getBoundingClientRect();
                                const scrollPosition = inputRect.top - chatRect.top + chatArea.scrollTop - 100;
                                chatArea.scrollTop = Math.max(0, scrollPosition);
                            }
                        }
                    }
                }, 200);
            });
        }, 2000);
    }

    function handleSend(input) {
        const msg = input.value.trim();
        if (msg) {
            welcomeContent.classList.add('hidden');
            chatMessages.classList.add('active');
            chatInputContainer.style.display = 'block';
            const chatArea = document.querySelector('.chat-area');
            chatArea.classList.add('chat-active');
            addMessage(msg, true);
            input.value = '';
            input.style.height = 'auto';
            sendButton.disabled = true;
            sendButtonActive.disabled = true;
            
            addConversationToList(msg);
            
            // Keep scroll at top after first message only
            if (isFirstMessage) {
                chatArea.scrollTop = 0;
                isFirstMessage = false;
            }
            
            simulateAIResponse(msg);
        }
    }

    function addConversationToList(message) {
        const todayList = document.querySelector('[data-section-content="today"]');
        const todayHeader = document.querySelector('[data-section="today"]');
        const truncated = message.length > 40 ? message.substring(0, 37) + '...' : message;
        
        const newItem = document.createElement('div');
        newItem.className = 'section-list-item';
        newItem.textContent = truncated;
        
        todayList.insertBefore(newItem, todayList.firstChild);
        
        // Show the section header if it has items
        if (todayList.children.length > 0 && todayHeader) {
            todayHeader.classList.add('has-items');
        }
        
        while (todayList.children.length > 5) {
            todayList.removeChild(todayList.lastChild);
        }
    }

    if (sendButton) {
        sendButton.addEventListener('click', () => handleSend(textarea));
    }
    if (sendButtonActive) {
        sendButtonActive.addEventListener('click', () => handleSend(textareaActive));
    }
    if (textarea) {
        textarea.addEventListener('keydown', e => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                handleSend(textarea); 
            } 
        });
    }
    if (textareaActive) {
        textareaActive.addEventListener('keydown', e => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                handleSend(textareaActive); 
            } 
        });
    }

    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', function() {
            const text = this.getAttribute('data-message');
            welcomeContent.classList.add('hidden');
            chatMessages.classList.add('active');
            chatInputContainer.style.display = 'block';
            document.querySelector('.chat-area').classList.add('chat-active');
            addMessage(text, true);
            addConversationToList(text);
            simulateAIResponse(text);
        });
    });
    
    // Listen for custom event from dynamically created suggestion cards
    document.addEventListener('triggerChat', function(e) {
        const text = e.detail.message;
        addMessage(text, true);
        addConversationToList(text);
        simulateAIResponse(text);
        
        // Scroll to bottom after message is added
        setTimeout(() => {
            const chatArea = document.querySelector('.chat-area');
            if (chatArea) {
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }, 100);
    });
}

// Sections functionality
function initializeSections() {
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const content = document.querySelector(`[data-section-content="${sectionId}"]`);
            const arrow = this.querySelector('.section-arrow');
            content.classList.toggle('collapsed');
            arrow.classList.toggle('collapsed');
        });
    });
}

// Global escape key handler
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const bankOverlay = document.getElementById('bankOverlay');
        const transferOverlay = document.getElementById('transferOverlay');
        const iskOverlay = document.getElementById('iskOverlay');
        const podcastOverlay = document.getElementById('podcastOverlay');
        const packageSidebar = document.getElementById('packageSidebar');
        const aiCarouselOverlay = document.getElementById('aiCarouselOverlay');
        
        if (bankOverlay && bankOverlay.classList.contains('active')) {
            bankOverlay.classList.remove('active');
        }
        if (transferOverlay && transferOverlay.classList.contains('active')) {
            transferOverlay.classList.remove('active');
        }
        if (iskOverlay && iskOverlay.classList.contains('active')) {
            iskOverlay.classList.remove('active');
        }
        if (podcastOverlay && podcastOverlay.classList.contains('active')) {
            podcastOverlay.classList.remove('active');
        }
        if (packageSidebar && packageSidebar.classList.contains('active')) {
            // Close package sidebar
        }
        if (aiCarouselOverlay && aiCarouselOverlay.classList.contains('active')) {
            // Close AI carousel
        }
    }
});

// Security dropdown functionality
function initializeSecurityDropdown() {
    const securityDropdownBtn = document.getElementById('securityDropdownBtn');
    const securityDropdownMenu = document.getElementById('securityDropdownMenu');
    const selectedSecurity = document.getElementById('selectedSecurity');
    const securitySearchInput = document.getElementById('securitySearchInput');
    const securityDropdownItems = document.getElementById('securityDropdownItems');
    
    if (securityDropdownBtn && securityDropdownMenu) {
        // Store all dropdown items for filtering
        const allDropdownItems = Array.from(securityDropdownItems.querySelectorAll('.security-dropdown-item'));
        
        // Toggle dropdown on button click
        securityDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            securityDropdownMenu.classList.toggle('active');
            securityDropdownBtn.classList.toggle('active');
            
            // Focus search input when dropdown opens
            if (securityDropdownMenu.classList.contains('active')) {
                setTimeout(() => {
                    securitySearchInput.focus();
                }, 100);
            }
        });
        
        // Search functionality
        securitySearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            allDropdownItems.forEach(item => {
                const securityName = item.getAttribute('data-security').toLowerCase();
                const isVisible = securityName.includes(searchTerm);
                
                item.style.display = isVisible ? 'flex' : 'none';
            });
        });
        
        // Clear search when dropdown closes
        securityDropdownBtn.addEventListener('click', function() {
            if (!securityDropdownMenu.classList.contains('active')) {
                securitySearchInput.value = '';
                allDropdownItems.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
        
        // Handle item selection
        allDropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const securityName = this.getAttribute('data-security');
                const country = this.getAttribute('data-country');
                
                // Update selected security
                selectedSecurity.textContent = securityName;
                
                // Update flag icon in button
                const buttonFlagIcon = securityDropdownBtn.querySelector('.flag-icon');
                const itemFlagIcon = this.querySelector('.flag-icon');
                buttonFlagIcon.innerHTML = itemFlagIcon.innerHTML;
                
                // Close dropdown
                securityDropdownMenu.classList.remove('active');
                securityDropdownBtn.classList.remove('active');
                
                // Clear search when item is selected
                securitySearchInput.value = '';
                allDropdownItems.forEach(dropdownItem => {
                    dropdownItem.style.display = 'flex';
                });
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!securityDropdownBtn.contains(e.target) && !securityDropdownMenu.contains(e.target)) {
                securityDropdownMenu.classList.remove('active');
                securityDropdownBtn.classList.remove('active');
                
                // Clear search when dropdown closes
                securitySearchInput.value = '';
                allDropdownItems.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    }
}

// Amount input functionality
function initializeAmountInput() {
    const amountInput = document.getElementById('amountInput');
    
    if (amountInput) {
        // Only allow digits and prevent non-numeric input
        amountInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Prevent non-numeric characters on keypress
        amountInput.addEventListener('keypress', function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
}

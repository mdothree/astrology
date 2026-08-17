import { signs, calculateSimplifiedChart, getChartInterpretation } from './services/database.js';
import { firebaseConfig } from './config/firebase.js';

// API Configuration
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3007'
  : 'https://astrology-api-alpha.vercel.app';

let currentChart = null;
let isPremium = false;

const elements = {
    birthForm: document.getElementById('birth-form'),
    chartDisplay: document.getElementById('chart-display'),
    chartResult: document.getElementById('chart-result'),
    readingSection: document.getElementById('reading-section'),
    chartMeanings: document.getElementById('chart-meanings'),
    signsGrid: document.getElementById('signs-grid'),
    shareBtn: document.getElementById('share-btn'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    newReadingBtn: document.getElementById('new-reading-btn'),
    premiumModal: document.getElementById('premium-modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    modalSkip: document.getElementById('modal-skip')
};

function init() {
    setupEventListeners();
    renderSignsGrid();
}

function setupEventListeners() {
    elements.birthForm?.addEventListener('submit', handleFormSubmit);
    elements.shareBtn?.addEventListener('click', shareChart);
    elements.upgradeBtn?.addEventListener('click', showPremiumModal);
    elements.newReadingBtn?.addEventListener('click', resetChart);
    
    elements.modalOverlay?.addEventListener('click', hidePremiumModal);
    elements.modalClose?.addEventListener('click', hidePremiumModal);
    elements.modalSkip?.addEventListener('click', hidePremiumModal);
}

function showPremiumModal() {
    if (elements.premiumModal) {
        elements.premiumModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hidePremiumModal() {
    if (elements.premiumModal) {
        elements.premiumModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function resetChart() {
    currentChart = null;
    document.getElementById('birth-date').value = '';
    document.getElementById('birth-time').value = '';
    document.getElementById('location').value = '';
    elements.chartDisplay.style.display = 'none';
    elements.readingSection.style.display = 'none';
    elements.newReadingBtn.style.display = 'none';
    elements.birthForm.scrollIntoView({ behavior: 'smooth' });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const location = document.getElementById('location').value;
    
    if (!birthDate) {
        alert('Please enter your birth date');
        return;
    }
    
    currentChart = calculateSimplifiedChart(birthDate, birthTime, location);
    showChart();
}

function showChart() {
    const interpretation = getChartInterpretation(currentChart);
    
    elements.chartResult.innerHTML = `
        <div class="chart-sunmoon">
            <div class="sign-card">
                <div class="symbol">${currentChart.sun.sign.symbol}</div>
                <div class="title">Sun Sign</div>
                <div class="name">${currentChart.sun.sign.name}</div>
                <div class="dates">${currentChart.sun.sign.dates}</div>
                <div class="element">${currentChart.sun.sign.element} • ${currentChart.sun.sign.quality}</div>
                <div class="ruler">Ruled by ${currentChart.sun.sign.ruler}</div>
            </div>
            <div class="sign-card">
                <div class="symbol">${currentChart.moon.sign.symbol}</div>
                <div class="title">Moon Sign</div>
                <div class="name">${currentChart.moon.sign.name}</div>
                <div class="dates">${currentChart.moon.sign.dates}</div>
                <div class="element">${currentChart.moon.sign.element} • ${currentChart.moon.sign.quality}</div>
                <div class="ruler">Ruled by ${currentChart.moon.sign.ruler}</div>
            </div>
            <div class="sign-card">
                <div class="symbol">${currentChart.rising.sign.symbol}</div>
                <div class="title">Rising Sign</div>
                <div class="name">${currentChart.rising.sign.name}</div>
                <div class="dates">${currentChart.rising.sign.dates}</div>
                <div class="element">${currentChart.rising.sign.element} • ${currentChart.rising.sign.quality}</div>
                <div class="ruler">Ruled by ${currentChart.rising.sign.ruler}</div>
            </div>
        </div>
    `;
    
    elements.chartMeanings.innerHTML = `
        <div class="chart-section">
            <div class="chart-section-header">
                <div class="symbol">${currentChart.sun.sign.symbol}</div>
                <div>
                    <h4>${currentChart.sun.sign.name} Sun</h4>
                    <span class="role">Your Core Identity</span>
                </div>
            </div>
            <p>${interpretation.sun.interpretation.traits}</p>
            <ul>
                <li>Strengths: ${interpretation.sun.interpretation.strengths.join(', ')}</li>
                <li>Growth Areas: ${interpretation.sun.interpretation.challenges.join(', ')}</li>
            </ul>
        </div>
        
        <div class="chart-section">
            <div class="chart-section-header">
                <div class="symbol">${currentChart.moon.sign.symbol}</div>
                <div>
                    <h4>${currentChart.moon.sign.name} Moon</h4>
                    <span class="role">Your Emotional Nature</span>
                </div>
            </div>
            <p>${interpretation.moon.interpretation.traits}</p>
            <ul>
                <li>Strengths: ${interpretation.moon.interpretation.strengths.join(', ')}</li>
                <li>Growth Areas: ${interpretation.moon.interpretation.challenges.join(', ')}</li>
            </ul>
        </div>
        
        <div class="chart-section">
            <div class="chart-section-header">
                <div class="symbol">${currentChart.rising.sign.symbol}</div>
                <div>
                    <h4>${currentChart.rising.sign.name} Rising</h4>
                    <span class="role">Your Outer Persona</span>
                </div>
            </div>
            <p>${interpretation.rising.interpretation.traits}</p>
            <ul>
                <li>Strengths: ${interpretation.rising.interpretation.strengths.join(', ')}</li>
                <li>Growth Areas: ${interpretation.rising.interpretation.challenges.join(', ')}</li>
            </ul>
        </div>
        
        <div class="personality-summary">
            ${interpretation.personality}
        </div>
    `;
    
    elements.chartDisplay.style.display = 'block';
    elements.readingSection.style.display = 'block';
    elements.newReadingBtn.style.display = 'inline-block';
    
    elements.chartDisplay.scrollIntoView({ behavior: 'smooth' });
}

function renderSignsGrid() {
    if (!elements.signsGrid) return;
    
    elements.signsGrid.innerHTML = signs.map(s => `
        <div class="sign-card-grid">
            <div class="symbol">${s.symbol}</div>
            <div class="name">${s.name}</div>
            <div class="dates">${s.dates}</div>
        </div>
    `).join('');
}

function shareChart() {
    if (!currentChart) return;
    
    const text = `My Astrology Chart:
    
Sun: ${currentChart.sun.sign.name} ${currentChart.sun.sign.symbol}
Moon: ${currentChart.moon.sign.name} ${currentChart.moon.sign.symbol}
Rising: ${currentChart.rising.sign.name} ${currentChart.rising.sign.symbol}

Born: ${currentChart.birthDate}
${currentChart.location ? `Location: ${currentChart.location}` : ''}

Get your free chart at astrology.mdo3d.com`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Birth Chart',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Chart copied to clipboard!');
        });
    }
}

function showPremiumUpsell() {
    showPremiumModal();
}

// API Integration Functions
async function getPremiumReading(chart, question) {
    try {
        const response = await fetch(`${API_URL}/api/chart/interpret`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chart,
                question,
                premium: true,
                sessionId: window.PremiumEntitlement?.activeSessionId()
            })
        });

        const data = await response.json();
        if (data.success) {
            return data.reading;
        }
        throw new Error(data.error || 'Failed to get reading');
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

function showPremiumReading(reading) {
    if (!reading) return;

    elements.chartMeanings.innerHTML = `
        <div class="premium-reading">
            <div class="premium-badge">AI-Powered Chart Analysis</div>

            <div class="chart-section">
                <h4>Your Cosmic Portrait</h4>
                <p>${reading.cosmicPortrait}</p>
            </div>

            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.sun.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.sun.sign.name} Sun</h4>
                        <span class="role">Your Core Identity</span>
                    </div>
                </div>
                <p>${reading.sunSignReading}</p>
            </div>

            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.moon.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.moon.sign.name} Moon</h4>
                        <span class="role">Your Emotional Nature</span>
                    </div>
                </div>
                <p>${reading.moonSignReading}</p>
            </div>

            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.rising.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.rising.sign.name} Rising</h4>
                        <span class="role">Your Outer Persona</span>
                    </div>
                </div>
                <p>${reading.risingSignReading}</p>
            </div>

            ${reading.elementalBalance ? `
            <div class="chart-section">
                <h4>Elemental Balance</h4>
                <p>${reading.elementalBalance}</p>
            </div>
            ` : ''}

            ${reading.lifePathInsights && reading.lifePathInsights.length > 0 ? `
            <div class="chart-section">
                <h4>Life Path Insights</h4>
                <ul class="insights-list">
                    ${reading.lifePathInsights.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="chart-section affirmation">
                <h4>Your Cosmic Affirmation</h4>
                <p><em>"${reading.affirmation}"</em></p>
            </div>
        </div>
    `;
}

async function handlePremiumPurchase() {
    // A verified, unused purchase (recorded by success.html) delivers directly — no second charge.
    if (window.PremiumEntitlement?.has()) {
        const question = document.getElementById('question-input')?.value || 'Your general question';
        const reading = await getPremiumReading(currentChart, question);
        if (reading) { window.PremiumEntitlement.consume(); showPremiumReading(reading); return; }
        alert('Your purchase is confirmed, but the reading service is temporarily unavailable. Please try again shortly — you will not be charged again.');
        return;
    }
    const email = prompt('Enter your email to receive your premium chart reading:');
    if (!email) return;

    try {
        const response = await fetch(`${API_URL}/api/payment/create-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                readingType: 'birth-chart',
                email
            })
        });

        const data = await response.json();
        if (data.success && data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            alert('Unable to process payment. Please try again.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment error. Please try again.');
    }
}

window.handlePremiumPurchase = handlePremiumPurchase;

document.addEventListener('DOMContentLoaded', init);

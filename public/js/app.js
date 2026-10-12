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
    modalSkip: document.getElementById('modal-skip'),
    premiumUpsell: document.getElementById('premium-upsell'),
    getStartedBtn: document.getElementById('get-started-btn')
};

// C7B-ASTRO-NO-VALIDATION: birth date must be a real date, 1900 or later, not in the future.
function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function validateBirthDate(value) {
    if (!value) return 'Please enter your birth date.';
    const m = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return 'Please enter a valid birth date.';
    const year = Number(m[1]);
    if (year < 1900) return 'Please enter a birth year of 1900 or later.';
    const date = new Date(year, Number(m[2]) - 1, Number(m[3]));
    if (Number.isNaN(date.getTime()) || date.getMonth() !== Number(m[2]) - 1) {
        return 'Please enter a valid birth date.';
    }
    const now = new Date();
    if (date > new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        return 'Your birth date cannot be in the future.';
    }
    return '';
}

function showBirthDateError(message) {
    const el = document.getElementById('birth-date-error');
    if (el) {
        el.textContent = message;
        el.hidden = !message;
    }
    document.getElementById('birth-date')?.setAttribute('aria-invalid', message ? 'true' : 'false');
}

// Moon and Rising depend on the birth time; without it we don't show values.
function hasBirthTime(chart) {
    return Boolean(chart && chart.birthTime);
}

function needsTimeCard(title) {
    return `
            <div class="sign-card sign-card-needs-time">
                <div class="symbol" aria-hidden="true">?</div>
                <div class="title">${title}</div>
                <div class="name">Needs birth time</div>
                <div class="element">Add your birth time above to calculate it</div>
            </div>`;
}

// Escape text before interpolating API output into innerHTML.
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const PENDING_KEY = 'astrology_pending_chart';

function init() {
    setupEventListeners();
    renderSignsGrid();
    restorePendingChart();
}

// After a Stripe redirect the page reloads and the chart is lost. The birth data is
// saved before checkout; if a verified credit exists on return, restore it and deliver.
function savePendingChart() {
    if (!currentChart) return;
    try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify({
            birthDate: currentChart.birthDate,
            birthTime: currentChart.birthTime || '',
            location: currentChart.location || ''
        }));
    } catch (e) { /* storage unavailable — user can re-enter */ }
}

function restorePendingChart() {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(PENDING_KEY)); } catch (e) { saved = null; }
    if (!saved || !saved.birthDate || !window.PremiumEntitlement?.has()) return;
    try { sessionStorage.removeItem(PENDING_KEY); } catch (e) {}
    document.getElementById('birth-date').value = saved.birthDate;
    document.getElementById('birth-time').value = saved.birthTime;
    document.getElementById('location').value = saved.location;
    currentChart = calculateSimplifiedChart(saved.birthDate, saved.birthTime, saved.location);
    showChart();
    handlePremiumPurchase();
}

function setupEventListeners() {
    const birthDateInput = document.getElementById('birth-date');
    if (birthDateInput) {
        birthDateInput.max = todayISO();
        birthDateInput.addEventListener('input', () => showBirthDateError(''));
    }
    // C7B-COLOR-STALE-RESULT (astrology): editing any input after a chart is shown
    // marks that chart as out of date until the form is submitted again.
    ['birth-date', 'birth-time', 'location'].forEach((id) => {
        const input = document.getElementById(id);
        input?.addEventListener('input', updateStaleState);
        input?.addEventListener('change', updateStaleState);
    });
    elements.birthForm?.addEventListener('submit', handleFormSubmit);
    elements.shareBtn?.addEventListener('click', shareChart);
    elements.upgradeBtn?.addEventListener('click', showPremiumModal);
    elements.newReadingBtn?.addEventListener('click', resetChart);
    elements.getStartedBtn?.addEventListener('click', () => {
        elements.birthForm?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('birth-date')?.focus({ preventScroll: true });
    });
    
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

function readInputs() {
    return {
        birthDate: document.getElementById('birth-date')?.value || '',
        birthTime: document.getElementById('birth-time')?.value || '',
        location: document.getElementById('location')?.value || ''
    };
}

function setStale(stale) {
    let note = document.getElementById('chart-stale-note');
    if (stale && !note && elements.chartDisplay) {
        note = document.createElement('p');
        note.id = 'chart-stale-note';
        note.setAttribute('role', 'status');
        note.style.cssText = 'margin:0 0 1rem;padding:.75rem 1rem;border-radius:8px;background:#fff3cd;color:#111;font-weight:600;';
        note.textContent = 'Your details changed. Press the button again to update this chart.';
        (elements.chartDisplay.querySelector('.container') || elements.chartDisplay).prepend(note);
    }
    if (note) note.hidden = !stale;
    [elements.chartResult, elements.readingSection].forEach((el) => {
        if (el) el.style.opacity = stale ? '0.45' : '';
    });
}

function updateStaleState() {
    if (!currentChart) return;
    const v = readInputs();
    const same = v.birthDate === currentChart.birthDate &&
        v.birthTime === (currentChart.birthTime || '') &&
        v.location === (currentChart.location || '');
    setStale(!same);
}

function hideChart() {
    currentChart = null;
    setStale(false);
    elements.chartDisplay.style.display = 'none';
    elements.readingSection.style.display = 'none';
    elements.newReadingBtn.style.display = 'none';
}

function resetChart() {
    currentChart = null;
    setStale(false);
    document.getElementById('birth-date').value = '';
    document.getElementById('birth-time').value = '';
    document.getElementById('location').value = '';
    showBirthDateError('');
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
    
    const dateError = validateBirthDate(birthDate);
    showBirthDateError(dateError);
    if (dateError) {
        // Never leave a previous chart on screen next to an invalid date.
        hideChart();
        document.getElementById('birth-date')?.focus();
        return;
    }
    
    currentChart = calculateSimplifiedChart(birthDate, birthTime, location);
    showChart();
    setStale(false);
}

function showChart() {
    const interpretation = getChartInterpretation(currentChart);
    const timed = hasBirthTime(currentChart);
    const personality = timed
        ? interpretation.personality
        : `As a ${currentChart.sun.sign.name}, you embody the ${currentChart.sun.sign.element} energy of ${currentChart.sun.sign.name}. Add your birth time to see your Moon and Rising signs.`;
    
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
            ${timed ? `
            <div class="sign-card">
                <div class="symbol">${currentChart.moon.sign.symbol}</div>
                <div class="title">Moon Sign</div>
                <div class="name">${currentChart.moon.sign.name}</div>
                <div class="element">${currentChart.moon.sign.element} • ${currentChart.moon.sign.quality}</div>
                <div class="ruler">Ruled by ${currentChart.moon.sign.ruler}</div>
            </div>
            <div class="sign-card">
                <div class="symbol">${currentChart.rising.sign.symbol}</div>
                <div class="title">Rising Sign</div>
                <div class="name">${currentChart.rising.sign.name}</div>
                <div class="element">${currentChart.rising.sign.element} • ${currentChart.rising.sign.quality}</div>
                <div class="ruler">Ruled by ${currentChart.rising.sign.ruler}</div>
            </div>` : needsTimeCard('Moon Sign') + needsTimeCard('Rising Sign')}
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
        
        ${timed ? `
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
        ` : ''}
        
        <div class="personality-summary">
            ${personality}
        </div>
    `;
    
    if (elements.premiumUpsell) elements.premiumUpsell.style.display = '';
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
${hasBirthTime(currentChart) ? `Moon: ${currentChart.moon.sign.name} ${currentChart.moon.sign.symbol}
Rising: ${currentChart.rising.sign.name} ${currentChart.rising.sign.symbol}` : 'Moon & Rising: need birth time'}

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
                <p>${esc(reading.cosmicPortrait)}</p>
            </div>

            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.sun.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.sun.sign.name} Sun</h4>
                        <span class="role">Your Core Identity</span>
                    </div>
                </div>
                <p>${esc(reading.sunSignReading)}</p>
            </div>

            ${hasBirthTime(currentChart) ? `
            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.moon.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.moon.sign.name} Moon</h4>
                        <span class="role">Your Emotional Nature</span>
                    </div>
                </div>
                <p>${esc(reading.moonSignReading)}</p>
            </div>

            <div class="chart-section">
                <div class="chart-section-header">
                    <div class="symbol">${currentChart.rising.sign.symbol}</div>
                    <div>
                        <h4>${currentChart.rising.sign.name} Rising</h4>
                        <span class="role">Your Outer Persona</span>
                    </div>
                </div>
                <p>${esc(reading.risingSignReading)}</p>
            </div>
            ` : ''}

            ${reading.elementalBalance ? `
            <div class="chart-section">
                <h4>Elemental Balance</h4>
                <p>${esc(reading.elementalBalance)}</p>
            </div>
            ` : ''}

            ${reading.lifePathInsights && reading.lifePathInsights.length > 0 ? `
            <div class="chart-section">
                <h4>Life Path Insights</h4>
                <ul class="insights-list">
                    ${reading.lifePathInsights.map(i => `<li>${esc(i)}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="chart-section affirmation">
                <h4>Your Cosmic Affirmation</h4>
                <p><em>"${esc(reading.affirmation)}"</em></p>
            </div>
        </div>
    `;
    // The reading has been delivered — don't keep selling it.
    if (elements.premiumUpsell) elements.premiumUpsell.style.display = 'none';
    elements.chartMeanings.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handlePremiumPurchase() {
    hidePremiumModal();
    // A verified, unused purchase (recorded by success.html) delivers directly — no second charge.
    if (window.PremiumEntitlement?.has()) {
        if (!currentChart) {
            alert('Your full-chart credit is ready. Enter your birth details and calculate your chart first, then choose "Get Full Chart" to use it.');
            elements.birthForm?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
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
            savePendingChart();
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

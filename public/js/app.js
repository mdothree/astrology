import { signs, calculateSimplifiedChart, getChartInterpretation } from './js/services/database.js';

let currentChart = null;

const elements = {
    birthForm: document.getElementById('birth-form'),
    chartDisplay: document.getElementById('chart-display'),
    chartResult: document.getElementById('chart-result'),
    readingSection: document.getElementById('reading-section'),
    chartMeanings: document.getElementById('chart-meanings'),
    signsGrid: document.getElementById('signs-grid'),
    shareBtn: document.getElementById('share-btn'),
    upgradeBtn: document.getElementById('upgrade-btn')
};

function init() {
    setupEventListeners();
    renderSignsGrid();
}

function setupEventListeners() {
    elements.birthForm?.addEventListener('submit', handleFormSubmit);
    elements.shareBtn?.addEventListener('click', shareChart);
    elements.upgradeBtn?.addEventListener('click', showPremiumUpsell);
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
    alert('Full chart analysis with all planets, houses, and aspects coming soon! Unlock with a premium subscription.');
}

document.addEventListener('DOMContentLoaded', init);

// App State
let clubs = [];
let events = [];
let followedClubs = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadFollowedClubs();
    loadData();
});

// Load followed clubs from localStorage
function loadFollowedClubs() {
    const stored = localStorage.getItem('followedClubs');
    followedClubs = stored ? JSON.parse(stored) : [];
}

// Save followed clubs to localStorage
function saveFollowedClubs() {
    localStorage.setItem('followedClubs', JSON.stringify(followedClubs));
}

// Load data from JSON files
async function loadData() {
    try {
        const [clubsResponse, eventsResponse] = await Promise.all([
            fetch('data/clubs.json'),
            fetch('data/events.json')
        ]);

        clubs = await clubsResponse.json();
        events = await eventsResponse.json();

        renderClubGuide();
        renderMyClubs();
        renderCalendar();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

// View Switching
function switchView(viewId) {
    // Update active view
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    // Update active nav button
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        if (btn.dataset.view === viewId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Refresh data for specific views
    if (viewId === 'my-clubs') {
        renderMyClubs();
    } else if (viewId === 'calendar') {
        renderCalendar();
    }
}

// ========== CLUB GUIDE ==========
function renderClubGuide() {
    const container = document.getElementById('clubs-container');
    
    if (clubs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No clubs available</p></div>';
        return;
    }

    container.innerHTML = clubs.map(club => {
        const isFollowing = followedClubs.includes(club.id);
        return `
            <div class="club-card" onclick="showClubDetail('${club.id}')">
                <div class="club-header">
                    <div class="club-logo">${club.logo}</div>
                    <div class="club-info">
                        <h3>${club.name}</h3>
                        <div class="club-badges">
                            <span class="badge badge-category">${club.category}</span>
                            ${isFollowing ? '<span class="badge badge-following">Following</span>' : ''}
                        </div>
                    </div>
                </div>
                <p class="club-description">${club.shortDescription}</p>
                <button class="btn" onclick="event.stopPropagation(); showClubDetail('${club.id}')">
                    View Details
                </button>
            </div>
        `;
    }).join('');
}

function showClubDetail(clubId) {
    const club = clubs.find(c => c.id === clubId);
    if (!club) return;

    const isFollowing = followedClubs.includes(clubId);
    const modal = document.getElementById('club-modal');
    const detailContainer = document.getElementById('club-detail');

    detailContainer.innerHTML = `
        <div class="detail-header">
            <div class="detail-logo">${club.logo}</div>
            <h2>${club.name}</h2>
            <div class="club-badges">
                <span class="badge badge-category">${club.category}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>What They Do</h3>
            <p>${club.longDescription}</p>
        </div>

        <div class="detail-section">
            <h3>Why Should You Join?</h3>
            <ul>
                ${club.whyJoin.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>

        <div class="detail-section">
            <h3>Why Should You NOT Join?</h3>
            <ul>
                ${club.whyNotJoin.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <strong>Skill Level</strong>
                <span class="badge ${getSkillBadgeClass(club.skillLevel)}">${club.skillLevel}</span>
            </div>
            <div class="info-card">
                <strong>Effort Required</strong>
                <span>${club.effort}</span>
            </div>
            <div class="info-card">
                <strong>Exclusivity</strong>
                <span class="badge ${getExclusivityBadgeClass(club.exclusivity)}">${club.exclusivity}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Ideal For</h3>
            <p>${club.idealPerson}</p>
        </div>

        <div class="detail-section">
            <h3>Past Events Highlights</h3>
            <ul class="events-list">
                ${club.pastEvents.map(event => `<li>${event}</li>`).join('')}
            </ul>
        </div>

        <button class="btn ${isFollowing ? 'btn-danger' : ''}" onclick="toggleFollow('${clubId}')">
            ${isFollowing ? 'Remove from My Clubs' : 'Add to My Clubs'}
        </button>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('club-modal').classList.remove('active');
}

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    const modal = document.getElementById('club-modal');
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

function getSkillBadgeClass(level) {
    const classes = {
        'Beginner': 'badge-following',
        'Medium': 'badge-category',
        'Tough': 'badge-category',
        'Extremely Competitive': 'badge-category'
    };
    return classes[level] || 'badge-category';
}

function getExclusivityBadgeClass(level) {
    const classes = {
        'Open for All': 'badge-following',
        'Selective': 'badge-category',
        'Highly Selective': 'badge-category'
    };
    return classes[level] || 'badge-category';
}

// ========== FOLLOW/UNFOLLOW ==========
function toggleFollow(clubId) {
    if (followedClubs.includes(clubId)) {
        followedClubs = followedClubs.filter(id => id !== clubId);
    } else {
        followedClubs.push(clubId);
    }

    saveFollowedClubs();
    
    // Refresh all views
    renderClubGuide();
    renderMyClubs();
    renderCalendar();
    
    // Update modal if it's open
    const modal = document.getElementById('club-modal');
    if (modal.classList.contains('active')) {
        showClubDetail(clubId);
    }
}

// ========== MY CLUBS ==========
function renderMyClubs() {
    renderFollowingList();
    renderUpdates();
}

function renderFollowingList() {
    const container = document.getElementById('following-container');

    if (followedClubs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <p>You haven't followed any clubs yet</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Go to Club Guide to explore!</p>
            </div>
        `;
        return;
    }

    const followedClubsData = clubs.filter(club => followedClubs.includes(club.id));

    container.innerHTML = followedClubsData.map(club => `
        <div class="following-item">
            <div class="following-info">
                <div class="club-logo">${club.logo}</div>
                <div>
                    <h4>${club.name}</h4>
                    <span class="badge badge-category">${club.category}</span>
                </div>
            </div>
            <button class="btn btn-danger" onclick="toggleFollow('${club.id}')">
                Remove
            </button>
        </div>
    `).join('');
}

function renderUpdates() {
    const container = document.getElementById('updates-container');

    if (followedClubs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>No updates to show</p>
            </div>
        `;
        return;
    }

    const followedEvents = events.filter(event => followedClubs.includes(event.club));

    if (followedEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <p>No upcoming events from your clubs</p>
            </div>
        `;
        return;
    }

    // Sort events by date and get first 5
    const sortedEvents = followedEvents
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    container.innerHTML = sortedEvents.map(event => `
        <div class="update-card">
            <h4>${event.title}</h4>
            <span class="badge badge-following">${event.clubName}</span>
            <p>${event.description}</p>
            <div class="update-meta">
                <span>📅 ${formatDate(event.date)}</span>
                <span>🕐 ${event.time}</span>
                <span>📍 ${event.location}</span>
            </div>
        </div>
    `).join('');
}

// ========== CALENDAR ==========
function renderCalendar() {
    const container = document.getElementById('calendar-container');

    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No events scheduled</p></div>';
        return;
    }

    // Group events by month
    const eventsByMonth = {};
    events.forEach(event => {
        const date = new Date(event.date);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!eventsByMonth[monthKey]) {
            eventsByMonth[monthKey] = [];
        }
        eventsByMonth[monthKey].push(event);
    });

    // Sort months and render
    const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
        const dateA = new Date(eventsByMonth[a][0].date);
        const dateB = new Date(eventsByMonth[b][0].date);
        return dateA - dateB;
    });

    container.innerHTML = sortedMonths.map(month => {
        const monthEvents = eventsByMonth[month]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(event => {
                const isFollowing = followedClubs.includes(event.club);
                return `
                    <div class="event-card ${isFollowing ? 'following' : ''}">
                        <div class="event-header">
                            <h4>${event.title}</h4>
                            ${isFollowing ? '<span class="badge badge-following">Following</span>' : ''}
                        </div>
                        <span class="badge badge-category">${event.clubName}</span>
                        <p>${event.description}</p>
                        <div class="update-meta">
                            <span>📅 ${formatDate(event.date)}</span>
                            <span>🕐 ${event.time}</span>
                            <span>📍 ${event.location}</span>
                        </div>
                    </div>
                `;
            }).join('');

        return `
            <div class="month-section">
                <h3>${month}</h3>
                ${monthEvents}
            </div>
        `;
    }).join('');
}

// ========== UTILITIES ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 9999;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

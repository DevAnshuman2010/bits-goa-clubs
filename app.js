// State Management
let clubs = [];
let events = [];
let followedClubs = JSON.parse(localStorage.getItem('followedClubs')) || [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadData();
});

// Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.dataset.view;
            switchView(viewId);
            
            // Update active state
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Set initial active state
    navBtns[0].classList.add('active');
}

function switchView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    // Refresh view data
    if (viewId === 'my-clubs-view') {
        renderMyClubs();
    } else if (viewId === 'calendar-view') {
        renderCalendar();
    }
}

// Data Loading
async function loadData() {
    try {
        const [clubsRes, eventsRes] = await Promise.all([
            fetch('/data/clubs.json'),
            fetch('/data/events.json')
        ]);
        
        clubs = await clubsRes.json();
        events = await eventsRes.json();
        
        renderClubGuide();
        renderMyClubs();
        renderCalendar();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Club Guide
function renderClubGuide() {
    const clubList = document.getElementById('club-list');
    clubList.innerHTML = '';
    
    clubs.forEach(club => {
        const isFollowing = followedClubs.includes(club.id);
        const card = createClubCard(club, isFollowing);
        clubList.appendChild(card);
    });
}

function createClubCard(club, isFollowing) {
    const card = document.createElement('div');
    card.className = 'club-card';
    card.onclick = () => showClubDetail(club);
    
    card.innerHTML = `
        <div class="club-card-header">
            <div class="club-logo">${club.logo}</div>
            <div>
                <h3>${club.name}</h3>
                <span class="badge badge-secondary">${club.category}</span>
                ${isFollowing ? '<span class="badge badge-success">Following</span>' : ''}
            </div>
        </div>
        <p>${club.shortDescription}</p>
        <button class="btn" onclick="event.stopPropagation(); showClubDetail(clubs.find(c => c.id === '${club.id}'))">View Details</button>
    `;
    
    return card;
}

function showClubDetail(club) {
    const modal = document.getElementById('club-detail-modal');
    const content = document.getElementById('club-detail-content');
    const isFollowing = followedClubs.includes(club.id);
    
    content.innerHTML = `
        <div class="club-detail-header">
            <div class="club-detail-logo">${club.logo}</div>
            <h2>${club.name}</h2>
            <span class="badge badge-secondary">${club.category}</span>
        </div>
        
        <div class="club-detail-section">
            <h3>What They Do</h3>
            <p>${club.longDescription}</p>
        </div>
        
        <div class="club-detail-section">
            <h3>Why Should You Join?</h3>
            <ul>
                ${club.whyJoin.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>
        
        <div class="club-detail-section">
            <h3>Why Should You NOT Join?</h3>
            <ul>
                ${club.whyNotJoin.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <strong>Skill Level Required</strong>
                <span class="badge badge-${getSkillBadgeColor(club.skillLevel)}">${club.skillLevel}</span>
            </div>
            <div class="info-item">
                <strong>Effort Needed</strong>
                <span>${club.effort}</span>
            </div>
            <div class="info-item">
                <strong>Exclusivity</strong>
                <span class="badge badge-${getExclusivityColor(club.exclusivity)}">${club.exclusivity}</span>
            </div>
        </div>
        
        <div class="club-detail-section">
            <h3>Ideal For</h3>
            <p>${club.idealPerson}</p>
        </div>
        
        <div class="club-detail-section">
            <h3>Past Events Highlights</h3>
            <ul class="past-events">
                ${club.pastEvents.map(event => `<li>${event}</li>`).join('')}
            </ul>
        </div>
        
        <button class="btn ${isFollowing ? 'btn-destructive' : ''}" onclick="toggleFollow('${club.id}')">
            ${isFollowing ? 'Remove from My Clubs' : 'Add to My Clubs'}
        </button>
    `;
    
    modal.classList.add('active');
}

function closeClubDetail() {
    document.getElementById('club-detail-modal').classList.remove('active');
}

function getSkillBadgeColor(level) {
    const colors = {
        'Beginner': 'success',
        'Medium': 'primary',
        'Tough': 'secondary',
        'Extremely Competitive': 'destructive'
    };
    return colors[level] || 'secondary';
}

function getExclusivityColor(level) {
    const colors = {
        'Open for All': 'success',
        'Selective': 'primary',
        'Highly Selective': 'destructive'
    };
    return colors[level] || 'secondary';
}

// Follow/Unfollow
function toggleFollow(clubId) {
    if (followedClubs.includes(clubId)) {
        followedClubs = followedClubs.filter(id => id !== clubId);
    } else {
        followedClubs.push(clubId);
    }
    
    localStorage.setItem('followedClubs', JSON.stringify(followedClubs));
    
    // Refresh views
    renderClubGuide();
    renderMyClubs();
    renderCalendar();
    
    // Update modal
    const club = clubs.find(c => c.id === clubId);
    if (club) {
        showClubDetail(club);
    }
}

// My Clubs
function renderMyClubs() {
    const followedList = document.getElementById('followed-clubs-list');
    const updatesList = document.getElementById('updates-list');
    
    if (followedClubs.length === 0) {
        followedList.innerHTML = '<div class="empty-state">You haven\'t followed any clubs yet. Go to Club Guide to explore!</div>';
        updatesList.innerHTML = '<div class="empty-state">No updates to show</div>';
        return;
    }
    
    // Render followed clubs
    followedList.innerHTML = '';
    followedClubs.forEach(clubId => {
        const club = clubs.find(c => c.id === clubId);
        if (club) {
            const item = document.createElement('div');
            item.className = 'followed-club-item';
            item.innerHTML = `
                <div class="followed-club-info">
                    <div class="club-logo">${club.logo}</div>
                    <div>
                        <h4>${club.name}</h4>
                        <span class="badge badge-secondary">${club.category}</span>
                    </div>
                </div>
                <button class="btn btn-destructive" onclick="toggleFollow('${club.id}')">Remove</button>
            `;
            followedList.appendChild(item);
        }
    });
    
    // Render updates
    updatesList.innerHTML = '';
    const followedEvents = events.filter(event => followedClubs.includes(event.club));
    
    if (followedEvents.length === 0) {
        updatesList.innerHTML = '<div class="empty-state">No upcoming events from your clubs</div>';
        return;
    }
    
    followedEvents
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
        .forEach(event => {
            const card = document.createElement('div');
            card.className = 'update-card';
            card.innerHTML = `
                <h4>${event.title}</h4>
                <span class="badge badge-primary">${event.clubName}</span>
                <p>${event.description}</p>
                <div class="update-meta">
                    <span>📅 ${formatDate(event.date)}</span>
                    <span>🕐 ${event.time}</span>
                    <span>📍 ${event.location}</span>
                </div>
            `;
            updatesList.appendChild(card);
        });
}

// Calendar
function renderCalendar() {
    const calendarList = document.getElementById('calendar-list');
    calendarList.innerHTML = '';
    
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
    
    // Sort and render
    Object.keys(eventsByMonth)
        .sort((a, b) => new Date(eventsByMonth[a][0].date) - new Date(eventsByMonth[b][0].date))
        .forEach(month => {
            const section = document.createElement('div');
            section.className = 'month-section';
            
            const title = document.createElement('h3');
            title.textContent = month;
            section.appendChild(title);
            
            eventsByMonth[month]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .forEach(event => {
                    const isFollowing = followedClubs.includes(event.club);
                    const card = document.createElement('div');
                    card.className = `event-card ${isFollowing ? 'following' : ''}`;
                    card.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <h4>${event.title}</h4>
                            ${isFollowing ? '<span class="badge badge-success">Following</span>' : ''}
                        </div>
                        <span class="badge badge-primary">${event.clubName}</span>
                        <p style="margin-top: 0.5rem;">${event.description}</p>
                        <div class="update-meta">
                            <span>📅 ${formatDate(event.date)}</span>
                            <span>🕐 ${event.time}</span>
                            <span>📍 ${event.location}</span>
                        </div>
                    `;
                    section.appendChild(card);
                });
            
            calendarList.appendChild(section);
        });
}

// Utilities
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Close modal on outside click
document.getElementById('club-detail-modal').addEventListener('click', (e) => {
    if (e.target.id === 'club-detail-modal') {
        closeClubDetail();
    }
});

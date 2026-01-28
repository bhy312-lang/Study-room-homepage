// Tab switching logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    window.scrollTo(0, 0);
    
    if (tabId === 'help') {
        initMap();
    }
}

// Attendance Data Mockup
const students = [
    { name: "김민준", status: "등원중", time: "14:20", id: 1 },
    { name: "이서윤", status: "등원중", time: "14:45", id: 2 },
    { name: "박하준", status: "하원", time: "16:10", id: 3 },
    { name: "최지우", status: "등원중", time: "15:05", id: 4 },
    { name: "정우진", status: "하원", time: "15:50", id: 5 },
    { name: "유나", status: "등원중", time: "15:30", id: 6 }
];

function renderAttendance() {
    const list = document.getElementById('attendanceList');
    list.innerHTML = students.map(s => `
        <div class="bg-gray-50 p-6 rounded-3xl flex justify-between items-center">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-lg">${s.name}</span>
                    <span class="text-[10px] px-2 py-0.5 ${s.status === '등원중' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'} rounded-full font-bold">학생</span>
                </div>
                <p class="text-xs text-gray-400">${s.status} 시각: ${s.time}</p>
            </div>
            <button class="bg-white p-2 rounded-2xl shadow-sm text-gray-400 hover:text-[#58d3d3]">
                <span class="material-symbols-outlined">more_vert</span>
            </button>
        </div>
    `).join('');
}

// Seat Grid Generation
function renderSeats() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = '';
    for (let i = 1; i <= 32; i++) {
        const isOccupied = Math.random() > 0.6;
        const seat = document.createElement('div');
        seat.className = `seat rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm ${isOccupied ? 'occupied text-red-700' : 'available text-emerald-700'}`;
        seat.textContent = i;
        seat.onclick = function() {
            document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
            if (!isOccupied) this.classList.add('selected');
        };
        grid.appendChild(seat);
    }
}

// Map Implementation
async function initMap() {
    try {
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        
        const pos = { lat: 37.498, lng: 127.060 };
        const map = new Map(document.getElementById("map"), {
            center: pos,
            zoom: 16,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: true,
            gestureHandling: 'greedy'
        });

        const pin = new PinElement({
            glyph: "🏫",
            scale: 1.5,
            background: "#58d3d3",
            borderColor: "#33b1b1",
        });

        const marker = new AdvancedMarkerElement({
            map,
            position: pos,
            content: pin.element,
            title: "꿈터공부방"
        });

        const header = document.createElement('span');
        header.textContent = "꿈터공부방 대치본점";
        header.style.fontWeight = 'bold';
        
        const content = document.createElement('div');
        content.innerHTML = "<p style='margin-top:5px;'>복잡한 학원관리, 출결톡이 쉽고 간단하게!</p>";

        const infoWindow = new InfoWindow({
            headerContent: header,
            content: content
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

    } catch (e) { console.log("Map failed to load", e); }
}

// ZIP Creation Logic
function downloadCodeZip() {
    const zip = new JSZip();
    
    // 1. Get HTML (Clone and clean)
    const htmlContent = document.documentElement.outerHTML;
    
    // 2. Get CSS
    const styleElement = document.getElementById('main-styles') || document.querySelector('style');
    const cssContent = styleElement ? styleElement.innerText : '';
    
    // 3. Get JS
    const jsContent = Array.from(document.querySelectorAll('script'))
        .map(s => s.innerText)
        .join('\n\n');

    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);
    zip.file("script.js", jsContent);

    zip.generateAsync({type:"blob"}).then(function(content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "studyroom_homepage.zip";
        link.click();
    });
}

window.onload = () => {
    renderAttendance();
    renderSeats();
};
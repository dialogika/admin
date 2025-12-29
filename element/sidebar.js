export function renderSidebar(target) {
    if (!target) return;
    target.innerHTML = `
        <style>
            #questBoardModal {
                padding: 0;
            }
            #questBoardModal .modal-dialog {
                position: fixed;
                top: 70px;
                left: 290px;
                right: 0;
                margin: 0;
                width: auto;
                margin : 20px;
                max-width: none;
                height: calc(100vh - 120px);
            }
            #questBoardModal .modal-content {
                height: 100%;
                border-radius: 16px;
                background: #ffffff;
                box-shadow: 0px 7px 9px -6px rgba(114, 4, 207, 1);
                border: 0;
            }
            #questBoardModal .modal-body {
                height: 100%;
                padding: 0;
            }
            #questBoardModal #questBoardFrame {
                width: 100%;
                height: 100%;
                border: 0;
            }
            #questBoardOverlay {
                position: fixed;
                inset: 0;
                
                z-index: 1049;
                display: none;
            }
            #questBoardOverlay.show {
                display: block;
            }
        </style>
        <!-- 2. SIDEBAR (Light, Smart Filters, Pending Widget) -->
        <aside class="sidebar" id="sidebarNav">
            
            <!-- WRAPPER UNTUK AREA YANG BISA DI-SCROLL -->
            <div class="sidebar-scroll-wrapper">
                
                <!-- Smart Filters (4 Kotak Besar) -->
                <div class="smart-filters-grid">
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-blue);"><i class="bi bi-archive-fill"></i></div><div class="filter-count">429</div></div>
                        <div class="filter-label">Quest</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-green);"><i class="bi bi-calendar-event-fill"></i></div><div class="filter-count" id="projectTasksTotalCount">0</div></div>
                        <div class="filter-label">Project</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon bg-icon-orange"><i class="bi bi-flag-fill"></i></div><div class="filter-count">21</div></div>
                        <div class="filter-label">Files</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon bg-icon-red"><i class="bi bi-calendar-check-fill"></i></div><div class="filter-count">30</div></div>
                        <div class="filter-label">Reminder</div>
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="nav-category">Main Navigation</div>
                <a href="#" class="sidebar-link active"><i class="bi bi-columns-gap"></i> Dashboard</a>
                <a href="#" class="sidebar-link"><i class="bi bi-list-columns-reverse"></i> Lineup <span class="sidebar-badge">4</span></a>
                <a href="#" class="sidebar-link"><i class="bi bi-chat-dots"></i> Pings</a>
                <a href="#" class="sidebar-link"><i class="bi bi-bell"></i> Hey!</a>
                <a href="#" class="sidebar-link"><i class="bi bi-activity"></i> Activity</a>
                <a href="#" class="sidebar-link"><i class="bi bi-person-circle"></i> My Stuff</a>

                <div class="nav-category mt-4">System</div>
                <a href="#" class="sidebar-link"><i class="bi bi-gear"></i> Settings</a>
                <a href="#" class="sidebar-link text-danger"><i class="bi bi-box-arrow-right"></i> Logout</a>

            </div> <!-- End Scroll Wrapper -->

            <!-- PENDING WIDGET (Pinned di Bawah, di luar scroll wrapper) -->
            <div class="pending-widget">
                <div class="fire-icon-wrapper"><i class="bi bi-fire fire-icon"></i></div>
                <h6 class="fw-bold" style="color:#0B2B6A; margin-bottom: 5px;">Pending Tasks</h6>
                <p class="small text-muted mb-3">You have 5 approvals waiting.</p>
                <button class="btn-review">Review Now</button>
                
                <!-- COPYRIGHT (Muncul hanya saat scroll mentok bawah) -->
                <div class="sidebarCopyright">
                    &copy; 2025 PT Dialogika Persona Indonesia
                </div>
            </div>

        </aside>

        <div id="questBoardOverlay"></div>

        <div class="modal fade" id="questBoardModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content border-0 rounded-4">
                    <div class="modal-body p-0">
                        <iframe id="questBoardFrame"></iframe>
                    </div>
                </div>
            </div>
        </div>
        `;

    const questCard = target.querySelector('.smart-filters-grid .filter-card');
    if (questCard) {
        questCard.addEventListener('click', (e) => {
            e.preventDefault();
            const modalEl = document.getElementById('questBoardModal');
            const frame = document.getElementById('questBoardFrame');
            window.closeQuestBoardModal = function () {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
                if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    instance.hide();
                }
            };
            const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quest Board - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        
        .description-truncate {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .nav-card {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: 2px solid transparent;
        }
        .nav-card:hover { transform: translateY(-4px); }
        .nav-card.active {
            border-color: rgba(0,0,0,0.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255,255,255,0.5);
            ring: 2px;
        }

        .icon-box {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(4px);
        }
        .btn-dlg-red {
            background: linear-gradient(to bottom, #e7181b 5%, #a31818 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: #fff;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-red:hover {
            background: linear-gradient(to bottom, #a31818 5%, #e7181b 100%);
            color: #fff;
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
        .btn-dlg-yellow {
            background: linear-gradient(to top, #f1ac15 22%, #fcf221 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: black;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-yellow:hover {
            background: linear-gradient(to top,#fcf221 22%, #f1ac15 100%);
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
    </style>
</head>
<body class="min-h-screen p-6 md:p-12" style="background: #fff;">

    <div class="max-w-4xl mx-auto">
        
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-extrabold tracking-tight">Quest Board</h1>
            <div class="flex items-center gap-3">
                <button class="btn-dlg-yellow rounded-full px-6 py-2.5 text-sm font-semibold shadow-md"
                    onclick="toggleQuestForm()">
                    + Create
                </button>
                <button class="btn-dlg-red rounded-full px-5 py-2 text-sm font-semibold shadow-md"
                    onclick="if (window.parent && window.parent.closeQuestBoardModal) { window.parent.closeQuestBoardModal(); }">
                    X
                </button>
            </div>
        </div>

        <div id="questCreateForm" class="mb-10 rounded-3xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 hidden">
            <div class="mb-6">
                <input type="text" placeholder="Quest Name"
                    class="w-full text-2xl md:text-3xl font-semibold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder-gray-400" />
            </div>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Department</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('questDepartmentDropdown').classList.toggle('hidden')">
                                    <span class="flex items-center gap-2">
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                                            <span class="text-xs font-semibold text-gray-500">D</span>
                                        </span>
                                        <span id="questDepartmentButtonLabel" class="text-xs md:text-sm">Select departments...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questDepartmentDropdown"
                                    class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3 hidden max-h-60 overflow-y-auto text-xs md:text-sm">
                                    <span class="text-gray-400 text-xs">Loading departments...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Assign to</div>
                        <div class="flex-1">
                            <button type="button"
                                class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-500">
                                <span class="flex items-center gap-2">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                                        <span class="text-xs font-semibold text-gray-500">U</span>
                                    </span>
                                    <span class="text-xs md:text-sm">Select user...</span>
                                </span>
                                <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Dates</div>
                        <div class="flex-1 flex flex-wrap items-center gap-2">
                            <input type="text" placeholder="dd/mm/yyyy"
                                class="w-28 md:w-32 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            <span class="text-gray-400">-</span>
                            <input type="text" placeholder="dd/mm/yyyy"
                                class="w-28 md:w-32 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Track time</div>
                        <button type="button"
                            class="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white">
                            Start
                        </button>
                    </div>
                </div>
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Priority</div>
                        <div class="flex-1">
                            <button type="button"
                                class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700">
                                <span class="flex items-center gap-2">
                                    <span class="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-500 text-white text-[10px] font-bold">
                                        !
                                    </span>
                                    <span class="text-xs md:text-sm">Normal</span>
                                </span>
                                <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Notify to</div>
                        <div class="flex-1">
                            <button type="button"
                                class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-500">
                                <span class="flex items-center gap-2">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                                        <span class="text-xs font-semibold text-gray-500">U</span>
                                    </span>
                                    <span class="text-xs md:text-sm">Select user...</span>
                                </span>
                                <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Task point</div>
                        <input type="number" min="0" placeholder="0"
                            class="w-24 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Tags</div>
                        <div class="flex-1">
                            <button type="button"
                                class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-500">
                                <span class="text-xs md:text-sm">Search or add tags...</span>
                                <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 text-xs text-gray-500">
                    <button type="button" class="px-2 py-1 font-semibold">B</button>
                    <button type="button" class="px-2 py-1 italic">I</button>
                    <button type="button" class="px-2 py-1 underline">U</button>
                    <button type="button" class="px-2 py-1">•</button>
                    <button type="button" class="px-2 py-1">1.</button>
                </div>
                <div contenteditable="true"
                    class="min-h-[120px] px-4 py-3 text-sm text-gray-700 outline-none"
                    data-placeholder="Task description or notes...">
                </div>
            </div>
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
                <button type="button"
                    class="rounded-full px-7 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200">
                    Cancel
                </button>
                <button type="button"
                    class="rounded-full px-8 py-2.5 text-sm font-semibold text-white"
                    style="background: radial-gradient(circle at 0% 0%, #a855f7 0%, #1d4ed8 60%, #0f172a 100%); box-shadow: 0 10px 25px rgba(59,130,246,0.35);">
                    Add to-do
                </button>
            </div>
        </div>

        <section class="mb-12">
            <div class="flex items-center gap-2 mb-6">
                <h2 class="text-2xl font-bold text-red-600">Overdue</h2>
            </div>
            
            <div class="space-y-8">
                <div class="flex items-start gap-4">
                    <div class="w-6 h-6 border-2 border-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <h3 class="text-xl font-bold leading-tight">Name Quest 1</h3>
                            <span class="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                24 Dec 2023 &nbsp;&nbsp; <i data-lucide="repeat" class="w-4 h-4 text-white"></i>
                            </span>
                            
                        </div>
                        <p class="text-gray-600 italic description-truncate text-sm mb-3">
                            description quest, anything about this quest, maximum words is two line, never create more about it, if the description is long give three dots in behind...
                        </p>
                        <div class="flex flex-col gap-3">
                            <div class="flex -space-x-2">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=1">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=2">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=3">
                                <div class="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">+2</div>
                            </div>
                            <div class="flex gap-2">
                                <span class="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Dev</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div class="w-6 h-6 border-2 border-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <h3 class="text-xl font-bold">Name Quest 2</h3>
                            <span class="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                25 Dec 2023 &nbsp;&nbsp; <i data-lucide="repeat" class="w-4 h-4 text-white"></i>
                            </span>
                            
                        </div>
                        <p class="text-gray-400 italic text-sm mb-3">No description provided.</p>
                        <div class="flex flex-col gap-3">
                            <div class="flex -space-x-2">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=4">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=5">
                            </div>
                            <div class="flex gap-2">
                                <span class="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Backlog</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Todays</h2>
            <div class="space-y-6">
                <div class="flex items-start gap-4">
                    <div class="w-6 h-6 border-2 border-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <h3 class="text-xl font-bold">Review Project Architecture</h3>
                            <span class="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                29 Dec 2023 &nbsp;&nbsp; <i data-lucide="repeat" class="w-4 h-4 text-white"></i>
                            </span>
                            
                        </div>
                        <p class="text-gray-600 italic description-truncate text-sm mb-3">
                            Selesaikan review modul autentikasi sebelum jam makan siang agar bisa lanjut ke bagian database.
                        </p>
                        <div class="flex flex-col gap-3">
                            <div class="flex -space-x-2">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=10">
                                <img class="w-7 h-7 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?u=11">
                            </div>
                            <div class="flex gap-2">
                                <span class="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Work</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="relative flex py-10 items-center">
            <div class="flex-grow border-t border-gray-200"></div>
            <span class="flex-shrink mx-6 text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Side Quest</span>
            <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <ul class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="tablist">
            <li class="nav-card active bg-[#FEE2E2] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('urgent', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="alert-circle" class="w-6 h-6 text-red-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">12</div>
                    <div class="text-xs font-bold text-red-700/60 uppercase tracking-widest">Urgent</div>
                </div>
            </li>
            <li class="nav-card bg-[#E0F2FE] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('high', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="trending-up" class="w-6 h-6 text-blue-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">08</div>
                    <div class="text-xs font-bold text-blue-700/60 uppercase tracking-widest">High</div>
                </div>
            </li>
            <li class="nav-card bg-[#FEF3C7] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('normal', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="box" class="w-6 h-6 text-amber-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">24</div>
                    <div class="text-xs font-bold text-amber-700/60 uppercase tracking-widest">Normal</div>
                </div>
            </li>
            <li class="nav-card bg-[#F3E8FF] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('low', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="users" class="w-6 h-6 text-purple-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">15</div>
                    <div class="text-xs font-bold text-purple-700/60 uppercase tracking-widest">Low</div>
                </div>
            </li>
        </ul>

        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm min-h-[250px] transition-all">
            <div id="urgent-content" class="tab-pane">
                <h4 class="text-red-600 font-black text-sm mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span class="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Urgent Tasks
                </h4>
                <div class="space-y-4">
                    <div class="p-4 rounded-2xl bg-gray-50 flex items-center justify-between">
                        <span class="font-bold text-gray-700">Database Migration</span>
                        <span class="text-xs bg-white px-3 py-1 rounded-full shadow-sm font-bold text-gray-400">#DB-01</span>
                    </div>
                    <div class="p-4 rounded-2xl bg-gray-50 flex items-center justify-between">
                        <span class="font-bold text-gray-700">Client Emergency Call</span>
                        <span class="text-xs bg-white px-3 py-1 rounded-full shadow-sm font-bold text-gray-400">#CS-09</span>
                    </div>
                </div>
            </div>
            
            <div id="high-content" class="tab-pane hidden">
                <h4 class="text-blue-600 font-black text-sm mb-6 uppercase tracking-widest">High Priority Tasks</h4>
                <p class="text-gray-400 italic">No tasks in this category yet.</p>
            </div>
            <div id="normal-content" class="tab-pane hidden">
                <h4 class="text-amber-600 font-black text-sm mb-6 uppercase tracking-widest">Normal Priority Tasks</h4>
                <p class="text-gray-400 italic">No tasks in this category yet.</p>
            </div>
            <div id="low-content" class="tab-pane hidden">
                <h4 class="text-purple-600 font-black text-sm mb-6 uppercase tracking-widest">Low Priority Tasks</h4>
                <p class="text-gray-400 italic">No tasks in this category yet.</p>
            </div>
        </div>

    </div>

    <script>
        lucide.createIcons();

        function switchTab(priority, element) {
            document.querySelectorAll('.nav-card').forEach(card => card.classList.remove('active'));
            element.classList.add('active');

            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.add('hidden'));
            document.getElementById(priority + '-content').classList.remove('hidden');
        }
        function toggleQuestForm() {
            var el = document.getElementById('questCreateForm');
            if (!el) return;
            if (el.classList.contains('hidden')) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
        function updateQuestDepartmentLabel() {
            var dropdown = document.getElementById('questDepartmentDropdown');
            var labelEl = document.getElementById('questDepartmentButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select departments...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-dept-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-dept-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select departments...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        async function loadQuestDepartments() {
            var dropdown = document.getElementById('questDepartmentDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading departments...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Departments not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "departments"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var color = d.color || "#0B2B6A";
                    var row = document.createElement('div');
                    row.className = 'quest-dept-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="inline-flex w-2.5 h-2.5 rounded-full" style="background:' + color + ';"></span>' +
                        '<span class="quest-dept-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-dept-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateQuestDepartmentLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateQuestDepartmentLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No departments available.</span>';
                } else {
                    updateQuestDepartmentLabel();
                }
            } catch (e) {
                console.error('Failed to load departments for quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load departments.</span>';
            }
        }
        loadQuestDepartments();
    </script>
</body>
</html>`;

            if (frame) {
                frame.srcdoc = html;
            }
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.add('show');
                }
                modalEl.addEventListener('hidden.bs.modal', () => {
                    const ov = document.getElementById('questBoardOverlay');
                    if (ov) {
                        ov.classList.remove('show');
                    }
                }, { once: true });
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            } else {
                const win = window.open("", "_blank");
                if (win) {
                    win.document.write(html);
                    win.document.close();
                }
            }
        });
    }
}

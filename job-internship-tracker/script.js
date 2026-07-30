// ==============================
// CAREERTRACK - JAVASCRIPT
// ==============================

let applications = JSON.parse(
    localStorage.getItem("careerTrackApplications")
) || [];

let editingId = null;


// ==============================
// GET ELEMENTS
// ==============================

const addApplicationBtn =
    document.getElementById("addApplicationBtn");

const applicationModal =
    document.getElementById("applicationModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const applicationForm =
    document.getElementById("applicationForm");

const applicationList =
    document.getElementById("applicationList");

const interviewList =
    document.getElementById("interviewList");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const themeBtn =
    document.getElementById("themeBtn");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const applicationsBtn =
    document.getElementById("applicationsBtn");

const interviewsBtn =
    document.getElementById("interviewsBtn");


// ==============================
// OPEN MODAL
// ==============================

addApplicationBtn.addEventListener("click", () => {

    editingId = null;

    document.getElementById("modalTitle").textContent =
        "Add Application";

    document.getElementById("saveBtn").textContent =
        "Add Application";

    applicationForm.reset();

    applicationModal.classList.add("show");

});


// ==============================
// CLOSE MODAL
// ==============================

function closeModal() {

    applicationModal.classList.remove("show");

    editingId = null;

    applicationForm.reset();

}

closeModalBtn.addEventListener("click", closeModal);

cancelBtn.addEventListener("click", closeModal);


// ==============================
// CLICK OUTSIDE MODAL
// ==============================

applicationModal.addEventListener("click", (event) => {

    if (event.target === applicationModal) {
        closeModal();
    }

});


// ==============================
// ADD / EDIT APPLICATION
// ==============================

applicationForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const company =
        document.getElementById("company").value.trim();

    const position =
        document.getElementById("position").value.trim();
const jobLink =
    document.getElementById("jobLink").value.trim();
    const applicationDate =
        document.getElementById("applicationDate").value;

    const interviewDate =
        document.getElementById("interviewDate").value;

    const interviewTime =
        document.getElementById("interviewTime").value;

    const notes =
        document.getElementById("notes").value.trim();

    const status =
        document.getElementById("status").value;


    if (
        company === "" ||
        position === "" ||
        applicationDate === ""
    ) {

        alert("Please fill in the required fields.");

        return;
    }


    // EDIT

    if (editingId !== null) {

        const application =
            applications.find(
                app => app.id === editingId
            );

        if (application) {

            application.company = company;
            application.position = position;
            application.applicationDate = applicationDate;
            application.interviewDate = interviewDate;
            application.interviewTime = interviewTime;
            application.notes = notes;
            application.status = status;

        }

    }

    // ADD

    else {

        const newApplication = {

            id: Date.now(),

            company: company,

            position: position,
            jobLink: jobLink,

            applicationDate: applicationDate,

            interviewDate: interviewDate,

            interviewTime: interviewTime,

            notes: notes,

            status: status

        };

        applications.push(newApplication);

    }


    saveApplications();

    closeModal();

    renderAll();

});


// ==============================
// SAVE APPLICATIONS
// ==============================

function saveApplications() {

    localStorage.setItem(
        "careerTrackApplications",
        JSON.stringify(applications)
    );

}


// ==============================
// DELETE APPLICATION
// ==============================

function deleteApplication(id) {

    const answer =
        confirm("Delete this application?");

    if (!answer) return;

    applications =
        applications.filter(
            application => application.id !== id
        );

    saveApplications();

    renderAll();

}


// ==============================
// EDIT APPLICATION
// ==============================

function editApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );

    if (!application) return;


    editingId = id;


    document.getElementById("modalTitle").textContent =
        "Edit Application";

    document.getElementById("saveBtn").textContent =
        "Update Application";


    document.getElementById("company").value =
        application.company;

    document.getElementById("position").value =
        application.position;

    document.getElementById("applicationDate").value =
        application.applicationDate;

    document.getElementById("interviewDate").value =
        application.interviewDate || "";

    document.getElementById("interviewTime").value =
        application.interviewTime || "";

    document.getElementById("notes").value =
        application.notes || "";

    document.getElementById("status").value =
        application.status;


    applicationModal.classList.add("show");

}


// ==============================
// DISPLAY APPLICATIONS
// ==============================

function renderApplications() {

    const search =
        searchInput.value.toLowerCase().trim();

    const filter =
        statusFilter.value;


    const filtered =
        applications.filter(application => {

            const matchesSearch =

                application.company
                    .toLowerCase()
                    .includes(search)

                ||

                application.position
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                filter === "All"

                ||

                application.status === filter;


            return matchesSearch && matchesStatus;

        });


    applicationList.innerHTML = "";


    if (filtered.length === 0) {

        applicationList.innerHTML = `
            <div class="empty">

                <h3>📭 No applications found</h3>

                <p>
                    Click "+ Add Application"
                    to add one.
                </p>

            </div>
        `;

        return;

    }


    filtered.forEach(application => {

        const card =
            document.createElement("div");

        card.className =
            "application-card";


        const statusClass =
            "status-" +
            application.status.toLowerCase();


        card.innerHTML = `

            <h3>
                🏢 ${escapeHTML(application.company)}
            </h3>

            <p>
                <strong>Position:</strong>
                ${escapeHTML(application.position)}
            </p>

            <p>
                <strong>Applied:</strong>
                ${formatDate(application.applicationDate)}
            </p>
            ${
    application.jobLink
    ?
    `
    <p>
        🔗 <a
            href="${escapeHTML(application.jobLink)}"
            target="_blank"
            rel="noopener noreferrer"
        >
            View Job Posting
        </a>
    </p>
    `
    :
    ""
}

            <span class="status ${statusClass}">
                ${application.status}
            </span>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editApplication(${application.id})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${application.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        applicationList.appendChild(card);

    });

}


// ==============================
// DISPLAY INTERVIEWS
// ==============================

function renderInterviews() {

    const interviews =
        applications.filter(
            application =>
                application.status === "Interview"
        );


    interviewList.innerHTML = "";


    if (interviews.length === 0) {

        interviewList.innerHTML = `
            <div class="empty">

                <h3>🎤 No interviews yet</h3>

                <p>
                    Applications marked as
                    "Interview" will appear here.
                </p>

            </div>
        `;

        return;

    }


    interviews.forEach(application => {

        const card =
            document.createElement("div");

        card.className =
            "application-card";


        let interviewInfo = "Date not added";

        if (application.interviewDate) {

            interviewInfo =
                formatDate(application.interviewDate);

        }


        if (application.interviewTime) {

            interviewInfo +=
                " at " +
                application.interviewTime;

        }


        card.innerHTML = `

            <h3>
                🎤 ${escapeHTML(application.company)}
            </h3>

            <p>
                <strong>Position:</strong>
                ${escapeHTML(application.position)}
            </p>

            <p>
                <strong>Interview:</strong>
                ${interviewInfo}
            </p>

            ${
                application.notes
                ?
                `
                <p>
                    <strong>Notes:</strong>
                    ${escapeHTML(application.notes)}
                </p>
                `
                :
                ""
            }

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editApplication(${application.id})"
                >
                    ✏️ Edit
                </button>

            </div>

        `;


        interviewList.appendChild(card);

    });

}


// ==============================
// UPDATE STATISTICS
// ==============================

function updateStatistics() {

    const total =
        applications.length;


    const applied =
        applications.filter(
            app => app.status === "Applied"
        ).length;


    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;


    const selected =
        applications.filter(
            app => app.status === "Selected"
        ).length;


    document.getElementById(
        "totalApplications"
    ).textContent = total;


    document.getElementById(
        "appliedCount"
    ).textContent = applied;


    document.getElementById(
        "interviewCount"
    ).textContent = interviews;


    document.getElementById(
        "selectedCount"
    ).textContent = selected;
    

}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener(
    "input",
    renderApplications
);


// ==============================
// FILTER
// ==============================

statusFilter.addEventListener(
    "change",
    renderApplications
);


// ==============================
// DARK MODE
// ==============================

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        themeBtn.textContent =
            dark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";


        localStorage.setItem(
            "careerTrackDarkMode",
            dark
        );

    }
);


// ==============================
// LOAD DARK MODE
// ==============================

if (
    localStorage.getItem(
        "careerTrackDarkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

    themeBtn.textContent =
        "☀️ Light Mode";

}


// ==============================
// NAVIGATION
// ==============================

function removeActive() {

    dashboardBtn.classList.remove("active");

    applicationsBtn.classList.remove("active");

    interviewsBtn.classList.remove("active");

}


dashboardBtn.addEventListener(
    "click",
    () => {

        removeActive();

        dashboardBtn.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


applicationsBtn.addEventListener(
    "click",
    () => {

        removeActive();

        applicationsBtn.classList.add("active");

        document.getElementById(
            "applicationsSection"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }
);


interviewsBtn.addEventListener(
    "click",
    () => {

        removeActive();

        interviewsBtn.classList.add("active");

        document.getElementById(
            "interviewList"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ==============================
// FORMAT DATE
// ==============================

function formatDate(dateString) {

    if (!dateString) {
        return "Not added";
    }

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==============================
// SECURITY
// ==============================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// ==============================
// RENDER EVERYTHING
// ==============================

function renderAll() {

    renderApplications();

    renderInterviews();

    updateStatistics();

}


// ==============================
// START APP
// ==============================

renderAll();